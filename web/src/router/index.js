import { createWebHashHistory, createRouter } from "vue-router";
import { bookRoutes } from "./bookRouter";

const router = createRouter({
  //   history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  // @ts-ignore
  routes: bookRoutes
});

router.afterEach((to) => {
  if (to.name == "shelf") document.title = localStorage.getItem("legadoPanelTitle") || "书架";
});
export default router;
