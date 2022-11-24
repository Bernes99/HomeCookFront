<script setup lang="ts">
import { ref } from "vue";

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  FormInstance,
} from "element-plus";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const formRef = ref<FormInstance>();
const queryClient = useQueryClient();
const router = useRouter();

const forgotPasswordModel = ref("");

const forgotPassword = () => {
  axios
    .post(
      "auth/forgotpassword",
      { email: forgotPasswordModel.value },
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Reset password email sent",
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

const rules = ref({
  email: [{ required: true, message: "Email is required" }],
});
</script>

<template>
  <main class="flex flex-1 justify-center items-center">
    <div class="w-96 border-gray-600 border-2 p-10 rounded-md bg-gray-200">
      <div class="font-bold text-center mb-5 text-lg">
        Send reset password email
      </div>
      <el-form
        label-position="top"
        ref="formRef"
        class="text-right"
        :rules="rules"
      >
        <el-form-item prop="email">
          <label for="Email">Email</label>
          <el-input
            v-model="forgotPasswordModel"
            placeholder="Email"
            clearable
            size="large"
          />
        </el-form-item>
        <el-button size="large" @click="forgotPassword()" class="">
          Send
        </el-button>
      </el-form>
    </div>
  </main>
</template>
