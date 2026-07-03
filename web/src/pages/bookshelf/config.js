import API from "@api";
import { applyReadConfig, loadLocalReadConfig, syncThemeWithColorMode } from "@/hooks/theme";
import "@/assets/bookshelf.css";

/**
 * 加载配置
 */
API.getReadConfig()
  .then((res) => {
    var data = res.data.data;
    if (data) {
      applyReadConfig(JSON.parse(data));
    } else {
      loadLocalReadConfig();
    }
    syncThemeWithColorMode();
  })
  .catch(() => {
    // 后端未连接时仍使用本地配置和系统主题，保证页面主题显示正确
    loadLocalReadConfig();
    syncThemeWithColorMode(undefined, { upload: false });
  });
