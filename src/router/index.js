import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/configurator",
    component: () => import("../views/Configurator.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.path === "/configurator" && !token) return "/login";
  if (to.path === "/login" && token) return "/configurator";
  return true;
});

export default router;
