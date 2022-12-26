<script setup lang="ts">
import { onBeforeUpdate, onMounted, reactive, ref } from "vue";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  FormInstance,
} from "element-plus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { useRoute, useRouter } from "vue-router";
import { ResetPasswordModel } from "../../Interfejsy";
import { router } from "../../router";
import axios from "axios";

const formRef = ref<FormInstance>();
const queryClient = useQueryClient();
const route = useRoute();
let correctLink = ref<Boolean>(false);

const resetPasswordModel: ResetPasswordModel = reactive({
  userId: "",
  resetToken: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    let passRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
    );
    if (!passRegex.test(value)) callback(new Error("password is too weak"));
    if (resetPasswordModel.newPasswordConfirm !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("confirmPassword", () => null);
    }
    callback();
  }
};
const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== resetPasswordModel.newPassword) {
    console.log(value);
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};
const rules = reactive({
  newPasswordConfirm: [{ validator: validateConfirmPass, trigger: "blur" }],
  newPassword: [{ validator: validatePass, trigger: "blur" }],
});

onMounted(async () => {
  resetPasswordModel.userId =
    typeof route.query.userid === "string"
      ? route.query.userid
      : route.query.userid?.[0] ?? "";
  resetPasswordModel.resetToken =
    typeof route.query.resetToken === "string"
      ? route.query.resetToken
      : route.query.resetToken?.[0] ?? "";
  console.log(resetPasswordModel.resetToken);
  console.log(resetPasswordModel.userId);
  if (
    resetPasswordModel.userId == "" ||
    !resetPasswordModel.userId ||
    resetPasswordModel.resetToken == "" ||
    !resetPasswordModel.resetToken
  ) {
    ElMessage({
      showClose: true,
      message: "Reset password link is invalid!",
      type: "error",
      duration: 5000,
    });
    correctLink.value = true;
  }
});

const sendResetPassword = () => {
  axios
    .post("auth/resetpassword", resetPasswordModel, {
      withCredentials: true,
    })
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Password changed successfully",
        type: "success",
      });

      router.push({ name: "home" });
      return response.data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Something went wrong",
        type: "error",
      });
      return {};
    });
};
</script>

<template>
  <main class="flex flex-1 justify-center items-center">
    <div class="w-96 border-gray-600 border-2 p-10 rounded-md bg-gray-200">
      <div class="font-bold text-center mb-5 text-lg">Reset password</div>
      <el-form
        label-position="top"
        ref="formRef"
        :model="resetPasswordModel"
        class="text-right"
        :rules="rules"
      >
        <el-form-item class="text-lg" prop="newPassword">
          <label>New password</label>
          <el-input
            v-model="resetPasswordModel.newPassword"
            type="password"
            placeholder="Password"
            show-password
            size="large"
            :disabled="correctLink === false"
          />
        </el-form-item>
        <el-form-item class="text-lg" prop="newPasswordConfirm">
          <label>New password confirmation</label>
          <el-input
            v-model="resetPasswordModel.newPasswordConfirm"
            type="password"
            placeholder="Password"
            show-password
            size="large"
            :disabled="correctLink === false"
          />
        </el-form-item>
        <el-button
          size="large"
          @click="sendResetPassword"
          class=""
          :disabled="correctLink === false"
          >Reset password</el-button
        >
      </el-form>
    </div>
  </main>
</template>
