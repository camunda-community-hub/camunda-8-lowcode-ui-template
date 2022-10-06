package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import java.awt.Color;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import org.apache.commons.io.IOUtils;
import org.apache.commons.text.StringSubstitutor;
import org.example.camunda.process.solution.jsonmodel.Theme;
import org.example.camunda.process.solution.utils.ColorUtils;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ThemeService {

  public static final String THEMES = "themes";

  private Map<String, Theme> themes = new HashMap<>();

  private Theme activeTheme = null;

  private static Map<String, String> templates = new HashMap<>();

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolveTheme(String name) {
    return Path.of(workspace).resolve(THEMES).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(THEMES).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public Theme findByName(String name) throws StreamReadException, DatabindException, IOException {
    return JsonUtils.fromJsonFile(resolveTheme(name), Theme.class);
  }

  public Theme saveTheme(Theme theme) throws IOException {
    theme.setModified(new Date());
    JsonUtils.toJsonFile(resolveTheme(theme.getName()), theme);
    themes.put(theme.getName(), theme);
    if (theme.isActive()) {
      if (!activeTheme.getName().equals(theme.getName())) {
        activeTheme.setActive(false);
        saveTheme(activeTheme);
      }
      activeTheme = theme;
    }
    return theme;
  }

  public void saveThemes() throws IOException {
    for (Theme theme : themes.values()) {
      saveTheme(theme);
    }
  }

  public void deleteByName(String name) throws IOException {
    Files.delete(resolveTheme(name));
  }

  public String generateButtons(String variant, String hexColor) throws IOException {
    Color color = ColorUtils.fromHex(hexColor);
    String btn = ".btn-" + variant;
    String btnOutline = ".btn-outline-" + variant;
    String textColor = "#fff";

    if (ColorUtils.isBright(color)) {
      textColor = "#212529";
    }
    String activeBackground = ColorUtils.toHex(ColorUtils.darker(color, 0.2));
    String activeBorder = ColorUtils.toHex(ColorUtils.darker(color, 0.25));
    String focusHoverBackground = ColorUtils.toHex(ColorUtils.darker(color, 0.15));
    String focusHoverBorder = ColorUtils.toHex(ColorUtils.darker(color, 0.2));
    Color focusShadowColor = ColorUtils.getFocusShadow(color);
    String focusShadowRgb =
        focusShadowColor.getRed()
            + " "
            + focusShadowColor.getGreen()
            + " "
            + focusShadowColor.getBlue();

    StringSubstitutor sub =
        new StringSubstitutor(
            Map.of(
                "btn",
                btn,
                "btnOutline",
                btnOutline,
                "color",
                hexColor,
                "textColor",
                textColor,
                "activeBackgroundColor",
                activeBackground,
                "activeBorderColor",
                activeBorder,
                "hoverFocusBackgroundColor",
                focusHoverBackground,
                "hoverFocusBorderColor",
                focusHoverBorder,
                "focusShadow",
                focusShadowRgb));

    return sub.replace(getTemplate("buttons"));
  }

  public String generateUtilities(String variant, String hexColor) throws IOException {
    Color color = ColorUtils.fromHex(hexColor);

    String darkerColor = ColorUtils.toHex(ColorUtils.darker(color, 0.2));
    String darker40Color = ColorUtils.toHex(ColorUtils.darker(color, 0.4));
    String brigther80Color = ColorUtils.toHex(ColorUtils.brighter(color, 0.8));
    String brigther70Color = ColorUtils.toHex(ColorUtils.brighter(color, 0.7));

    StringSubstitutor sub =
        new StringSubstitutor(
            Map.of(
                "variant",
                variant,
                "color",
                hexColor,
                "darkerColor",
                darkerColor,
                "darker40Color",
                darker40Color,
                "brigther80Color",
                brigther80Color,
                "brigther70Color",
                brigther70Color));

    return sub.replace(getTemplate("utilities"));
  }

  public String getTemplate(String templateName) throws IOException {
    if (templates.containsKey(templateName)) {
      return templates.get(templateName);
    }
    String template =
        IOUtils.toString(
            this.getClass().getClassLoader().getResourceAsStream("css/" + templateName + ".css"),
            Charset.defaultCharset());
    templates.put(templateName, template);
    return template;
  }

  public Theme activate(String themeName, boolean persist) throws IOException {
    activeTheme = themes.get(themeName);

    for (Theme theme : themes.values()) {
      theme.setActive(false);
    }
    activeTheme.setActive(true);

    if (persist) {
      saveThemes();
    }
    return activeTheme;
  }

  public Theme getActiveTheme() {
    return activeTheme;
  }

  public String generateCss(Map<String, String> variables) throws IOException {
    StringBuilder css = new StringBuilder();
    for (Map.Entry<String, String> variantColor : variables.entrySet()) {
      css.append(generateButtons(variantColor.getKey(), variantColor.getValue()));
      css.append(generateUtilities(variantColor.getKey(), variantColor.getValue()));
    }
    return css.toString();
  }

  @PostConstruct
  private void loadThemes() throws IOException {
    File[] orgs = Path.of(workspace).resolve(THEMES).toFile().listFiles();
    if (orgs != null) {
      for (File file : orgs) {
        Theme theme = JsonUtils.fromJsonFile(file.toPath(), Theme.class);
        themes.put(theme.getName(), theme);
        if (theme.isActive()) {
          activeTheme = theme;
        }
      }
    }
    if (themes.isEmpty()) {
      Map<String, String> variables =
          Map.of(
              "primary",
              "#17428c",
              "secondary",
              "#6c757d",
              "success",
              "#198754",
              "danger",
              "#dc3545",
              "warning",
              "#ffc107",
              "info",
              "#0dcaf0",
              "light",
              "#f8f9fa",
              "dark",
              "#212529");

      activeTheme = new Theme("defaultTheme", generateCss(variables));
      activeTheme.setVariables(variables);
      activeTheme.setActive(true);
      saveTheme(activeTheme);
    }
  }
}
