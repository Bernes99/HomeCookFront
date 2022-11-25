<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import { ElMessage, FormInstance } from "element-plus";
import { router } from "../../router";
import { CallbackTypes, GoogleLogin } from "vue3-google-login";

const formRef = ref<FormInstance>();

const loginModel = reactive({
  login: "",
  password: "",
  rememberLogin: false,
});

const subbmitForm = (formEl: FormInstance | undefined) => {
  return axios
    .post("auth/login", loginModel, { withCredentials: true })
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Login successful",
        type: "success",
      });

      router.push({ name: "home" });
      return response.data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Login Error",
        type: "error",
      });
      return {};
    });
};
const { data: data2 } = useQuery(
  ["isLogin"],
  () => subbmitForm(formRef.value),
  {
    enabled: false,
  }
);
console.log("data2");
console.log(data2.value);
const { isLoading, isError, data, error } = useQuery(
  ["login"],
  () => subbmitForm(formRef.value),
  //null,
  { enabled: false }
);

const rules = reactive({
  login: [{ required: true, message: "Login is required" }],
  password: [{ required: true, message: "Password is required" }], //[{ validator: validatePass, trigger: "blur" }], //blur - wyjscie z focus , change - ...
});

const callback: CallbackTypes.CredentialCallback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  //console.log("Credential JWT string", response.credential);
  return axios
    .post(
      "auth/googleLogin",
      { Provider: "Google", IdToken: response.credential },
      { withCredentials: true }
    )
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Login successful",
        type: "success",
      });
      console.log(response.data);
      router.push({ name: "home" });
      return response.data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Login Error",
        type: "error",
      });
      return {};
    });
};
</script>

<template>
  <main class="flex flex-1 justify-center items-center">
    <div class="w-96 border-gray-600 border-2 p-10 rounded-md bg-gray-200">
      <el-form
        label-position="top"
        ref="formRef"
        :model="loginModel"
        class="text-right"
        :rules="rules"
        @keydown.enter="subbmitForm(formRef)"
      >
        <el-form-item prop="login">
          <label for="Login">Login</label>
          <el-input
            v-model="loginModel.login"
            placeholder="Login"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item class="text-lg" prop="password">
          <label>Hasło</label>
          <el-input
            v-model="loginModel.password"
            type="password"
            placeholder="Hasło"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="loginModel.rememberLogin"
            label="Nie wylogowuj mnie"
            size="large"
          />
        </el-form-item>
        <el-button @click="subbmitForm(formRef)" class="">Zaloguj</el-button>

        <GoogleLogin :callback="callback" />
      </el-form>

      <el-form-item>
        <RouterLink :to="{ name: 'dalej' }">dalej dalej</RouterLink>
      </el-form-item>
    </div>
  </main>
</template>

<style scoped></style>
