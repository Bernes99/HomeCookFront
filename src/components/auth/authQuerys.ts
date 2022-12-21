import { queryClient } from "../../Query";
import axios from "axios";
import { googleLogout } from "vue3-google-login";
import { IsLogin } from "../../Interfejsy";
import { router } from "../../router";
export interface ILoggedIn {
  IsAuthenticated: boolean;
  Email: string;
  Role: string;
  Id: string;
}

export function isLoggedIn() {
  let isLoginData = queryClient.getQueryData(["isLogin"]);
  console.log(isLoginData);
  if (!isLoginData) {
    return false;
  } else {
    return isLoginData;
  }
}

export async function getLogout() {
  try {
    const response = await axios.get("auth/logout", {
      withCredentials: true,
    });
    queryClient.resetQueries(["isLogin"]);
    googleLogout();
    router.push({ name: "home" });
    return true;
  } catch (err: any) {
    return false;
  }
}
