import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
import VueAxios from "vue-axios";
import axios from "axios";
import { queryClient } from "./Query";
import vue3GoogleLogin from "vue3-google-login";

// axios settings
axios.defaults.baseURL = "http://localhost:8080/api/";
axios.defaults.withCredentials = true;

createApp(App)
  .use(router)
  .use(vue3GoogleLogin, {
    clientId:
      "807085190155-o7t5sep3h4rfhu13q1hcdcko7jllngfi.apps.googleusercontent.com",
  })
  .use(ElementPlus)
  .use(VueQueryPlugin, { queryClient })
  .use(VueAxios, axios)
  .mount("#app");
