import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";
import { queryClient } from "./Query";

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

router.beforeEach(async (to, from, next) => {
  if (!queryClient.getQueryData(["isLogin"])) {
    //const data = await subbmitForm();

    queryClient.setQueryData(["isLogin"], await isLoggedIn());
  }
  next();
});

const loginModel = {
  login: "test1",
  password: "Test@123",
  remenberLogin: false,
};

const isLoggedIn = () => {
  return axios
    .get("auth/loggedIn", { withCredentials: true })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return undefined;
    });
};
