package org.example.camunda.process.solution.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import org.example.camunda.process.solution.exception.TechnicalException;
import org.example.camunda.process.solution.jsonmodel.User;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public final class SecurityUtils {
  public static final String PREFIX_TOKEN = "Bearer ";
  public static final String SECRET_KEY =
      "SomethingFixedToSimplify"; // UUID.randomUUID().toString();
  private static BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

  private SecurityUtils() {}

  public static String cryptPwd(String clear) throws TechnicalException {
    return bCryptPasswordEncoder.encode(clear);
  }

  public static boolean matches(String pwd, String encodedpassword) {
    return bCryptPasswordEncoder.matches(pwd, encodedpassword);
  }

  public static String getJWTToken(User user) {
    List<String> grantedAuthorities = new ArrayList<String>();
    grantedAuthorities.add("ROLE_" + user.getProfile());

    UserPrincipal principal = new UserPrincipal();
    BeanUtils.copyProperties(user, principal);
    String token =
        Jwts.builder()
            .setId("CamundaJwt")
            .setSubject(user.getEmail())
            .claim("principal", principal)
            .claim("authorities", grantedAuthorities)
            .setExpiration(new Date(System.currentTimeMillis() + 5 * 86400000))
            .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes())
            .compact();

    return token;
  }

  @SuppressWarnings("unchecked")
  public static UserPrincipal getConnectedUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    LinkedHashMap<String, Object> principalUser =
        (LinkedHashMap<String, Object>) authentication.getPrincipal();
    String username = (String) principalUser.get("username");
    String email = (String) principalUser.get("email");
    return new UserPrincipal(username, email);
  }
}
