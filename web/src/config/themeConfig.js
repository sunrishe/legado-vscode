import body_0 from "../assets/imgs/themes/body_0.png";
import content_0 from "../assets/imgs/themes/content_0.png";
import popup_0 from "../assets/imgs/themes/popup_0.png";
import body_1 from "../assets/imgs/themes/body_1.png";
import content_1 from "../assets/imgs/themes/content_1.png";
import popup_1 from "../assets/imgs/themes/popup_1.png";
import body_2 from "../assets/imgs/themes/body_2.png";
import content_2 from "../assets/imgs/themes/content_2.png";
import popup_2 from "../assets/imgs/themes/popup_2.png";
import body_3 from "../assets/imgs/themes/body_3.png";
import content_3 from "../assets/imgs/themes/content_3.png";
import popup_3 from "../assets/imgs/themes/popup_3.png";
import body_5 from "../assets/imgs/themes/body_5.png";
import content_5 from "../assets/imgs/themes/content_5.png";
import popup_5 from "../assets/imgs/themes/popup_5.png";
import body_6 from "../assets/imgs/themes/body_6.png";
import content_6 from "../assets/imgs/themes/content_6.png";
import popup_6 from "../assets/imgs/themes/popup_6.png";
var settings = {
  themes: [
    {
      body: "#ede7da url(" + body_0 + ") repeat",
      content: "#ede7da url(" + content_0 + ") repeat",
      popup: "#ede7da url(" + popup_0 + ") repeat"
    },
    {
      body: "#ede7da url(" + body_1 + ") repeat",
      content: "#ede7da url(" + content_1 + ") repeat",
      popup: "#ede7da url(" + popup_1 + ") repeat"
    },
    {
      body: "#ede7da url(" + body_2 + ") repeat",
      content: "#ede7da url(" + content_2 + ") repeat",
      popup: "#ede7da url(" + popup_2 + ") repeat"
    },
    {
      body: "#ede7da url(" + body_3 + ") repeat",
      content: "#ede7da url(" + content_3 + ") repeat",
      popup: "#ede7da url(" + popup_3 + ") repeat"
    },
    {
      body: "#ebcece repeat",
      content: "#f5e4e4 repeat",
      popup: "#faeceb repeat"
    },
    {
      body: "#ede7da url(" + body_5 + ") repeat",
      content: "#ede7da url(" + content_5 + ") repeat",
      popup: "#ede7da url(" + popup_5 + ") repeat"
    },
    {
      body: "#ede7da url(" + body_6 + ") repeat",
      content: "#ede7da url(" + content_6 + ") repeat",
      popup: "#ede7da url(" + popup_6 + ") repeat"
    }
  ],
  fonts: [
    "Microsoft YaHei, PingFangSC-Regular, HelveticaNeue-Light, Helvetica Neue Light, sans-serif",

    "PingFangSC-Regular, -apple-system, Simsun",

    "Kaiti"
  ]
};

export const DEFAULT_LIGHT_THEME_INDEX = 0;
export const DARK_THEME_INDEX = settings.themes.length - 1;
export const LIGHT_FONT_COLOR = "#262626";
export const DARK_FONT_COLOR = "#B5B5B5";
export const LIGHT_SCROLLBAR_THEME = { thumb: "#b8a88f", hover: "#9f8b6f" };
export const DARK_SCROLLBAR_THEME = { thumb: "#555b61", hover: "#6f767d" };

export const isDarkTheme = (theme) => theme === DARK_THEME_INDEX;

export const getScrollbarTheme = (theme) => {
  return isDarkTheme(theme) ? DARK_SCROLLBAR_THEME : LIGHT_SCROLLBAR_THEME;
};

export default settings;
