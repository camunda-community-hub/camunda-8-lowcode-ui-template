package org.example.camunda.process.solution.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.exception.TechnicalException;
import org.example.camunda.process.solution.facade.dto.AuthUser;
import org.example.camunda.process.solution.jsonmodel.User;
import org.springframework.beans.BeanUtils;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

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
    return getJWTToken(user.getUsername(), user.getEmail(), user.getProfile());
  }

  public static String getJWTToken(String username, String email, String profile) {
    List<String> grantedAuthorities = new ArrayList<String>();
    grantedAuthorities.add("ROLE_" + profile);

    UserPrincipal principal = new UserPrincipal();
    principal.setUsername(username);
    principal.setEmail(email);

    String token =
        Jwts.builder()
            .setId("CamundaJwt")
            .setSubject(username)
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

    if (authentication instanceof AnonymousAuthenticationToken) {
      String username = "anonymous";
      String email = "";
      return new UserPrincipal(username, email);
    }
    if (authentication instanceof OAuth2AuthenticationToken) {
      OAuth2User user = ((OAuth2AuthenticationToken) authentication).getPrincipal();

      return new UserPrincipal(user.getAttribute("preferred_username"), user.getAttribute("email"));
    }

    LinkedHashMap<String, Object> principalUser =
        (LinkedHashMap<String, Object>) authentication.getPrincipal();
    String username = (String) principalUser.get("username");
    String email = (String) principalUser.get("email");
    return new UserPrincipal(username, email);
  }

  public static String getProfile() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    Iterator<? extends GrantedAuthority> it = authorities.iterator();
    String profile = "user";
    while (it.hasNext()) {
      if (it.next().getAuthority().toLowerCase().equals("role_admin")) {
        return "Admin";
      }
      if (it.next().getAuthority().toLowerCase().equals("role_editor")) {
        profile = "Editor";
      }
    }
    return profile;
  }

  public static AuthUser getAuthUser(User user) {
    AuthUser authUser = new AuthUser();
    if (user == null) {
      authUser.setUsername("anonymous");
      return authUser;
    }
    BeanUtils.copyProperties(user, authUser);
    authUser.setToken(getJWTToken(user));
    return authUser;
  }

  public static AuthUser getOAuth2User() {
    AuthUser user = new AuthUser();
    OAuth2User principal =
        ((OAuth2AuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
            .getPrincipal();
    List<String> roles =
        ((Map<String, List<String>>) principal.getAttribute("realm_access")).get("roles");

    user.setUsername(principal.getAttribute("given_name"));
    user.setEmail(principal.getAttribute("email"));
    user.setProfile("User");
    if (roles.contains("ROLE_Admin") || roles.contains("Admin")) {
      user.setProfile("Admin");
    } else if (roles.contains("ROLE_Editor") || roles.contains("Editor")) {
      user.setProfile("Editor");
    }
    List<String> groups = (List<String>) principal.getAttribute("groups");
    if (groups != null) {
      user.setGroups(new HashSet<>(groups));
    }
    user.setToken("oauth2");
    return user;
  }
}
