import { palette } from "./palette"

/**
 * Roles for colors.  Prefer using these over the palette.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
export const color = {
  /**
   * The palette is available to use, but prefer using the name.
   */
  palette,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The screen background.
   */
  backgroundPrimary: palette.lightGray,
  /**
   * The screen background.
   */
  backgroundWhite: palette.white,
  /**
   * The main tinting color.
   */
  primary: palette.yellow,
  /**
   * Success message and background color.
   */
  success: palette.green,
  /**
   * A subtle color used for borders and lines.
   */
  line: palette.lightGray,
  /**
   * Warning message and background color.
   */
  warning: palette.yellow,
  /**
   * Secondary information.
   */
  dim: palette.darkGray,
  /**
   * Error messages and background and icons color.
   */
  error: palette.red,
  /**
   * The disable button.
   */
  disable: palette.gray,
  /**
   * Color text of dark theme.
   */
  textWhite: palette.white,
  /**
   * Default color text
   */
  textBlack: palette.black,

  background: palette.lighterGrey,
  mainTheme: palette.yellow,

  grey: palette.lighterGrey,
  lightWeightGrey: palette.lightweightGray,
  snow: "#FFFFFF",
  black: "#000000",
  darkGreen: palette.darkGreen,
}
