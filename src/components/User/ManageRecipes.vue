<script setup lang="ts">
import { Trophy, UploadFilled } from "@element-plus/icons-vue";
import axios from "axios";
import {
  ElTabs,
  ElTabPane,
  ElCard,
  ElButton,
  ElIcon,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElRate,
  ElMessage,
  ElTag,
  ElOptionGroup,
  ElUpload,
  UploadUserFile,
  UploadFile,
  UploadFiles,
} from "element-plus";
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  AddRecipe,
  AddRecipeProduct,
  Category,
  Product,
  Recipe,
  UnitTypes,
} from "../../Interfejsy";

const route = useRoute();

const activeName = ref("AddRecipe");
const display = ref<Array<{ id: string; display: string }>>([]);
const userRecipes = ref<Array<Recipe>>();

let recipeCategories = ref<Array<Category>>();
let categories = ref<Array<Category>>();
let products = ref<Array<Product>>();

let mainImageRecipeId = ref<string>();

const productsOfCategory = ref<
  Array<{ categoryName: string; products: Array<{ id: string; name: string }> }>
>([]);

let recipeFormData = ref<AddRecipe>(emptyAddRecipe());
let updateRecipeFormData = ref<Array<{ updateRecipe: AddRecipe; id: string }>>(
  []
);
let addproductsId = ref<Array<string>>([]);
let updateProductsId = ref<Array<string>>([]);

const images = ref<UploadFiles>([]);
const mainImage = ref<UploadFile>();

const handleImageUpload = (file: UploadFile, files: UploadFiles) => {
  images.value = files;
};

const handleMaiIimageUpload = (file: UploadFile) => {
  mainImage.value = file;
};

const handleMaiIimageUpdate = (file: UploadFile) => {
  let bodyFormData = new FormData();

  if (file.raw && mainImageRecipeId.value) {
    bodyFormData.append("file", file.raw);
    axios
      .put(`Recipe/${mainImageRecipeId.value}/UpdateMainImage`, bodyFormData)
      .then((response) => {
        ElMessage({
          showClose: true,
          message: "Main image has been updated",
          type: "success",
        });
      })
      .catch((err) => {
        ElMessage({
          showClose: true,
          message: "Fail to Delete recipe category",
          type: "error",
        });
      });
  }
};

function emptyAddRecipe() {
  return {
    title: "",
    introdution: "",
    text: "",
    portion: "",
    authorId: "",
    preparingTime: "",
    difficulty: 1,
    products: [],
    categoriesIds: [],
    tags: [],
  } as AddRecipe;
}

const getUserRecipes = () => {
  updateRecipeFormData.value = [];
  return axios
    .get(`User/${route.params.id}/Recipes`)
    .then((response) => {
      let data: Array<Recipe> = response.data;
      userRecipes.value = data;

      userRecipes.value.forEach((recipe) => {
        display.value.push({ id: recipe.id, display: "none" });

        let recipeProducts: Array<AddRecipeProduct> = [];

        recipe.products.forEach((product) => {
          recipeProducts.push({
            productId: product.product.id,
            amount: product.amount,
          } as AddRecipeProduct);
        });

        let addrecipeModel: AddRecipe = {
          title: recipe.title,
          introdution: recipe.introdution,
          text: recipe.text,
          portion: recipe.portion,
          authorId: recipe.author.id,
          preparingTime: recipe.preparingTime,
          difficulty: recipe.difficulty / 2,
          products: recipeProducts,
          categoriesIds: recipe.categories.map((x) => x.id),
          tags: recipe.tags.map((x) => x.name),
        };

        updateRecipeFormData.value.push({
          updateRecipe: addrecipeModel,
          id: recipe.id,
        });
      });

      return data;
    })
    .catch((err) => {
      throw new Error("Fail catch users Recipes");
    });
};

function toogleBody(id: string) {
  display.value.filter((x) => x.id === id)[0].display =
    display.value.filter((x) => x.id === id)[0].display === "block"
      ? "none"
      : "block";
}
function isDisplay(id: string) {
  return display.value.filter((x) => x.id == id)[0].display;
}

const GetRecipeCategories = () => {
  return axios
    .get(`Recipe/Category/GetCategoryList`)
    .then((response) => {
      let data: Array<Category> = response.data;
      recipeCategories.value = data;
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to find Recipe Categories",
        type: "error",
      });
      throw new Error("Fail catch Recipe Categories");
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

async function AddNewRecipe() {
  let bodyFormData = new FormData();
  if (!mainImage.value?.raw) {
  } else {
    bodyFormData.append("mainPicture", mainImage.value?.raw);
  }
  recipeFormData.value.difficulty = recipeFormData.value.difficulty * 2;
  addproductsId.value.forEach((id) => {
    recipeFormData.value.products.push({ productId: id, amount: 1 });
  });
  recipeFormData.value.products;
  recipeFormData.value.authorId = route.params.id as string;

  images.value.forEach((image) => {
    if (image.raw) bodyFormData.append("pictures", image.raw);
  });
  bodyFormData.append("model", JSON.stringify(recipeFormData.value));

  return axios
    .post(`Recipe/AddRecipe`, bodyFormData)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe has been Created",
        type: "success",
      });
      GetRecipeCategories();
      recipeFormData.value.difficulty = recipeFormData.value.difficulty / 2;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to create recipe ",
        type: "error",
      });
      recipeFormData.value.difficulty = recipeFormData.value.difficulty / 2;
    });
}

async function UpdateRecipe(recipeId: string) {
  let udpateRecipe = updateRecipeFormData.value.find(
    (x) => x.id == recipeId
  )?.updateRecipe;

  if (!udpateRecipe) {
    return;
  }
  udpateRecipe.difficulty = udpateRecipe.difficulty * 2;

  console.log(udpateRecipe);
  return axios
    .put(`Recipe/${recipeId}`, udpateRecipe)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe has been Created",
        type: "success",
      });
      GetRecipeCategories();
      getUserRecipes();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to create recipe ",
        type: "error",
      });
    });
}

async function DeleteRecipe(recipeId: string) {
  return axios
    .delete(`Recipe/${recipeId}`)
    .then((response) => {
      ElMessage({
        showClose: true,
        message: "Recipe has been Deleted",
        type: "success",
      });
      GetRecipeCategories();
      getUserRecipes();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to create recipe ",
        type: "error",
      });
    });
}

onMounted(async () => {
  await getUserRecipes();
  await GetRecipeCategories();
  await GetProducts();
  await GetProductCategories();
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

//#region add product

const inputProductId = ref("");
const inputProductAmount = ref(1);

const handleCloseProduct = (prod: AddRecipeProduct, recipeId: string) => {
  updateRecipeFormData.value
    .find((x) => x.id == recipeId)
    ?.updateRecipe.products.splice(
      recipeFormData.value.products.indexOf(prod),
      1
    );
};

const handleCloseAddProduct = (prod: AddRecipeProduct) => {
  recipeFormData.value.products.splice(
    recipeFormData.value.products.indexOf(prod),
    1
  );
};

const handleProductInputConfirm = (recipeId: string) => {
  let currentProd = updateRecipeFormData.value
    .find((x) => x.id == recipeId)
    ?.updateRecipe.products.find((x) => x.productId == inputProductId.value);
  if (inputProductId.value && inputProductAmount.value) {
    if (currentProd) {
      currentProd.amount = inputProductAmount.value;
    } else {
      updateRecipeFormData.value
        .find((x) => x.id == recipeId)
        ?.updateRecipe.products.push({
          productId: inputProductId.value,
          amount: inputProductAmount.value,
        });
    }
  }

  inputProductId.value = "";
  inputProductAmount.value = 0;
};

const handleAddProductInputConfirm = () => {
  let currentProd = recipeFormData.value.products.find(
    (x) => x.productId == inputProductId.value
  );
  if (inputProductId.value && inputProductAmount.value) {
    if (currentProd) {
      currentProd.amount = inputProductAmount.value;
    } else {
      recipeFormData.value.products.push({
        productId: inputProductId.value,
        amount: inputProductAmount.value,
      });
    }
  }

  inputProductId.value = "";
  inputProductAmount.value = 0;
};

const getProductUnit = () => {
  return UnitTypes[
    products.value?.find((x) => x.id == inputProductId.value)?.unitType ?? 0
  ];
};
//#endregion

//#region tags
const inputTagVisible = ref(false);
const inputTagValue = ref("");
const InputTagRef = ref<InstanceType<typeof ElInput>>();

const handleCloseTag = (tag: string) => {
  recipeFormData.value.tags.splice(recipeFormData.value.tags.indexOf(tag), 1);
};

const handleUpdateCloseTag = (tag: string, recipeId: string) => {
  updateRecipeFormData.value
    .find((x) => x.id == recipeId)
    ?.updateRecipe.tags.splice(recipeFormData.value.tags.indexOf(tag), 1);
};
const showInput = () => {
  inputTagVisible.value = true;
  nextTick(() => {
    InputTagRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputTagValue.value) {
    recipeFormData.value.tags.push(inputTagValue.value);
  }
  inputTagVisible.value = false;
  inputTagValue.value = "";
};

const handleUpdateInputConfirm = (recipeId: string) => {
  if (inputTagValue.value) {
    updateRecipeFormData.value
      .find((x) => x.id == recipeId)
      ?.updateRecipe.tags.push(inputTagValue.value);
  }
  inputTagVisible.value = false;
  inputTagValue.value = "";
};
//#endregion
</script>

<template>
  <main class="overflow-auto">
    <el-tabs v-model="activeName" class="mx-2">
      <el-tab-pane name="AddRecipe" class="mx-2">
        <template #label>
          <span class="custom-tabs-label">
            <span>Add Recipe</span>
          </span>
        </template>
        <el-card class="">
          <template #header>
            <div class="flex items-baseline justify-between">
              <span>Add Recipe</span>
              <el-button class="w-2/12" type="success" @click="AddNewRecipe"
                >Create</el-button
              >
            </div>
          </template>
          <el-form :model="recipeFormData">
            <el-form-item
              label="Title"
              prop="title"
              :rules="[{ required: true, message: 'Recipe title is required' }]"
            >
              <el-input v-model="recipeFormData.title" autocomplete="off" />
            </el-form-item>

            <el-form-item
              label="Introdution"
              prop="introdution"
              :rules="[{ required: true }]"
            >
              <el-input
                v-model="recipeFormData.introdution"
                autocomplete="off"
                :min="0"
                autosize
                type="textarea"
              />
            </el-form-item>

            <el-form-item
              label="Text"
              prop="text"
              :rules="[{ required: true }]"
            >
              <el-input
                v-model="recipeFormData.text"
                autocomplete="off"
                :min="0"
                autosize
                type="textarea"
              />
            </el-form-item>

            <el-form-item
              label="Portion"
              prop="portion"
              :rules="[{ required: true, message: 'Portion is required' }]"
            >
              <el-input v-model="recipeFormData.portion" autocomplete="off" />
            </el-form-item>

            <el-form-item
              label="Preparing Time"
              prop="preparingTime"
              :rules="[
                { required: true, message: 'Preparing Time is required' },
              ]"
            >
              <el-input
                v-model="recipeFormData.preparingTime"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item
              label="Difficulty"
              prop="difficulty"
              :rules="[{ required: true, message: 'Difficulty is required' }]"
            >
              <el-rate
                v-model="recipeFormData.difficulty"
                clearable
                :max="5"
                allow-half
                :icons="[Trophy, Trophy, Trophy]"
                :void-icon="Trophy"
                :colors="['#22C55E', '#EB9A11', '#EB0000']"
              />
            </el-form-item>

            <el-form-item
              label="Category"
              prop="categoriesIds"
              :rules="[
                { required: true, message: 'Recipe category is required' },
              ]"
            >
              <el-select
                v-model="recipeFormData.categoriesIds"
                placeholder="Please select a category"
                value-key="id"
                multiple
                collapse-tags
                collapse-tags-tooltip
                filterable
              >
                <el-option
                  v-for="item in recipeCategories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

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
                  ><template #append
                    >{{ getProductUnit() }}
                  </template></el-input
                >
                <el-button
                  class="ml-2"
                  size=""
                  type="primary"
                  @click="handleAddProductInputConfirm()"
                >
                  Add Product
                </el-button>
              </div>
              <el-tag
                v-for="prod in recipeFormData.products"
                :key="prod.productId"
                class="mx-1"
                closable
                :disable-transitions="false"
                type="warning"
                @close="handleCloseAddProduct(prod)"
              >
                {{ products?.find((x) => x.id == prod.productId)?.name }}
                {{ prod.amount }}
              </el-tag>
            </el-form-item>

            <el-form-item label="Tags" prop="tags">
              <el-tag
                v-for="tag in recipeFormData.tags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputTagVisible"
                ref="InputTagRef"
                v-model="inputTagValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag ml-1"
                size="small"
                @click="showInput"
              >
                + New Tag
              </el-button>
            </el-form-item>

            <div class="flex justify-around">
              <el-form-item
                class="items-start"
                label="Main Image"
                prop="mainImage"
                :rules="[{ required: true, message: 'MainImage is required' }]"
              >
                <el-upload
                  class="[&>div:first-child>div:first-child]:!py-2"
                  drag
                  action="#"
                  :auto-upload="false"
                  :on-change="handleMaiIimageUpload"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
              </el-form-item>

              <el-form-item
                class="items-start"
                label="Recipe Images"
                prop="images"
                :rules="[{ required: true, message: 'MainImage is required' }]"
              >
                <el-upload
                  class="[&>div:first-child>div:first-child]:!p-2"
                  drag
                  action="#"
                  multiple
                  :auto-upload="false"
                  :file-list="images"
                  :on-change="handleImageUpload"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Recipes" name="Recipes">
        <el-card
          v-for="recipe in updateRecipeFormData"
          :key="recipe.id"
          class="my-1 [&>div:first-child]:!p-0"
          :body-style="'display: ' + isDisplay(recipe.id)"
        >
          <template #header>
            <div class="py-4 px-5" @click="toogleBody(recipe.id)">
              <div class="flex items-baseline justify-between">
                <span>{{ recipe.updateRecipe.title }}</span>
                <div class="w-3/12 flex">
                  <el-button
                    class="w-6/12"
                    type="success"
                    @click="UpdateRecipe(recipe.id)"
                    >Update</el-button
                  >
                  <el-button
                    class="w-6/12"
                    type="danger"
                    @click="DeleteRecipe(recipe.id)"
                    >Delete</el-button
                  >
                </div>
              </div>
            </div>
          </template>
          <el-form :model="recipe.updateRecipe">
            <el-form-item
              label="Title"
              prop="title"
              :rules="[{ required: true, message: 'Recipe title is required' }]"
            >
              <el-input
                v-model="recipe.updateRecipe.title"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item
              label="Introdution"
              prop="introdution"
              :rules="[{ required: true }]"
            >
              <el-input
                v-model="recipe.updateRecipe.introdution"
                autocomplete="off"
                :min="0"
                autosize
                type="textarea"
              />
            </el-form-item>

            <el-form-item
              label="Text"
              prop="text"
              :rules="[{ required: true }]"
            >
              <el-input
                v-model="recipe.updateRecipe.text"
                autocomplete="off"
                :min="0"
                autosize
                type="textarea"
              />
            </el-form-item>

            <el-form-item
              label="Portion"
              prop="portion"
              :rules="[{ required: true, message: 'Portion is required' }]"
            >
              <el-input
                v-model="recipe.updateRecipe.portion"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item
              label="Preparing Time"
              prop="preparingTime"
              :rules="[
                { required: true, message: 'Preparing Time is required' },
              ]"
            >
              <el-input
                v-model="recipe.updateRecipe.preparingTime"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item
              label="Difficulty"
              prop="difficulty"
              :rules="[{ required: true, message: 'Difficulty is required' }]"
            >
              <el-rate
                v-model="recipe.updateRecipe.difficulty"
                clearable
                :max="5"
                allow-half
                :icons="[Trophy, Trophy, Trophy]"
                :void-icon="Trophy"
                :colors="['#22C55E', '#EB9A11', '#EB0000']"
              />
            </el-form-item>

            <el-form-item
              label="Category"
              prop="categoriesIds"
              :rules="[
                { required: true, message: 'Recipe category is required' },
              ]"
            >
              <el-select
                v-model="recipe.updateRecipe.categoriesIds"
                placeholder="Please select a category"
                value-key="id"
                multiple
                collapse-tags
                collapse-tags-tooltip
                filterable
              >
                <el-option
                  v-for="item in recipeCategories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

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
                  @keyup.enter="handleProductInputConfirm(recipe.id)"
                  ><template #append
                    >{{ getProductUnit() }}
                  </template></el-input
                >
                <el-button
                  class="ml-2"
                  size=""
                  type="primary"
                  @click="handleProductInputConfirm(recipe.id)"
                >
                  Add Product
                </el-button>
              </div>
              <el-tag
                v-for="prod in recipe.updateRecipe.products"
                :key="prod.productId"
                class="mx-1"
                closable
                :disable-transitions="false"
                type="warning"
                @close="handleCloseProduct(prod, recipe.id)"
              >
                {{ products?.find((x) => x.id == prod.productId)?.name }}
                {{ prod.amount }}
              </el-tag>
            </el-form-item>

            <el-form-item label="Tags" prop="tags">
              <el-tag
                v-for="tag in recipe.updateRecipe.tags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleUpdateCloseTag(tag, recipe.id)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputTagVisible"
                ref="InputTagRef"
                v-model="inputTagValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleUpdateInputConfirm(recipe.id)"
                @blur="handleUpdateInputConfirm(recipe.id)"
              />
              <el-button
                v-else
                class="button-new-tag ml-1"
                size="small"
                @click="showInput"
              >
                + New Tag
              </el-button>
            </el-form-item>

            <div class="flex justify-around">
              <el-form-item
                class="items-start"
                label="Main Image"
                prop="mainImage"
                :rules="[{ required: true, message: 'MainImage is required' }]"
              >
                <el-upload
                  class="[&>div:first-child>div:first-child]:!py-2"
                  drag
                  action="#"
                  :auto-upload="false"
                  @click="
                    () => {
                      mainImageRecipeId = recipe.id;
                    }
                  "
                  :on-change="handleMaiIimageUpdate"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
              </el-form-item>

              <el-form-item
                class="items-start"
                label="Recipe Images"
                prop="images"
              >
                <el-upload
                  class="[&>div:first-child>div:first-child]:!p-2"
                  drag
                  action="#"
                  multiple
                  :auto-upload="false"
                  :file-list="images"
                  :on-change="handleImageUpload"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<style scoped></style>
