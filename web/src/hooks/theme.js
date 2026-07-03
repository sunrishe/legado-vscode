import API from "@api";
import {
  DARK_FONT_COLOR,
  DARK_THEME_INDEX,
  DEFAULT_LIGHT_THEME_INDEX,
  LIGHT_FONT_COLOR,
  isDarkTheme
} from "@/config/themeConfig";
import { useBookStore } from "@/store";

const COLOR_MODE_STORAGE_KEY = "legadoColorMode";
const READ_CONFIG_STORAGE_KEY = "config";
const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const normalizeColorMode = (mode) => {
  return mode === "dark" ? "dark" : "light";
};

const getBrowserColorMode = () => {
  return window.matchMedia?.(DARK_MODE_MEDIA_QUERY).matches ? "dark" : "light";
};

const isVscodeWebview = () => {
  return (
    typeof window.acquireVsCodeApi === "function" ||
    document.body.classList.contains("vscode-dark") ||
    document.body.classList.contains("vscode-light") ||
    document.body.classList.contains("vscode-high-contrast")
  );
};

export const getColorMode = () => {
  if (!isVscodeWebview()) {
    return getBrowserColorMode();
  }

  return normalizeColorMode(localStorage.getItem(COLOR_MODE_STORAGE_KEY) || getBrowserColorMode());
};

export const applyReadConfig = (config) => {
  if (!config) return;
  const store = useBookStore();
  const nextConfig = Object.assign({}, store.config, config);
  store.setConfig(nextConfig);
  return nextConfig;
};

export const loadLocalReadConfig = () => {
  try {
    return applyReadConfig(JSON.parse(localStorage.getItem(READ_CONFIG_STORAGE_KEY)));
  } catch {
    localStorage.removeItem(READ_CONFIG_STORAGE_KEY);
  }
};

export const saveReadConfig = (config, options = {}) => {
  const { upload = true } = options;
  const nextConfig = applyReadConfig(config);
  localStorage.setItem(READ_CONFIG_STORAGE_KEY, JSON.stringify(nextConfig));
  if (upload) {
    API.saveReadConfig(nextConfig).catch(() => {});
  }
};

export const applyElementPlusTheme = (mode = getColorMode()) => {
  const colorMode = normalizeColorMode(mode);
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
  document.documentElement.classList.toggle("dark", colorMode === "dark");
};

export const syncThemeWithColorMode = (mode = getColorMode(), options = {}) => {
  const colorMode = normalizeColorMode(mode);
  const store = useBookStore();
  const config = Object.assign({}, store.config);
  const wasDark = isDarkTheme(config.theme);
  const { upload = true } = options;
  let changed = false;

  applyElementPlusTheme(colorMode);

  if (colorMode === "dark") {
    if (!wasDark || config.fontColor !== DARK_FONT_COLOR) {
      config.theme = DARK_THEME_INDEX;
      config.fontColor = DARK_FONT_COLOR;
      changed = true;
    }
  } else if (wasDark) {
    config.theme = DEFAULT_LIGHT_THEME_INDEX;
    config.fontColor = LIGHT_FONT_COLOR;
    changed = true;
  }

  if (changed) {
    saveReadConfig(config, { upload });
  }
};

export const setReadingTheme = (theme) => {
  const store = useBookStore();
  const config = Object.assign({}, store.config);
  const nextTheme = Number(theme);

  config.theme = nextTheme;
  if (isDarkTheme(nextTheme)) {
    config.fontColor = DARK_FONT_COLOR;
    applyElementPlusTheme("dark");
  } else {
    config.fontColor = LIGHT_FONT_COLOR;
    applyElementPlusTheme("light");
  }

  saveReadConfig(config);
};

export const toggleColorMode = () => {
  const store = useBookStore();
  syncThemeWithColorMode(isDarkTheme(store.config.theme) ? "light" : "dark");
};

export const initThemeSync = () => {
  syncThemeWithColorMode(undefined, { upload: false });

  if (!isVscodeWebview()) {
    const mediaQuery = window.matchMedia?.(DARK_MODE_MEDIA_QUERY);
    const handleBrowserThemeChange = (event) => {
      syncThemeWithColorMode(event.matches ? "dark" : "light");
    };
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", handleBrowserThemeChange);
    } else {
      mediaQuery?.addListener?.(handleBrowserThemeChange);
    }
  }

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message?.command !== "colorMode") return;
    syncThemeWithColorMode(message.value);
  });
};
