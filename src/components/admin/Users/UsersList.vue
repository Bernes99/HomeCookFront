<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import {
  ElButton,
  ElInput,
  ElMessage,
  ElPagination,
  ElTable,
  ElTableColumn,
  FormInstance,
} from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { User, PaginationModel, PaginationList } from "../../../Interfejsy";
import { forEach, List } from "lodash";
import AdminMenu from "../AdminMenu.vue";
import { router } from "../../../router";

const paginationModel = ref<PaginationModel>({
  pageSize: 5,
  currentPage: 1,
  searchPhrase: "",
  sortBy: "",
  sortDirection: "ASC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-UK", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});
const changeListPage = () => {
  return axios
    .get("User/GetAllUsers", {
      params: {
        SearchPhrase: paginationModel.value.searchPhrase,
        PageNumber: paginationModel.value.currentPage,
        PageSize: paginationModel.value.pageSize,
        SortBy: paginationModel.value.sortBy,
        SortDirection: paginationModel.value.sortDirection,
      },
      withCredentials: true,
    })
    .then((response) => {
      let data: PaginationList<User> = response.data;

      data.items = data.items.map((element) => ({
        ...element,
        lastLogin: element.lastLogin
          ? dateTimeFormatter
              .format(new Date(element.lastLogin))
              .replace(",", "")
          : "Never",
      }));
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail catch users list",
        type: "error",
      });
      throw new Error("Fail catch users list");
    });
};

const UserListQuery = useQuery(
  ["UsersList"],
  () => changeListPage(),
  //null,
  { enabled: true }
);

const formatter = (row: User, column: TableColumnCtx<User>) => {
  if (row.lastLogin) {
    return row.lastLogin;
  }
  return null;
};

const GoToUserDetails = (row: User) => {
  router.push({ name: "UserDetails", params: { id: row.id } });
};
</script>

<template>
  <div class="flex grow">
    <AdminMenu></AdminMenu>
    <el-card class="grow flex flex-col">
      <template #header>
        <div class="">
          <span>Manage Users</span>
        </div>
      </template>
      <div class="flex">
        <el-input
          v-model="paginationModel.searchPhrase"
          placeholder="Search user"
          clearable
          @keydown.enter="UserListQuery.refetch()"
          @blur="UserListQuery.refetch()"
        />
        <el-button type="primary" @click="UserListQuery.refetch()"
          >Search</el-button
        >
      </div>

      <el-table
        class=""
        :data="UserListQuery.data.value?.items ?? []"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :flexible="true"
        @row-click="GoToUserDetails"
      >
        <el-table-column prop="firstName" label="FirstName" sortable width="" />
        <el-table-column prop="surname" label="Surname" sortable width="" />
        <el-table-column prop="email" label="Email" sortable width="" />
        <el-table-column
          prop="lastLogin"
          label="Last Login Date"
          sortable
          width=""
        />
      </el-table>
      <div class="relative my-6">
        <el-pagination
          class=""
          v-model:page-size="paginationModel.pageSize"
          :page-sizes="[5, 10, 15]"
          :small="false"
          :disabled="false"
          :background="true"
          layout="sizes, ->,total"
          :total="UserListQuery.data.value?.itemsCount ?? 0"
          @current-change="UserListQuery.refetch()"
          @size-change="UserListQuery.refetch()"
        />
        <el-pagination
          class="absolute top-0 left-1/2 -translate-x-1/2"
          v-model:current-page="paginationModel.currentPage"
          v-model:page-size="paginationModel.pageSize"
          :page-sizes="[5, 10, 15, 50]"
          :small="false"
          :disabled="false"
          :background="true"
          layout=",prev, pager, next"
          :total="UserListQuery.data.value?.itemsCount ?? 0"
          @current-change="UserListQuery.refetch()"
          @size-change="UserListQuery.refetch()"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped></style>
