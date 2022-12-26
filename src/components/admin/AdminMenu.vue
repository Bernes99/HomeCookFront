<script setup lang="ts">
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  GoodsFilled,
  Tickets,
  UserFilled,
} from "@element-plus/icons-vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import { router } from "../../router";
import UsersList from "./Users/UsersList.vue";
import type { RouteRecordRaw } from "vue-router";
const toogleMenu = ref(true);

const getPathByName = (routes: readonly RouteRecordRaw[], name: string) => {
  const stack = [
    ...routes.map((route) => [[route.path] as string[], route] as const),
  ];

  while (stack.length) {
    const [path, route] = stack.shift()!;
    if (route.name === name) return path.join("/").replaceAll(/\/\/+/g, "/");
    if (route.children)
      route.children.forEach((child) =>
        stack.push([[...path, child.path], child])
      );
  }

  return null;
};
</script>

<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical"
    :collapse="!toogleMenu"
    :collapse-transition="false"
    :router="true"
  >
    <el-menu-item class="" index="" @click="toogleMenu = !toogleMenu">
      <el-icon><icon-menu /></el-icon><template #title>Toggle Menu</template>
    </el-menu-item>

    <el-menu-item :index="getPathByName(router.options.routes, 'Users')">
      <el-icon><UserFilled /></el-icon>
      <template #title>User List</template>
    </el-menu-item>
    <el-menu-item :index="getPathByName(router.options.routes, 'Products')">
      <el-icon><GoodsFilled /></el-icon><template #title>Products</template>
    </el-menu-item>
    <el-sub-menu index="">
      <template #title>
        <el-icon><Tickets /></el-icon>
        <span>Recipes</span>
      </template>
      <el-menu-item :index="getPathByName(router.options.routes, 'Recipes')"
        >Recipes</el-menu-item
      >
      <el-menu-item
        :index="getPathByName(router.options.routes, 'RecipeCategories')"
        >Recipe Categories</el-menu-item
      >
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  min-width: 200px;
  min-height: 400px;
}
</style>
