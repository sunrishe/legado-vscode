import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "element-plus/theme-chalk/dark/css-vars.css";
import { initThemeSync } from "@/hooks/theme";

const app = createApp(App).use(store).use(router);

initThemeSync();
app.mount("#app");

import("./pages/bookshelf/config");
