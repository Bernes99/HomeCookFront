<script setup lang="ts">
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
} from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { GoogleLogin } from "vue3-google-login";
import { useRoute } from "vue-router";
import { router } from "../../router";
import axios from "axios";
import { User } from "../../Interfejsy";
import { useQuery } from "@tanstack/vue-query";
import { Plus } from "@element-plus/icons-vue";
import { baseApiUrl } from "../../main";

const route = useRoute();
let user = ref<User>(emptyUser());
let profilePicture = ref<string>();
const ruleFormRef = ref<FormInstance>();

function emptyUser(): User {
  return {
    firstName: "",
    surname: "",
    email: "",
    id: "",
    isDeleted: false,
    lastLogin: "",
  };
}

const getUser = () => {
  return axios
    .get(`User/${route.params.id}/Details`)
    .then((response) => {
      let data: User = response.data;
      user.value = data;
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

const getProfileImage = () => {
  return axios
    .get(`User/${route.params.id}/ProfileImage`)
    .then((response) => {
      let data: string = response.data;
      profilePicture.value = data;
      return data;
    })
    .catch((err) => {
      ElMessage({
        showClose: true,
        message: "Fail to find user",
        type: "error",
      });
      throw new Error("Fail catch users Profile Picture");
    });
};

async function submitForm(formEl: FormInstance | undefined) {
  try {
    const response = await axios.put(`User/${route.params.id}/UpdateUser`, {
      firstName: user.value.firstName,
      surname: user.value.surname,
      email: user.value.email,
    });
    ElMessage({
      showClose: true,
      message: "User has been Updated",
      type: "success",
    });
  } catch (err: any) {
    console.log(err.response);
    ElMessage({
      showClose: true,
      message: err.response.data.Message,
      type: "error",
    });
  }
}

const ValidateEmail = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the email again"));
  } else {
    let emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (!emailRegex.test(value)) {
      callback(new Error("Please input the valid email"));
    } else {
      callback();
    }
  }
};
const rules = reactive({
  firstName: [{ required: true, message: "Firstname is required" }],
  surname: [{ required: true, message: "Surname is required" }],
  email: [{ required: true, validator: ValidateEmail, trigger: "blur" }],
});
//#region avatar
function updateProfileUrl() {
  return baseApiUrl + `User/${route.params.id}/ProfileImage`;
}

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  profilePicture.value = URL.createObjectURL(uploadFile.raw!);
};
//#endregion
onMounted(() => {
  getUser();
  getProfileImage();
});
</script>

<template>
  <el-card class="">
    <template #header>
      <div class="">
        <span>Manage User</span>
      </div>
    </template>

    <div class="flex justify-around">
      <div>
        <el-form
          ref="ruleFormRef"
          :rules="rules"
          label-position="right"
          label-width="100px"
          :model="user"
          style="max-width: 460px"
          @keydown.enter="submitForm(ruleFormRef)"
        >
          <el-form-item label="Firstname" prop="firstName">
            <el-input v-model="user.firstName" />
          </el-form-item>
          <el-form-item label="Surname" prop="surname">
            <el-input v-model="user.surname" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="router.go(-1)"> Back </el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Update
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="max-w-[256px]">
        <!-- <img class="w-1/3" :src="profilePicture" alt="" />
      <div class="w-2/3 pl-4">test</div> -->
        <el-upload
          :action="updateProfileUrl()"
          :with-credentials="true"
          method="Put"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="profilePicture" :src="profilePicture" class="rounded-xl" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<style scoped></style>
