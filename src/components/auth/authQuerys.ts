import { queryClient } from "../../Query";
import axios from "axios";
import { googleLogout } from "vue3-google-login";
import { IsLogin } from "../../Interfejsy";

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
    return true;
  } catch (err: any) {
    return false;
  }
}
