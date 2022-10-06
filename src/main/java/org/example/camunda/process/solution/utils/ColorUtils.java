package org.example.camunda.process.solution.utils;

import java.awt.Color;

public class ColorUtils {

  private ColorUtils() {}

  public static Color fromHex(String hex) {
    return Color.decode(hex);
  }

  public static String toHex(Color color) {
    return String.format("#%02x%02x%02x", color.getRed(), color.getGreen(), color.getBlue());
  }

  public static Color brighter(Color color, double percent) {
    double factor = 1 - percent;
    int r = (int) (color.getRed() * (1 - percent) + 255 * percent);
    int g = (int) (color.getGreen() * (1 - percent) + 255 * percent);
    int b = (int) (color.getBlue() * (1 - percent) + 255 * percent);
    int alpha = color.getAlpha();

    return new Color(Math.min(r, 255), Math.min(g, 255), Math.min(b, 255), alpha);
  }

  public static Color darker(Color color, double percent) {
    double factor = 1 - percent;
    return new Color(
        Math.max((int) (color.getRed() * factor), 0),
        Math.max((int) (color.getGreen() * factor), 0),
        Math.max((int) (color.getBlue() * factor), 0),
        color.getAlpha());
  }

  public static boolean isBright(Color color) {

    var luma = 0.2126 * color.getRed() + 0.7152 * color.getGreen() + 0.0722 * color.getBlue();

    // range from 0 to 255
    return luma > 130;
  }

  public static Color getFocusShadow(Color color) {
    if (isBright(color)) {
      return new Color(
          Math.max(color.getRed() - 38, 0),
          Math.max(color.getGreen() - 38, 0),
          Math.max(color.getBlue() - 38, 0),
          128);
    }
    return new Color(
        Math.min(color.getRed() + 38, 255),
        Math.min(color.getGreen() + 38, 255),
        Math.min(color.getBlue() + 38, 255),
        128);
  }
}
