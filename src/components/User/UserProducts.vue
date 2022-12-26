<script setup lang="ts">
import axios from "axios";
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElOptionGroup,
  ElOption,
  ElInput,
  ElButton,
  ElTag,
  ElMessage,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
} from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  AddUserProducts,
  Category,
  Product,
  UnitTypes,
  UserProducts,
} from "../../Interfejsy";

const route = useRoute();

const productsOfCategory = ref<
  Array<{ categoryName: string; products: Array<{ id: string; name: string }> }>
>([]);

let categories = ref<Array<Category>>();
let products = ref<Array<Product>>([]);
let userProductsDetails = ref<Array<UserProducts>>([]);
let userProducts = ref<Array<AddUserProducts>>([]);

let dialogAddProductForm = ref<boolean>(false);

function emptyAddRecipe() {
  return {
    productId: "",
    expirationDate: "",
    amount: 1,
    isOnShoppingList: false,
  } as AddUserProducts;
}
const dateTimeFormatter = new Intl.DateTimeFormat("en-UK", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});

const inputProductId = ref<string>();
const inputProductAmount = ref<number>();
const inputExpirationDate = ref<string>();

const handleCloseAddProduct = (prod: AddUserProducts) => {
  userProducts.value.splice(userProducts.value.indexOf(prod), 1);
};

const handleAddProductInputConfirm = () => {
  let currentUserProd = userProducts.value.find(
    (x) => x.productId == inputProductId.value
  );
  console.log(currentUserProd);
  if (
    inputProductId.value &&
    inputProductAmount.value &&
    inputExpirationDate.value
  ) {
    if (currentUserProd) {
      currentUserProd.amount = inputProductAmount.value;
    } else {
      userProducts.value.push({
        productId: inputProductId.value,
        amount: inputProductAmount.value,
        expirationDate: inputExpirationDate.value,
        isOnShoppingList: false,
      });
    }
  }

  inputProductId.value = "";
  inputProductAmount.value = 0;
  inputExpirationDate.value = "";
};

const AddUserProduct = () => {
  axios
    .post(`User/${route.params.id}/Products/AddOrUpdate`, userProducts.value)
    .then((response) => {
      setproductOfCategories();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to find user products",
        type: "error",
      });
      throw new Error("Fail catch user products list");
    });
};

const GetProductCategories = () => {
  return axios
    .get(`Product/Category/GetProductCategoryList`)
    .then((response) => {
      let data: Array<Category> = response.data;
      categories.value = data;

      setproductOfCategories();
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
      console.log(products.value);
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

const GetUserProducts = () => {
  return axios
    .get(`User/${route.params.id}/Products`)
    .then((response) => {
      let data: Array<UserProducts> = response.data;

      userProducts.value = [];
      data.forEach((prod) => {
        let product: AddUserProducts = {
          productId: prod.product.id,
          amount: prod.amount,
          expirationDate: prod.expirationDate,
          isOnShoppingList: prod.isOnShoppingList,
        };
        userProducts.value.push(product);
      });

      data = data.map((element) => ({
        ...element,
        expirationDate: element.expirationDate
          ? dateTimeFormatter
              .format(new Date(element.expirationDate))
              .replace(",", "")
          : "Never",
      }));
      userProductsDetails.value = data;
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

async function deleteProduct(row: UserProducts) {
  axios
    .delete(`User/${route.params.id}/Products/Remove`, {
      data: { id: [row.id] },
    })
    .then(async (response) => {
      ElMessage({
        showClose: true,
        message: "Product has been Deleted",
        type: "success",
      });
      await GetUserProducts();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to Delete product",
        type: "error",
      });
    });
}

onMounted(async () => {
  await GetProducts();
  await GetProductCategories();
  await GetUserProducts();
});

function setproductOfCategories() {
  categories.value?.forEach((x) =>
    productsOfCategory.value.push({
      categoryName: x.name,
      products: GetproductsOfCategory(x.name),
    })
  );
}

function GetproductsOfCategory(cat: string) {
  return (
    products.value
      ?.filter((x) => x.category.name === cat)
      .map((x) => ({ id: x.id, name: x.name })) ?? []
  );
}

const getProductUnit = () => {
  return UnitTypes[
    products.value?.find((x) => x.id == inputProductId.value)?.unitType ?? 0
  ];
};

async function openAddProductDialog() {
  //   productFormData.value.calories = 0;
  //   productFormData.value.categoryId = "";
  //   productFormData.value.id = "";
  //   productFormData.value.name = "";
  //   productFormData.value.unitType = 0;

  dialogAddProductForm.value = true;
}
</script>

<template>
  <el-card class="">
    <template #header>
      <div class="">
        <span>Manage Products</span>
      </div>
    </template>

    <div class="flex justify-center">
      <el-button type="success" class="w-1/2" @click="openAddProductDialog"
        >Add Product</el-button
      >
    </div>
    <el-table
      class=""
      :data="userProductsDetails"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :flexible="true"
    >
      <el-table-column prop="product.name" label="Name" sortable width="" />
      <el-table-column prop="amount" label="Amount" sortable width="" />
      <el-table-column
        prop="expirationDate"
        label="Expiration Date"
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
  </el-card>
  <el-dialog v-model="dialogAddProductForm" title="Add Product">
    <el-form>
      <el-form-item label="Products">
        <div class="flex w-full mb-4">
          <el-select
            v-model="inputProductId"
            placeholder="Please select a category"
            value-key="id"
            filterable
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option-group
              v-for="prodOfCat in productsOfCategory"
              :key="prodOfCat.categoryName"
              :label="prodOfCat.categoryName"
            >
              <el-option
                v-for="product in prodOfCat.products"
                :key="product.name"
                :label="product.name"
                :value="product.id"
              >
              </el-option>
            </el-option-group>
          </el-select>
          <el-input
            v-model="inputProductAmount"
            class=""
            size=""
            type="number"
            :min="0"
            @keyup.enter="handleAddProductInputConfirm()"
            ><template #append>{{ getProductUnit() }} </template></el-input
          >
        </div>
      </el-form-item>
      <el-form-item label="Expiration Date">
        <el-date-picker
          v-model="inputExpirationDate"
          type="datetime"
          placeholder="Select date and time"
          size="large"
        />
      </el-form-item>
      <el-form-item class="flex">
        <el-button
          class="ml-2 w-full"
          size=""
          type="primary"
          @click="handleAddProductInputConfirm()"
        >
          Add Product
        </el-button>
      </el-form-item>

      <el-tag
        v-for="prod in userProducts"
        :key="prod.productId"
        class="mx-1"
        closable
        :disable-transitions="false"
        type="warning"
        @close="handleCloseAddProduct(prod)"
      >
        {{ products.find((x) => x.id === prod.productId)?.name }}
        {{ prod.amount }}
      </el-tag>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogAddProductForm = false">Cancel</el-button>
        <el-button type="success" @click="AddUserProduct()"> Save </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
