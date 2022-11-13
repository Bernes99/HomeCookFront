import axios from "axios";

window.axios = axios;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/api/";
axios.interceptors.request.use(function (config) {
  config.headers.common = {
    Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
    "cnotent-Type": "application/json",
    Accept: "application/json",
  };
  return config;
});
