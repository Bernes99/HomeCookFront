<script setup lang="ts">
import { User } from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElButton,
  ElMessage,
  FormInstance,
  ElCard,
  ElIcon,
  ElUpload,
  UploadProps,
  ElOption,
  ElSelect,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElInputNumber,
  ElPopconfirm,
} from "element-plus";
import { onMounted, ref, watch } from "vue";
import {
  Category,
  Product,
  PaginationModel,
  UnitTypes,
  UpdateProduct,
  PaginationList,
} from "../../../Interfejsy";
import AdminMenu from "../AdminMenu.vue";

let categories = ref<Array<Category>>();
let category = ref<Category>({ id: "", name: "" });
let selectedCategory = ref<Category>({ id: "", name: "" });
let searchCategory = ref<Category>({ id: "", name: "" });
let dialogUpdateProductForm = ref<boolean>(false);
let dialogAddProductForm = ref<boolean>(false);

let productFormData = ref<UpdateProduct>({
  id: "",
  calories: 0,
  categoryId: "",
  name: "",
  unitType: 0,
});

let dialogProductCategoryUpdate = ref<boolean>(false);
let updateCategory = ref<Category>({ id: "", name: "" });

watch(selectedCategory, (newValue) => {
  category.value.id = newValue.id;
  category.value.name = newValue.name;
});

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

async function AddCategory() {
  return axios
    .post(`Product/Category/AddProductCategory`, null, {
      params: { CategoryName: category.value.name },
    })
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Product Category has been Created",
        type: "success",
      });
      GetProductCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to create product category",
        type: "error",
      });
    });
}

async function UpdateCategory() {
  axios
    .put(`Product/Category/UpdateProductCategory`, updateCategory.value, {})
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Product Category has been Updated",
        type: "success",
      });
      GetProductCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to create product category",
        type: "error",
      });
    });
  dialogProductCategoryUpdate.value = false;
}
//#region product
const paginationModel = ref<PaginationModel>({
  pageSize: 5,
  currentPage: 1,
  searchPhrase: "",
  sortBy: "",
  sortDirection: "ASC",
});

async function deleteProductCategory(cat: Category) {
  axios
    .delete(`Product/Category/DeleteProductCategory/${cat.id}`)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Product category has been Deleted",
        type: "success",
      });
      GetProductCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to Delete product category",
        type: "error",
      });
    });
}

const GetProducts = () => {
  return axios
    .get("Product/GetProductList", {
      params: {
        category: searchCategory.value.name,
        PageNumber: paginationModel.value.currentPage,
        PageSize: paginationModel.value.pageSize,
        SortBy: paginationModel.value.sortBy,
        SortDirection: paginationModel.value.sortDirection,
      },
    })
    .then((response) => {
      let data: PaginationList<Product> = response.data;
      data.items.forEach((x) => (x.unitName = UnitTypes[x.unitType]));
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

const ProductListQuery = useQuery(
  ["ProductList"],
  () => GetProducts(),
  //null,
  { enabled: true }
);

async function openUpdateDialog(row: Product) {
  productFormData.value.calories = row.calories;
  productFormData.value.categoryId = row.category.id;
  productFormData.value.id = row.id;
  productFormData.value.name = row.name;
  productFormData.value.unitType = row.unitType;

  dialogUpdateProductForm.value = true;
}
async function openUpdateCategoryDialog(cat: Category) {
  updateCategory.value.id =
    cat.id !== ""
      ? cat.id
      : categories.value?.find((x) => x.name === cat.name)?.id ?? "";
  updateCategory.value.name = cat.name;
  dialogProductCategoryUpdate.value = true;
}

async function openAddProductDialog() {
  productFormData.value.calories = 0;
  productFormData.value.categoryId = "";
  productFormData.value.id = "";
  productFormData.value.name = "";
  productFormData.value.unitType = 0;

  dialogAddProductForm.value = true;
}
const UpdateProducts = () => {
  axios
    .put("Product/UpdateProduct", productFormData.value)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Product has been Added",
        type: "success",
      });
      ProductListQuery.refetch();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to add product",
        type: "error",
      });
    });
  dialogUpdateProductForm.value = false;
  //await new Promise(f => setTimeout(f, 1000));
};

const AddProduct = () => {
  axios
    .post("Product/AddProduct", productFormData.value)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Product has been Updated",
        type: "success",
      });
      ProductListQuery.refetch();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to update product",
        type: "error",
      });
    });
  dialogUpdateProductForm.value = false;
  //await new Promise(f => setTimeout(f, 1000));
};

async function deleteProduct(row: Product) {
  axios
    .delete(`Product/DeleteProduct/${row.id}`)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Product has been Deleted",
        type: "success",
      });
      ProductListQuery.refetch();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to Delete product",
        type: "error",
      });
    });
}

//#endregion
onMounted(() => {
  GetProductCategories();
});
</script>
<template>
  <div class="flex grow">
    <AdminMenu></AdminMenu>
    <div class="grow flex flex-col">
      <el-card class="">
        <template #header>
          <div class="">
            <span>Manage Products</span>
          </div>
        </template>
        <div class="flex justify-between">
          <div>
            <el-select
              v-model="searchCategory"
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
            <el-button type="primary" @click="ProductListQuery.refetch()"
              >Search</el-button
            >
          </div>

          <el-button type="success" @click="openAddProductDialog"
            >Add Product</el-button
          >
        </div>

        <el-table
          class=""
          :data="ProductListQuery.data.value?.items ?? []"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :flexible="true"
          @row-click="openUpdateDialog"
        >
          <el-table-column prop="name" label="Name" sortable width="" />
          <el-table-column prop="calories" label="Calories" sortable width="" />
          <el-table-column
            prop="category.name"
            label="Category"
            sortable
            width=""
          />
          <el-table-column
            prop="unitName"
            label="Unit Type"
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
                @confirm="deleteProduct(scope.row)"
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
        <div class="relative my-6">
          <el-pagination
            class=""
            v-model:page-size="paginationModel.pageSize"
            :page-sizes="[5, 10, 15]"
            :small="false"
            :disabled="false"
            :background="true"
            layout="sizes, ->,total"
            :total="ProductListQuery.data.value?.itemsCount"
            @current-change="ProductListQuery.refetch()"
            @size-change="ProductListQuery.refetch()"
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
            :total="ProductListQuery.data.value?.itemsCount"
            @current-change="ProductListQuery.refetch()"
            @size-change="ProductListQuery.refetch()"
          />
        </div>
      </el-card>
      <el-card class="">
        <template #header>
          <div class="">
            <span>Manage Product Categories</span>
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
                @confirm="deleteProductCategory(category)"
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

  <el-dialog v-model="dialogUpdateProductForm" title="Edit Product">
    <el-form :model="productFormData">
      <el-form-item
        label="Product Name"
        prop="name"
        :rules="[{ required: true, message: 'Product name is required' }]"
      >
        <el-input v-model="productFormData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="Calories"
        prop="calories"
        :rules="[{ required: true }]"
      >
        <el-input-number
          v-model="productFormData.calories"
          autocomplete="off"
          :min="0"
        />
      </el-form-item>
      <el-form-item
        label="Category"
        prop="categoryId"
        :rules="[{ required: true, message: 'Product category is required' }]"
      >
        <el-select
          v-model="productFormData.categoryId"
          placeholder="Please select a category"
          value-key="id"
          filterable
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Unit Type"
        prop="unitType"
        :rules="[{ required: true }]"
      >
        <el-select
          v-model="productFormData.unitType"
          placeholder="Please select a category"
          value-key="id"
          filterable
        >
          <el-option
            :key="UnitTypes.indexOf('item')"
            :label="UnitTypes[0]"
            :value="UnitTypes.indexOf('item')"
          />
          <el-option
            :key="UnitTypes.indexOf('ml')"
            :label="UnitTypes[1]"
            :value="UnitTypes.indexOf('ml')"
          />
          <el-option
            :key="UnitTypes.indexOf('l')"
            :label="UnitTypes[2]"
            :value="UnitTypes.indexOf('l')"
          />
          <el-option
            :key="UnitTypes.indexOf('g')"
            :label="UnitTypes[3]"
            :value="UnitTypes.indexOf('g')"
          />
          <el-option
            :key="UnitTypes.indexOf('kg')"
            :label="UnitTypes[4]"
            :value="UnitTypes.indexOf('kg')"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogUpdateProductForm = false">Cancel</el-button>
        <el-button type="primary" @click="UpdateProducts()"> Update </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogAddProductForm" title="Add Product">
    <el-form :model="productFormData">
      <el-form-item
        label="Product Name"
        prop="name"
        :rules="[{ required: true, message: 'Product name is required' }]"
      >
        <el-input v-model="productFormData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="Calories"
        prop="calories"
        :rules="[{ required: true }]"
      >
        <el-input-number
          v-model="productFormData.calories"
          autocomplete="off"
          :min="0"
        />
      </el-form-item>
      <el-form-item
        label="Category"
        prop="categoryId"
        :rules="[{ required: true, message: 'Product category is required' }]"
      >
        <el-select
          v-model="productFormData.categoryId"
          placeholder="Please select a category"
          value-key="id"
          filterable
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Unit Type"
        prop="unitType"
        :rules="[{ required: true }]"
      >
        <el-select
          v-model="productFormData.unitType"
          placeholder="Please select a category"
          value-key="id"
          filterable
        >
          <el-option
            :key="UnitTypes.indexOf('item')"
            :label="UnitTypes[0]"
            :value="UnitTypes.indexOf('item')"
          />
          <el-option
            :key="UnitTypes.indexOf('ml')"
            :label="UnitTypes[1]"
            :value="UnitTypes.indexOf('ml')"
          />
          <el-option
            :key="UnitTypes.indexOf('l')"
            :label="UnitTypes[2]"
            :value="UnitTypes.indexOf('l')"
          />
          <el-option
            :key="UnitTypes.indexOf('g')"
            :label="UnitTypes[3]"
            :value="UnitTypes.indexOf('g')"
          />
          <el-option
            :key="UnitTypes.indexOf('kg')"
            :label="UnitTypes[4]"
            :value="UnitTypes.indexOf('kg')"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogAddProductForm = false">Cancel</el-button>
        <el-button type="success" @click="AddProduct()"> Create </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogProductCategoryUpdate"
    title="Edit Product Category"
  >
    <el-form :model="productFormData">
      <el-form-item label="New Category Name">
        <el-input v-model="updateCategory.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogProductCategoryUpdate = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="UpdateCategory()"> Update </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
