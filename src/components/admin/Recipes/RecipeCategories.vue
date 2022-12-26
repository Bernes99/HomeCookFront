<script setup lang="ts">
import axios from "axios";
import {
  ElCard,
  ElSelect,
  ElOption,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElDialog,
} from "element-plus";
import { onMounted, ref, watch } from "vue";
import { Category } from "../../../Interfejsy";
import AdminMenu from "../AdminMenu.vue";

let categories = ref<Array<Category>>();
let selectedCategory = ref<Category>({ id: "", name: "" });
let category = ref<Category>({ id: "", name: "" });
let updateCategory = ref<Category>({ id: "", name: "" });
let dialogRecipeCategoryUpdate = ref<boolean>(false);

watch(selectedCategory, (newValue) => {
  category.value.id = newValue.id;
  category.value.name = newValue.name;
});

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

async function AddCategory() {
  return axios
    .post(`Recipe/Category/AddCategory`, null, {
      params: { CategoryName: category.value.name },
    })
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe Category has been Created",
        type: "success",
      });
      GetRecipeCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to create recipe category",
        type: "error",
      });
    });
}

async function UpdateCategory() {
  axios
    .put(`Recipe/Category/UpdateCategory`, updateCategory.value, {})
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe Category has been Updated",
        type: "success",
      });
      GetRecipeCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to update Recipe category",
        type: "error",
      });
    });
  dialogRecipeCategoryUpdate.value = false;
}

async function deleteRecipeCategory(cat: Category) {
  axios
    .delete(`Recipe/Category/DeleteCategory/${cat.id}`)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe category has been Deleted",
        type: "success",
      });
      GetRecipeCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to Delete recipe category",
        type: "error",
      });
    });
}

async function openUpdateCategoryDialog(cat: Category) {
  updateCategory.value.id =
    cat.id !== ""
      ? cat.id
      : categories.value?.find((x) => x.name === cat.name)?.id ?? "";
  updateCategory.value.name = cat.name;
  dialogRecipeCategoryUpdate.value = true;
}

onMounted(() => {
  GetRecipeCategories();
});
</script>

<template>
  <div class="flex grow">
    <AdminMenu></AdminMenu>
    <div class="w-full">
      <el-card class="w-full">
        <template #header>
          <div class="">
            <span>Manage Recipe Categories</span>
          </div>
        </template>
        <div class="flex justify-around">
          <div>
            <el-select
              v-model="selectedCategory"
              value-key="id"
              filterable
              placeholder="Select"
            >
              <el-option
                key=""
                label="Select Category"
                :value="{ id: '', name: '' }"
              />
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </div>
          <el-form
            label-position="right"
            label-width="100px"
            :model="category"
            style="max-width: 460px"
          >
            <el-form-item
              label="CategoryName"
              prop="name"
              :rules="[{ required: true, message: 'category is required' }]"
            >
              <el-input v-model="category.name" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="category.name === ''"
                v-if="!categories?.some((c) => c.name === category.name)"
                @click="AddCategory()"
              >
                <span>Create</span>
              </el-button>
              <el-button
                type="primary"
                v-if="categories?.some((c) => c.name === category.name)"
                @click="openUpdateCategoryDialog(category)"
              >
                <span>Update</span>
              </el-button>
              <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                icon-color="#626AEF"
                title="Are you sure to delete this?"
                @confirm="deleteRecipeCategory(category)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    v-if="categories?.some((c) => c.name === category.name)"
                    @click.stop
                  >
                    <span>Delete</span>
                  </el-button>
                </template>
              </el-popconfirm>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>

  <el-dialog v-model="dialogRecipeCategoryUpdate" title="Edit Product Category">
    <el-form :model="updateCategory">
      <el-form-item label="New Category Name">
        <el-input v-model="updateCategory.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogRecipeCategoryUpdate = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="UpdateCategory()"> Update </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
