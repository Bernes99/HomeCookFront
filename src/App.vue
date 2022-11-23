<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { RouterView } from "vue-router";
import Menu from "./components/Menu.vue";
import { isLoggedIn as isLoggedInRouter } from "./router";

useQuery(["isLogin"], isLoggedInRouter);
</script>

<template>
  <Menu></Menu>
  <RouterView />
</template>

<style scoped></style>
