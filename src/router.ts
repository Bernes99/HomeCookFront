import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
} from "vue-router";
import axios from "axios";
import { queryClient } from "./Query";
import { IsLogin } from "./Interfejsy";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("./components/HelloWorld.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("./components/admin/AdminPanel.vue"),
    meta: { accessLevel: "admin" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./components/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./components/auth/Register.vue"),
  },
  {
    path: "/recepies/:id",
    name: "recepie",
    component: () => import("./components/recepies/Recepie.vue"),
  },
  {
    path: "/dalej",
    name: "dalej",
    component: () => import("./components/NotFound.vue"),
  },
  {
    path: "/noAccess",
    name: "noAccess",
    component: () => import("./components/NoAccess.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: () => import("./components/NotFound.vue"),
  },
];

export const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

router.beforeEach(async (to, from) => {
  if (!queryClient.getQueryData(["isLogin"])) {
    //const data = await subbmitForm();
    queryClient.invalidateQueries(["isLogin"]);
    const canAccess = await canUserAccess(to);
    if (!canAccess) return "/noAccess";
  } else {
    const canAccess = await canUserAccess(to);

    if (!canAccess) return "/noAccess";
  }
});

const loginModel = {
  login: "test1",
  password: "Test@123",
  remenberLogin: false,
};

export const isLoggedIn = () => {
  return axios
    .get("auth/loggedIn", { withCredentials: true })
    .then((response) => {
      return response.data as IsLogin;
    })
    .catch((err) => {
      return null;
    });
};

function canUserAccess(route: RouteLocationNormalized): boolean {
  if (route.meta?.accessLevel !== "admin") {
    return true;
  }
  if ((queryClient.getQueryData(["isLogin"]) as IsLogin)?.role === "User") {
    return true;
  }
  return false;
}
