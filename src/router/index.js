import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/auth",
    component: () => import("../views/AuthChoice.vue"),
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/community",
    component: () => import("../views/Community.vue"),
  },

  {
    path: "/admin",
    component: () => import("../views/Admin.vue"),
  },
  {
    path: "/admin/bags",
    component: () => import("../views/AdminBags.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
