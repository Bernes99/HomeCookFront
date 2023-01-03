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
    component: () => import("./components/Home.vue"),
  },
  {
    path: "/admin/",
    name: "Admin",
    children: [
      {
        path: "recipes/",
        children: [
          {
            path: "",
            name: "Recipes",
            component: () =>
              import("./components/admin/Recipes/RecipesList.vue"),
          },
          {
            path: "categories",
            name: "RecipeCategories",
            component: () =>
              import("./components/admin/Recipes/RecipeCategories.vue"),
          },
        ],
      },
      {
        path: "products/",
        children: [
          {
            path: "",
            name: "Products",
            component: () => import("./components/admin/Products/Products.vue"),
          },
        ],
      },
      {
        path: "users/",
        name: "Users",
        component: () => import("./components/admin/Users/UsersList.vue"),
      },
      {
        path: "",
        name: "AdminDefault",
        component: () => import("./components/admin/Users/UsersList.vue"),
      },
    ],

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
    path: "/recipes/:id",
    name: "recpie",
    component: () => import("./components/recipes/Recipe.vue"),
  },
  {
    path: "/user/:id",
    name: "UserDetails",
    component: () => import("./components/User/UserDetails.vue"),
  },
  {
    path: "/user/:id/manageRecipes",
    name: "ManageRecipes",
    component: () => import("./components/User/ManageRecipes.vue"),
  },
  {
    path: "/user/:id/products",
    name: "UserProducts",
    component: () => import("./components/User/UserProducts.vue"),
  },
  {
    path: "/auth/",
    name: "auth",
    children: [
      {
        path: "verifyEmail",
        name: "verifyEmail",
        component: () => import("./components/auth/ConfirmEmail.vue"),
      },
      {
        path: "forgotPassword",
        name: "forgotPassword",
        component: () => import("./components/auth/ForgotPassword.vue"),
      },
      {
        path: "resetPassword",
        name: "resetpassword",
        component: () => import("./components/auth/ResetPassword.vue"),
      },
    ],
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
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  await queryClient.ensureQueryData({
    queryKey: ["isLogin"],
    queryFn: isLoggedIn,
  });
  if (!queryClient.getQueryData(["isLogin"])) {

    queryClient.invalidateQueries(["isLogin"]);

    const canAccess = await canUserAccess(to);
    if (!canAccess) return "/noAccess";
  } else {
    const canAccess = await canUserAccess(to);

    if (!canAccess) return "/noAccess";
  }
});


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

  if ((queryClient.getQueryData(["isLogin"]) as IsLogin)?.role === "Admin") {
    return true;
  }
  return false;
}
