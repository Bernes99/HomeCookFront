<script setup lang="ts">
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { ref } from "vue";

let isGoogleMapsdrawer = ref(false);
let direction = ref("rtl");

const googleMapsdrawer = () => {
  isGoogleMapsdrawer.value = true;
  if (window.innerWidth < 1280) {
    direction.value = "ttb";
  } else {
    direction.value = "rtl";
  }
};
</script>

<template>
  <main>
    <div class="flex justify-center items-center">
      <div class="bg-slate-400 w-[1000px] flex rounded-md">
        <div class="w-4/5 aspect-video relative">
          <el-image
            class="w-full h-full rounded-md !absolute"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit=""
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
            <span class="text-white">
              aaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaa{{}}
            </span>
          </div>
        </div>
        <div class="w-1/5 bg-red-600 border-l-white border-l-2 rounded-r-md">
          <div>
            <span>Czas Przygotowania: {{}}</span>
          </div>
          <div>
            <span>porcja:{{}}</span>
          </div>
          <div><el-avatar>A{{}}</el-avatar></div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-3">
      <div class="h-80 w-2/12 bg-green-700 mr-2">
        <div class="ml-2">
          potrzebne składniki:
          <!-- <li v-for="item in items"></li> -->
          <li @click="googleMapsdrawer">skladnik 1</li>
        </div>
        <!-- dodać modala po kliknięciu w składnik który wyswietlio mape googla z pobliskim sklepem -->
      </div>
      <div class="w-8/12 h-96 bg-blue-700">
        <div>Przepis</div>
      </div>
    </div>
    <div
      class="h-16 flex justify-center items-center border-dotted border-black border-t-[1px] border-b-[1px] mt-2"
    >
      <div>komentarze</div>
    </div>
    <div class="flex flex-wrap justify-center">
      <div class="basis-1/2 justify-center items-center flex">
        <div class="w-96 h-32 bg-orange-600 mt-4 justify-center items-center">
          <div class="mt-4 ml-4 flex items-center">
            <el-avatar>A{{}}</el-avatar>
            <span class="pl-4 pr-2">Anna Kowalska {{}} </span>
            <span class="text-sm ml-auto mr-4">22.02.2022</span>
          </div>
          <div>content</div>
        </div>
      </div>
      <div class="basis-1/2 justify-center items-center flex">
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
      </div>
    </div>
    <div
      class="h-16 flex justify-center items-center border-dotted border-black border-t-[1px] border-b-[1px] mt-2"
    >
      <div>Polecamy</div>
    </div>
    <div class="flex flex-wrap justify-evenly">
      <!--todo vfor start -->
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
            <span class="text-white"> test test test{{}} </span>
          </div>
        </div>
      </div>
      <!--todo vfor stop -->
      <!--przyykładowe na teraz  -->
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
    </div>
    <el-drawer
      v-model="isGoogleMapsdrawer"
      :direction="direction"
      title="Google maps"
      :with-header="false"
    >
      <span>TU BĘDA MAPY GOOGLA</span>
    </el-drawer>
  </main>
</template>

<style scoped></style>
