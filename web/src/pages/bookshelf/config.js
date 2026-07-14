import API from "@api";
import {
  applyReadConfig,
  getLocalReadConfig,
  loadLocalReadConfig,
  syncThemeWithColorMode
} from "@/hooks/theme";
import "@/assets/bookshelf.css";

const applyInitialReadConfig = (appConfigData) => {
  if (appConfigData) {
    try {
      applyReadConfig(JSON.parse(appConfigData));
      return;
    } catch {
      localStorage.removeItem("config");
    }
  }

  const localConfig = getLocalReadConfig();
  if (localConfig) {
    applyReadConfig(localConfig);
  }
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
