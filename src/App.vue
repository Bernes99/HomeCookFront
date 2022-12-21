<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import Menu from "./components/Menu.vue";
import { isLoggedIn as isLoggedInRouter } from "./router";

onMounted(async () => {
  useQuery(["isLogin"], isLoggedInRouter);
});
const isLoginQuery = useQuery(["isLogin"], isLoggedInRouter);
</script>

<template>
  <Menu ></Menu>
  <RouterView class="" />
  <!--bg-lime-100 -->
</template>

<style scoped></style>
