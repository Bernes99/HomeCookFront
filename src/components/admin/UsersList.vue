<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import {
  ElMessage,
  ElPagination,
  ElTable,
  ElTableColumn,
  FormInstance,
} from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { User, PaginationModel, UserPaginationList } from "../../Interfejsy";
import { forEach, List } from "lodash";

const currentPage = ref(1);
const pageSize = ref(5);
const totalItemsCount = ref(0);
let searchPhrase = ref<string>();
let sortBy = ref<string>("");
let sortDirection = ref<string>("");
let tableData = ref<User[]>();
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
// tableData = [
//   {
//     id: "2016-05-03",
//     FirstName: "Tom",
//     Surname: "No. 189, Grove St, Los Angeles",
//     Email: "",
//     isDeleted: false,
//     LastLogin: new Date(),
//   },
// ];

const changeListPage = () => {
  return axios
    .get("auth/GetAllUsers", {
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
      let data: UserPaginationList = response.data;

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
</script>

<template>
  <div class="grow flex flex-col">
    <el-table
      class=""
      :data="UserListQuery.data.value?.items ?? []"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :flexible="true"
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
        :page-sizes="[5, 10, 15, 50]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="total, sizes,->,jumper"
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
  </div>
</template>

<style scoped></style>
