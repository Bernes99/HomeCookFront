<script setup lang="ts">
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import UsersList from "./UsersList.vue";
const dupa = ref(false);
</script>

<template>
  <button @click="dupa = !dupa">asdasdadasd</button>
  <div class="flex grow">
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      :collapse="dupa"
      :collapse-transition="false"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <el-icon><document /></el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
    <UsersList></UsersList>
  </div>
</template>

<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  min-width: 200px;
  min-height: 400px;
}
</style>
