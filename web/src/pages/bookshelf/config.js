import API from "@api";
import {
  applyReadConfig,
  loadLocalReadConfig,
  syncThemeWithColorMode
} from "@/hooks/theme";
import "@/assets/bookshelf.css";

const applyInitialReadConfig = (appConfigData) => {
  if (appConfigData) {
    try {
      applyReadConfig(JSON.parse(appConfigData));
    } catch {
    }
  }

  loadLocalReadConfig();
};

/**
 * 加载配置
 */
API.getReadConfig()
  .then((res) => {
    applyInitialReadConfig(res.data.data);
    syncThemeWithColorMode();
  })
  .catch(() => {
    // 后端未连接时仍使用本地配置和系统主题，保证页面主题显示正确
    loadLocalReadConfig();
    syncThemeWithColorMode(undefined, { upload: false, persist: false });
  });
