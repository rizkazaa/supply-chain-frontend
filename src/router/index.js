import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import UserView from "../views/UserView.vue";
import LoginView from "../views/LoginView.vue";
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import { useAuthStore } from "@/store/authStore";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { hideHeader: true, hideSidebar: true },
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },

      {
        path: "register",
        name: "register",
        component: Register,
      },
    ],
  },

  {
    path: "/admin/:component?",
    name: "supplier",
    component: AdminView,
    props: true,
    meta: { requiresAuth: true, role: "SUPPLIER" },
  },

  {
    path: "/user/:component?",
    name: "stakeholder",
    component: UserView,
    props: true,
    meta: { requiresAuth: true, role: "STAKEHOLDER" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const userRole = authStore.role;

  if (to.meta.requiresAuth) {
    if (isAuthenticated) {
      if (userRole === to.meta.role || to.meta.role === undefined) {
        next();
      } else {
        next({ name: "home" });
      }
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

export default router;
