<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { IsLogin } from "../Interfejsy";
import { router } from "../router";
import { ILoggedIn, getLogout } from "./auth/authQueries";
import { isLoggedIn as isLoggedInRouter } from "../router";
import axios from "axios";
import { ElAvatar, ElIcon, ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import { useRoute } from "vue-router";
import {
  Apple,
  House,
  List,
  SwitchButton,
  Tools,
  UserFilled,
} from "@element-plus/icons-vue";

const route = useRoute();
const enableAvatar = computed(() => !!isLogged.data.value?.id);
const isLogged = useQuery(
  ["isLogin"],
  isLoggedInRouter,
  // () => {
  //   return {} as IsLogin;
  // },
  {
    //enabled: false,
  }
);
const userAvatarQuery = useQuery(["UserAvatar"], GetAvatar, {
  enabled: enableAvatar,
});

async function GetAvatar() {
  const response = await axios.get(
    `User/${isLogged.data.value?.id}/ProfileImage`
  );
  return response.data as string;
}

async function goToUserDetails() {
  router.push({ name: "UserDetails", params: { id: isLogged.data.value?.id } });
}
async function goToMenageRecipes() {
  router.push({
    name: "ManageRecipes",
    params: { id: isLogged.data.value?.id },
  });
}
async function goToUserProducts() {
  router.push({
    name: "UserProducts",
    params: { id: isLogged.data.value?.id },
  });
}

const activeIndex = ref("1");
// const handleSelect = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
</script>

<template>
  <el-menu
    :default-active="$route.path"
    class="flex"
    mode="horizontal"
    background-color="#27272a"
    text-color="#fafafa"
    :router="true"
    :ellipsis="true"
    menu-trigger="click"
  >
    <el-menu-item
      class="!border-b-0 hover:!bg-transparent focus:!bg-transparent"
      :index="router.options.routes.filter((x) => x.name == 'home')[0].path"
      ><span class="text-zinc-50"><b class="">HOMECOOK</b></span></el-menu-item
    >
    <div class="!ml-auto"></div>
    <el-menu-item
      v-if="!isLogged.data.value?.isAuthenticated && !isLogged.isLoading.value"
      :index="router.options.routes.filter((x) => x.name == 'login')[0].path"
      >Login</el-menu-item
    >
    <el-menu-item
      v-if="!isLogged.data.value?.isAuthenticated && !isLogged.isLoading.value"
      :index="router.options.routes.filter((x) => x.name == 'register')[0].path"
      >Register</el-menu-item
    >
    <el-sub-menu
      index=""
      v-if="isLogged.data.value?.isAuthenticated"
      expand-close-icon=""
      expand-open-icon=""
      collapse-close-icon=""
      collapse-open-icon=""
    >
      <template #title>
        <el-avatar :icon="UserFilled" :src="userAvatarQuery.data.value" />
      </template>

      <el-menu-item
        v-if="
          isLogged.data.value?.isAuthenticated &&
          isLogged.data.value.role === 'Admin'
        "
        class="!border-b-0 focus:!bg-transparent"
        :index="router.options.routes.filter((x) => x.name == 'Admin')[0].path"
        ><span class="text-white"
          ><el-icon><House /></el-icon>admin</span
        ></el-menu-item
      >
      <el-menu-item
        v-if="isLogged.data.value?.isAuthenticated"
        class="!border-b-0 focus:!bg-transparent"
        index=""
        @click="goToUserProducts"
        ><span class="text-white"
          ><el-icon><Apple /></el-icon>Your Products</span
        ></el-menu-item
      >
      <el-menu-item
        v-if="isLogged.data.value?.isAuthenticated"
        class="!border-b-0 focus:!bg-transparent"
        index=""
        @click="goToMenageRecipes"
        ><span class="text-white"
          ><el-icon><List /></el-icon> Manage Recipes</span
        ></el-menu-item
      >
      <el-menu-item
        v-if="isLogged.data.value?.isAuthenticated"
        class="!border-b-0 focus:!bg-transparent"
        index=""
        @click="goToUserDetails"
        ><span class="text-white"
          ><el-icon><Tools /></el-icon> Account</span
        ></el-menu-item
      >

      <el-menu-item
        v-if="isLogged.data.value?.isAuthenticated"
        class="!border-b-0 focus:!bg-transparent"
        index=""
        @click="getLogout"
        ><span class="text-white"
          ><el-icon><SwitchButton /></el-icon>Logout</span
        ></el-menu-item
      >
    </el-sub-menu>

    <!-- <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
