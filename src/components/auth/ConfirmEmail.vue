<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const userId = ref("");
const verificationCode = ref("");
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  userId.value =
    typeof route.query.userid === "string"
      ? route.query.userid
      : route.query.userid?.[0] ?? "";
  verificationCode.value =
    typeof route.query.code === "string"
      ? route.query.code
      : route.query.code?.[0] ?? "";

  if (
    userId.value != "" &&
    userId.value &&
    verificationCode.value != "" &&
    verificationCode.value
  ) {
    axios
      .get("auth/verifyEmail", {
        params: {
          userId: userId.value,
          code: verificationCode.value,
        },
        withCredentials: true,
      })
      .then((response) => {
        ElMessage({
          showClose: true,
          message: "Email Confirmed",
          type: "success",
        });

        router.push({ name: "home" });
        return response.data;
      })
      .catch((err) => {
        ElMessage({
          showClose: true,
          message: "Email Not Confirmed",
          type: "error",
        });
        return {};
      });

    router.push("login");
  }
});
</script>

<template>Email Confirm</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
