<template>
  <div id="userRegisterView" class="register-container">
    <div class="register-header">
      <h2>欢迎注册</h2>
      <p>请输入您的账号和密码</p>
    </div>

    <a-form :model="form" class="register-form" @submit="handleSubmit">
      <a-form-item field="userAccount" label="账号" tooltip="账号不能为空">
        <a-input
          v-model="form.userAccount"
          allow-clear
          placeholder="请输入账号"
          size="large"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item field="userPassword" label="密码" tooltip="请注意区分大小写">
        <a-input-password
          v-model="form.userPassword"
          allow-clear
          placeholder="请输入密码"
          size="large"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        field="checkPassword"
        label="确认密码"
        tooltip="请再次输入密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          allow-clear
          placeholder="请确认密码"
          size="large"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-checkbox v-model="form.isRead">我已阅读并同意用户协议</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button
          :loading="loading"
          html-type="submit"
          long
          size="large"
          type="primary"
        >
          注册
        </a-button>
      </a-form-item>
    </a-form>

    <div class="register-footer">
      <a-link @click="goLogin">返回登录</a-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
  UserControllerService,
  UserRegisterRequest,
} from "../../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { IconLock, IconUser } from "@arco-design/web-vue/es/icon";

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  isRead: false,
} as UserRegisterRequest & { checkPassword: string; isRead: boolean });

const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  if (!form.isRead) {
    message.warning("请先阅读并同意用户协议");
    return;
  }
  if (!form.userAccount || !form.userPassword || !form.checkPassword) {
    message.warning("请填写完整信息");
    return;
  }
  if (form.userPassword !== form.checkPassword) {
    message.error("两次输入的密码不一致");
    return;
  }

  loading.value = true;
  try {
    const res = await UserControllerService.userRegisterUsingPost(form);
    if (res.code === 0) {
      message.success("注册成功，请登录");
      router.push({
        path: "/user/login",
        replace: true,
      });
    } else {
      message.error("注册失败，" + res.message);
    }
  } catch (error) {
    message.error("注册请求失败");
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  router.push("/user/login");
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 36px;
}

.register-header h2 {
  font-size: 24px;
  color: var(--color-text-1);
  margin-bottom: 8px;
  font-weight: 500;
}

.register-header p {
  font-size: 14px;
  color: var(--color-text-3);
}

.register-form {
  margin-bottom: 24px;
}

.register-footer {
  display: flex;
  justify-content: center;
  font-size: 14px;
}

:deep(.arco-form-item) {
  margin-bottom: 20px;
}

:deep(.arco-input-wrapper) {
  border-radius: 6px;
}

:deep(.arco-btn-primary) {
  border-radius: 6px;
}
</style>
