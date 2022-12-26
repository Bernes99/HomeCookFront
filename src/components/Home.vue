<script setup lang="ts">
import { Trophy } from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import {
  ElButton,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCollapse,
  ElCollapseItem,
  ElForm,
  ElFormItem,
  ElIcon,
  ElImage,
  ElInput,
  ElMessage,
  ElOption,
  ElRate,
  ElSelect,
} from "element-plus";
import icon from "element-plus/es/components/icon";
import { el } from "element-plus/es/locale";
import { debounce } from "lodash";
import { computed, onMounted, ref, watch } from "vue";
import {
  AddUserProducts,
  Category,
  Product,
  RecipeFilters,
  RecipeListItem,
  UserProducts,
} from "../Interfejsy";
import { router } from "../router";
import Login from "./auth/Login.vue";
import { isLoggedIn as isLoggedInRouter } from "../router";

let searchPhrase = ref<string>("");
let searchCategories = ref<Array<string>>([]);
let searchProducts = ref<Array<string>>([]);
let searchDifficulty = ref<number>(0);
let searchRating = ref<number>(0);

let categories = ref<Array<Category>>();
const activeCategory = ref([""]);

let products = ref<Array<Product>>();

let recipeCategories = ref<Array<Category>>();

const ProductInput = debounce(() => {
  RecipeListQuery.refetch();
}, 1000);

watch(
  searchProducts,
  () => {
    ProductInput();
  },
  { deep: true }
);

const GetRecipes = () => {
  return axios
    .post(
      "Recipe/GetList",
      {
        categoryNames: searchCategories.value,
        dateCreatedUtc: "",
        difficulty: searchDifficulty.value * 2,
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

const GetUserProducts = () => {
  return axios
    .get(`User/${isLogged.data.value?.id}/Products`)
    .then((response) => {
      let data: Array<UserProducts> = response.data;

      searchProducts.value = [];
      data.forEach((prod) => {
        searchProducts.value.push(prod.product.name);
      });
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail catch user's product",
        type: "error",
      });
      throw new Error("Fail catch user's product");
    });
};

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
const enableUserProducts = computed(() => !!isLogged.data.value?.id);

const userProductQuery = useQuery(
  ["UserProducts"],
  () => GetUserProducts(),
  //null,
  { enabled: enableUserProducts }
);
const RecipeListQuery = useQuery(
  ["RecipeAdminList"],
  () => GetRecipes(),
  //null,
  { enabled: true }
);

const GetProductCategories = () => {
  return axios
    .get(`Product/Category/GetProductCategoryList`)
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
      products.value = data;
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

const GetRecipeCategories = () => {
  return axios
    .get(`Recipe/Category/GetCategoryList`)
    .then((response) => {
      let data: Array<Category> = response.data;
      recipeCategories.value = data;
      return data;
    })
    .catch((err) => {
      throw new Error("Fail catch users list");
    });
};

onMounted(() => {
  GetProductCategories();
  GetProducts();
  GetRecipeCategories();
});

function productsOfCategory(cat: string) {
  return products.value
    ?.filter((x) => x.category.name === cat)
    .map((x) => x.name);
}

async function goToRecipeDetails(reicpeId: string) {
  router.push({ name: "recpie", params: { id: reicpeId } });
}
</script>

<template>
  <div class="flex grow">
    <div class="w-4/12 bg-slate-500 overflow-y-scroll">
      <el-collapse v-model="activeCategory" class="min-w-[205px] h-[100px]">
        <el-collapse-item
          v-for="category in categories"
          :title="category.name"
          :name="category.name"
        >
          <el-checkbox-group v-model="searchProducts" class="" fill="#22C55EFF">
            <el-checkbox-button
              class="p-2"
              v-for="productName in productsOfCategory(category.name)"
              :key="productName"
              :label="productName"
              >{{ productName }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="flex w-full flex-wrap justify-around content-start">
      <div class="flex self-start w-full">
        <el-input
          v-model="searchPhrase"
          placeholder="Search recipe phrase"
          clearable
          @keydown.enter="RecipeListQuery.refetch()"
          @blur="RecipeListQuery.refetch()"
        />
        <el-button type="primary" @click="RecipeListQuery.refetch()"
          >Search</el-button
        >
      </div>
      <div class="w-full mt-1">
        <el-form class="flex justify-around flex-wrap" label-position="top">
          <el-form-item label="Categories">
            <el-select
              v-model="searchCategories"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="Select Categies"
              @change="RecipeListQuery.refetch()"
            >
              <el-option
                v-for="item in recipeCategories"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Rating" class="w-24">
            <el-rate
              v-model="searchRating"
              clearable
              @change="RecipeListQuery.refetch()"
            />
          </el-form-item>

          <el-form-item label="Difficulty" class="w-24">
            <el-rate
              v-model="searchDifficulty"
              clearable
              :max="5"
              allow-half
              :icons="[Trophy, Trophy, Trophy]"
              :void-icon="Trophy"
              :colors="['#22C55E', '#EB9A11', '#EB0000']"
              @change="RecipeListQuery.refetch()"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        v-for="recipe in RecipeListQuery.data.value"
        class="min-w-[300px] w-4/12 aspect-video relative mt-2 cursor-pointer"
        @click="goToRecipeDetails(recipe.id)"
      >
        <el-image
          class="w-full h-full rounded-md !absolute"
          :src="recipe.mainImage"
          fit=""
        >
          <template #error>
            <div class="h-full flex justify-center items-center">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
        <div
          class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip rounded-b-md"
        >
          <span class="text-white px-1">
            {{ recipe.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.el-checkbox-button__inner {
  border-style: none !important;
  border-radius: 25px !important;
  background-color: rgb(243 244 246);
}
</style>
