<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import {
  ElMessage,
  ElCard,
  ElTable,
  ElTableColumn,
  ElPopconfirm,
  ElButton,
  ElPagination,
  ElOption,
  ElSelect,
} from "element-plus";
import { onMounted, ref } from "vue";
import {
  Category,
  PaginationModel,
  Product,
  RecipeFilters,
  RecipeListItem,
} from "../../../Interfejsy";
import AdminMenu from "../AdminMenu.vue";

let categories = ref<Array<Category>>();
let product = ref<Array<Product>>();
let recipes = ref<Array<RecipeListItem>>();
let searchPhrase = ref<string>("");
let searchCategories = ref<Array<string>>([]);
let searchProducts = ref<Array<string>>([]);
let searchDifficulty = ref<number>(0);
let searchRating = ref<number>(0);

const paginationModel = ref<PaginationModel>({
  pageSize: 5,
  currentPage: 1,
  searchPhrase: "",
  sortBy: "",
  sortDirection: "ASC",
});

const GetRecipes = () => {
  return axios
    .post(
      "Recipe/GetList",
      {
        categoryNames: searchCategories.value,
        dateCreatedUtc: "",
        difficulty: searchDifficulty.value,
        products: searchProducts.value,
        rating: searchRating.value,
      } as RecipeFilters,
      {
        params: {
          searchPhrase: searchPhrase.value,
        },
      }
    )
    .then((response) => {
      let data: Array<RecipeListItem> = response.data;

      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail catch recipes list",
        type: "error",
      });
      throw new Error("Fail catch recipes list");
    });
};
async function deleteRecipe(row: RecipeListItem) {
  axios
    .delete(`Recipe/${row.id}`)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe has been Deleted",
        type: "success",
      });
      RecipeListQuery.refetch();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to Delete recipe",
        type: "error",
      });
    });
}
const RecipeListQuery = useQuery(
  ["RecipeAdminList"],
  () => GetRecipes(),
  //null,
  { enabled: true }
);

const GetRecipeCategories = () => {
  return axios
    .get(`Recipe/Category/GetCategoryList`)
    .then((response) => {
      let data: Array<Category> = response.data;
      categories.value = data;
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to find user",
        type: "error",
      });
      throw new Error("Fail catch users list");
    });
};

const GetProducts = () => {
  return axios
    .get("Product/GetAllProducts")
    .then((response) => {
      let data: Array<Product> = response.data;
      product.value = data;
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail catch users list",
        type: "error",
      });
      throw new Error("Fail catch products list");
    });
};
onMounted(() => {
  GetRecipeCategories();
  GetProducts();
});
</script>

<template>
  <div class="flex grow">
    <AdminMenu></AdminMenu>
    <div class="w-full">
      <el-card class="w-full">
        <template #header>
          <div class="">
            <span>Manage Recipes</span>
          </div>
        </template>
        <el-form class="flex justify-around flex-wrap" label-position="top">
          <el-form-item label="Categories">
            <el-select
              v-model="searchCategories"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="Select Categies"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Products">
            <el-select
              v-model="searchProducts"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="Select Products"
            >
              <el-option
                v-for="item in product"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Difficulty" class="w-24">
            <el-select
              v-model="searchDifficulty"
              filterable
              placeholder="Select Difficulty"
            >
              <el-option
                v-for="index in 10"
                :key="index"
                :label="index"
                :value="index"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Rating" class="w-24">
            <el-select
              v-model="searchRating"
              filterable
              placeholder="Select Products"
            >
              <el-option
                v-for="index in 5"
                :key="index"
                :label="index"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="self-end"
            ><el-button type="primary" @click="RecipeListQuery.refetch()"
              >Search</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          class=""
          :data="RecipeListQuery.data.value ?? []"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :flexible="true"
          @row-click=""
        >
          <el-table-column prop="title" label="Title" sortable width="" />
          <el-table-column prop="author" label="author" sortable width="" />
          <el-table-column prop="rating" label="Rating" sortable width="" />
          <el-table-column
            prop="difficulty"
            label="Difficulty"
            sortable
            width=""
          />
          <el-table-column
            prop="dateCreatedUtc"
            label="Create Date"
            sortable
            width=""
          />
          <el-table-column label="Operations" width="">
            <template #default="scope">
              <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                icon-color="#626AEF"
                title="Are you sure to delete this?"
                @confirm="deleteRecipe(scope.row)"
              >
                <template #reference>
                  <el-button type="danger" size="small" @click.stop>
                    Remove
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="relative my-6">
          <el-pagination
            class=""
            v-model:page-size="paginationModel.pageSize"
            :page-sizes="[5, 10]"
            :small="false"
            :disabled="false"
            :background="true"
            layout="sizes, ->,total"
            :total="RecipeListQuery.data.value?.length ?? 0"
            @current-change="RecipeListQuery.refetch()"
            @size-change="RecipeListQuery.refetch()"
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
            :total="RecipeListQuery.data.value?.length ?? 0"
            @current-change="RecipeListQuery.refetch()"
            @size-change="RecipeListQuery.refetch()"
          />
        </div> -->
      </el-card>
    </div>
  </div>
</template>

<style scoped></style>
