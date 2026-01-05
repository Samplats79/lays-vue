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
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/bags",
    component: () => import("../views/AdminBags.vue"),
    meta: { requiresAdmin: true },
  },
];

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta?.requiresAdmin) {
    next();
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    next("/login");
    return;
  }

  const payload = parseJwt(token);
  const isAdmin = payload?.role === "admin" || payload?.email === "admin@admin.com";

  if (!isAdmin) {
    next("/");
    return;
  }

  next();
});

export default router;
