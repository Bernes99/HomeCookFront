<script setup lang="ts">
import {
  Picture as IconPicture,
  Promotion,
  User,
  UserFilled,
} from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import { isLoggedIn as isLoggedInRouter } from "../../router";
import {
  ElMessage,
  ElImage,
  ElIcon,
  ElAvatar,
  ElDrawer,
  ElCarousel,
  ElCarouselItem,
  ElButton,
  ElInput,
  ElCard,
  ElDivider,
  ElTag,
} from "element-plus";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { Recipe, RecipeComment, UnitTypes } from "../../Interfejsy";

const route = useRoute();

let recipe = ref<Recipe>(emptyrecipe());
let caruselImages = ref<Array<string>>([]);
let comments = ref<Array<RecipeComment>>();

let writeComment = ref<string>();

const userAvatar = ref<string>("");
function emptyrecipe(): Recipe {
  return {
    id: "",
    dateUtc: "",
    title: "",
    introdution: "",
    text: "",
    rating: 0,
    portion: "",
    preparingTime: "",
    difficulty: 0,
    author: { id: "", firstName: "", surname: "", email: "" },
    products: [],
    categories: [],
    mainImage: "",
    images: [],
    tags: [],
  };
}

let isGoogleMapsdrawer = ref(false);
let direction = ref("rtl");

const dateTimeFormatter = new Intl.DateTimeFormat("en-UK", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});

async function GetCurrentUserAvatar() {
  const response = await axios.get(
    `User/${isLogged.data.value?.id}/ProfileImage`
  );
  return response.data as string;
}

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

const enableAvatar = computed(() => !!isLogged.data.value?.id);
const userAvatarQuery = useQuery(["UserAvatar"], GetCurrentUserAvatar, {
  enabled: enableAvatar,
});

//route.params.id
const googleMapsdrawer = () => {
  isGoogleMapsdrawer.value = true;
  if (window.innerWidth < 1280) {
    direction.value = "ttb";
  } else {
    direction.value = "rtl";
  }
};
async function GetAvatar(id: string) {
  const response = await axios.get(`User/${id}/ProfileImage`);
  return response.data as string;
}

async function GetComments() {
  const response = await axios.get(`Recipe/${route.params.id}/GetComments`);
  let data: Array<RecipeComment> = response.data;
  data = data.map((element) => ({
    ...element,
    dateCreatedUtc: dateTimeFormatter
      .format(new Date(element.dateCreatedUtc))
      .replace(",", ""),
  }));
  return data;
}

const sendComment = () => {
  if (!writeComment.value || writeComment.value === "") return;
  axios
    .post(`Recipe/${route.params.id}/AddComment`, null, {
      params: { text: writeComment.value },
    })
    .then(async (response) => {
      ElMessage({
        showClose: true,
        message: "Comment has been Added",
        type: "success",
      });
      comments.value = await GetComments();
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to send Comment",
        type: "error",
      });
      throw new Error("Fail to send Comment");
    });
};
const getRecipe = () => {
  return axios
    .get(`Recipe/${route.params.id}`)
    .then(async (response) => {
      let data: Recipe = response.data;
      recipe.value = data;

      let allImages = [];
      allImages.push(recipe.value.mainImage);
      recipe.value.images.forEach((x) => allImages.push(x));
      caruselImages.value = allImages;

      comments.value = await GetComments();

      userAvatar.value = await GetAvatar(recipe.value.author.id);
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to find recipe",
        type: "error",
      });
      throw new Error("Fail catch users list");
    });
};

const RecipeQuery = useQuery(
  ["Recipe", route.params.id],
  () => getRecipe(),
  //null,
  { enabled: true }
);
// onMounted(() => {
//   getRecipe();
// });
</script>

<template>
  <main>
    <div class="flex justify-center items-center">
      <div class="bg-slate-400 w-[1000px] flex rounded-md">
        <el-carousel height="100%" class="w-4/5 aspect-video relative">
          <el-carousel-item class=""
            ><el-image
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
          </el-carousel-item>
          <el-carousel-item v-for="image in recipe.images" class=""
            ><el-image
              class="w-full h-full rounded-md !absolute"
              :src="image"
              fit=""
            >
              <template #error>
                <div class="h-full flex justify-center items-center">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </el-carousel-item>
          <div
            class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip"
          >
            <span class="text-white p-2">
              {{ recipe.title }}
            </span>
          </div>
        </el-carousel>

        <div class="w-1/5 bg-gray-200 border-l-white border-l-2 rounded-r-md">
          <div class="flex items-center m-2">
            <el-avatar :icon="UserFilled" :src="userAvatar" />
            <span class="px-2"
              >{{ recipe.author.firstName }} {{ recipe.author.surname }}
            </span>
          </div>
          <el-divider class="!my-4 !border-1 !border-gray-300" />
          <div class="m-2">
            <span>Prepering Time: {{ recipe.preparingTime }}</span>
          </div>
          <el-divider class="!my-4 !border-1 !border-gray-300" />
          <div class="m-2">
            <span>Portions: {{ recipe.portion }}</span>
          </div>
          <el-divider class="!my-4 !border-1 !border-gray-300" />
          <div class="m-2">
            <p class="mb-2">Category:</p>

            <el-tag
              v-for="item in recipe.categories"
              :key="item.id"
              class="mx-1"
              :type="'success'"
              effect="light"
            >
              {{ item.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-3">
      <el-card class="h-80 min-h-[20rem] w-2/12 bg-green-700 mr-2">
        <div class="ml-2">
          Products:
          <!-- <li @click="googleMapsdrawer" v-for="product in recipe.products"> -->
          <li @click="" v-for="product in recipe.products">
            {{ product.product.name }}, {{ product.amount }}
            {{ UnitTypes[product.product.unitType] }}
          </li>
        </div>
        <!-- dodać modala po kliknięciu w składnik który wyswietlio mape googla z pobliskim sklepem -->
      </el-card>
      <el-card class="w-8/12 min-h-[24rem] bg-blue-700">
        <div>{{ recipe.introdution }}</div>
        <div>
          {{ recipe.text }}
        </div>
      </el-card>
    </div>
    <div
      class="h-16 flex justify-center items-center border-dotted border-black border-t-[1px] border-b-[1px] mt-2"
    >
      <div>Comments</div>
    </div>
    <div
      v-if="isLogged.data.value?.isAuthenticated"
      class="h-16 flex justify-center items-center mt-2 mx-2"
    >
      <el-avatar
        class="mr-1"
        shape="square"
        :icon="UserFilled"
        :src="userAvatarQuery.data.value"
      />
      <el-input
        v-model="writeComment"
        class="my-2 mr-0"
        size="large"
        autosize
        placeholder="Write Comment"
      />
      <el-button type="primary" size="large" @click="sendComment()"
        ><el-icon><Promotion /></el-icon
      ></el-button>
    </div>

    <div class="flex flex-wrap justify-center">
      <div
        class="basis-1/2 justify-center items-center flex"
        v-for="comment in comments"
      >
        <el-card
          class="w-96 h-32 bg-gray-200 mt-4 justify-center items-center rounded-md"
        >
          <div class="flex items-center">
            <el-avatar :icon="UserFilled" :src="userAvatar" />
            <span class="pl-2 pr-2">{{ comment.author }} </span>
            <span class="text-sm ml-auto mr-4">{{
              comment.dateCreatedUtc
            }}</span>
          </div>
          <el-divider class="!my-2 !border-1 !border-gray-300" />
          <div class="px-4">{{ comment.text }}</div>
        </el-card>
      </div>
      <!-- <div class="basis-1/2 justify-center items-center flex">
        <div class="w-96 h-32 bg-orange-600 mt-4">
          <div class="mt-4 ml-4">
            <el-avatar>A{{}}</el-avatar>
            <span class="pl-4">Paweł Kowal </span>
          </div>
        </div>
      </div>
      <div class="basis-1/2 justify-center items-center flex">
        <div class="w-96 h-32 bg-orange-600 mt-4">
          <div class="mt-4 ml-4">
            <el-avatar>A{{}}</el-avatar>
            <span class="pl-4">Anna Kowalska </span>
          </div>
        </div>
      </div>
      <div class="basis-1/2 justify-center items-center flex">
        <div class="w-96 h-32 bg-orange-600 mt-4">
          <div class="mt-4 ml-4">
            <el-avatar>A{{}}</el-avatar>
            <span class="pl-4">Anna Kowalska </span>
          </div>
        </div>
      </div> -->
    </div>
    <!-- <div
      class="h-16 flex justify-center items-center border-dotted border-black border-t-[1px] border-b-[1px] mt-2"
    >
      <div>Polecamy</div>
    </div>
    <div class="flex flex-wrap justify-evenly"> -->
    <!--todo vfor start -->
    <!-- <div class="md:basis-1/5 basis-1/2 justify-center items-center flex">
        <div class="w-52 h-52 bg-slate-400 mt-4 relative">
          <el-image
            class="w-full h-full"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="fill"
          >
            <template #error>
              <div class="h-full flex justify-center items-center">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div
            class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip"
          >
            <span class="text-white"> test test test{{}} </span>
          </div>
        </div>
      </div> -->
    <!--todo vfor stop -->
    <!--przyykładowe na teraz  -->
    <!-- <div class="md:basis-1/5 basis-1/2 justify-center items-center flex">
        <div class="w-52 h-52 bg-slate-400 mt-4 relative">
          <el-image
            class="w-full h-full"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="fill"
          >
            <template #error>
              <div class="h-full flex justify-center items-center">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div
            class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip"
          >
            <span class="text-white"> test1{{}} </span>
          </div>
        </div>
      </div>
      <div class="md:basis-1/5 basis-1/2 justify-center items-center flex">
        <div class="w-52 h-52 bg-slate-400 mt-4 relative">
          <el-image
            class="w-full h-full"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="fill"
          >
            <template #error>
              <div class="h-full flex justify-center items-center">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div
            class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip"
          >
            <span class="text-white"> test2{{}} </span>
          </div>
        </div>
      </div>
      <div class="md:basis-1/5 basis-1/2 justify-center items-center flex">
        <div class="w-52 h-52 bg-slate-400 mt-4 relative">
          <el-image
            class="w-full h-full"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="fill"
          >
            <template #error>
              <div class="h-full flex justify-center items-center">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div
            class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip"
          >
            <span class="text-white"> test3{{}} </span>
          </div>
        </div>
      </div>
      <div class="md:basis-1/5 basis-1/2 justify-center items-center flex">
        <div class="w-52 h-52 bg-slate-400 mt-4 relative">
          <el-image
            class="w-full h-full"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="fill"
          >
            <template #error>
              <div class="h-full flex justify-center items-center">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div
            class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 overflow-clip"
          >
            <span class="text-white"> test4{{}} </span>
          </div>
        </div>
      </div>
    </div> -->
    <el-drawer
      v-model="isGoogleMapsdrawer"
      :direction="'rtl'"
      title="Google maps"
      :with-header="false"
    >
      <span>TU BĘDA MAPY GOOGLA</span>
    </el-drawer>
  </main>
</template>

<style scoped></style>
