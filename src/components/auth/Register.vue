<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import { ElMessage, FormInstance } from "element-plus";
import { Testowy } from "../../Interfejsy";
import { router } from "../../router";

const formRef = ref<FormInstance>();

const registerModel = reactive({
  login: "",
  password: "",
  passwordConfirm: "",
  firstName: "",
  surname: "",
  email: "",
  remenberLogin: false,
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    let passRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
    );
    if (!passRegex.test(value)) callback(new Error("password is too weak"));
    if (registerModel.passwordConfirm !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("confirmPassword", () => null);
    }
    callback();
  }
};
const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== registerModel.password) {
    console.log(value);
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};
const ValidateEmail = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the email again"));
  } else {
    let emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (!emailRegex.test(value)) {
      callback(new Error("Please input the valid email"));
    } else {
      callback();
    }
  }
};

const rules = reactive({
  login: [{ required: true, message: "Login is required" }],
  email: [{ validator: ValidateEmail, trigger: "blur" }],
  passwordConfirm: [{ validator: validateConfirmPass, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }], //[{ validator: validatePass, trigger: "blur" }], //blur - wyjscie z focus , change - ...
});
// example
const test: Testowy = { test1: "test", test2: 1 };
//
async function submitForm(formEl: FormInstance | undefined) {
  try {
    const response = await axios.post("auth/register", registerModel, {
      withCredentials: false,
    });
    ElMessage({
      showClose: true,
      message: "User has been created",
      type: "success",
    });
    router.push({ name: "home" });
    return response.data.results as Testowy;
  } catch (err: any) {
    console.log(err.response);
    ElMessage({
      showClose: true,
      message: err.response.data.Message,
      type: "error",
    });
    return {} as Testowy;
  }
}
// const subbmitForm = async (formEl: FormInstance | undefined) => {
//   return await axios
//     .post("auth/register", registerModel, { withCredentials: false })
//     .then((response) => {})
//     .catch((err) => {
//       console.log(err.response);
//       ElMessage({
//         showClose: true,
//         message: err.response.data.Message,
//         type: "error",
//       });
//       return {} as Testowy;
//     });
// };
// example
//let adata2 = subbmitForm(formRef.value);
//adata2.then((x) => x.test1);
///
const { isLoading, isError, data, error } = useQuery(
  ["register"],
  () => submitForm(formRef.value),
  //null,
  { enabled: false }
);
</script>

<template>
  <main class="flex flex-1 justify-center items-center">
    <div class="w-96 border-gray-600 border-2 p-10 rounded-md bg-gray-200">
      <el-form
        label-position="top"
        ref="formRef"
        :model="registerModel"
        class="text-right"
        :rules="rules"
        @keydown.enter="submitForm(formRef)"
      >
        <el-form-item prop="login">
          <label for="Login">Login</label>
          <el-input
            v-model="registerModel.login"
            placeholder="Login"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item prop="firstName">
          <label for="Login">Name</label>
          <el-input
            v-model="registerModel.firstName"
            placeholder="FirstName"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item prop="surname">
          <label for="Login">Surname</label>
          <el-input
            v-model="registerModel.surname"
            placeholder="Surname"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item prop="email">
          <label for="Login">Email Adress</label>
          <el-input
            v-model="registerModel.email"
            placeholder="Email Adress"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item class="text-lg" prop="password">
          <label>Password</label>
          <el-input
            v-model="registerModel.password"
            type="password"
            placeholder="Password"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item class="text-lg" prop="passwordConfirm">
          <label>Confirm Password</label>
          <el-input
            v-model="registerModel.passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="registerModel.remenberLogin"
            label="Don't log me out"
            size="large"
          />
        </el-form-item>
        <el-button @click="submitForm(formRef)" class=""
          >Create Account</el-button
        >
      </el-form>
    </div>
  </main>
</template>

<style scoped></style>


