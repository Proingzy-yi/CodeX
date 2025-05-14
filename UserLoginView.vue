<template>
  <div id="userLoginView" class="login-container">
    <div class="login-header">
      <h2>欢迎登录</h2>
      <p>请输入您的账号和密码</p>
    </div>

    <a-form :model="form" class="login-form" @submit="handleSubmit">
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
          登录
        </a-button>
      </a-form-item>
    </a-form>

    <div class="login-footer">
      <a-link @click="goToAgreement">用户协议</a-link>
      <a-link @click="goRegister">注册账号</a-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IconLock, IconUser } from "@arco-design/web-vue/es/icon";

const form = reactive({
  userAccount: "",
  userPassword: "",
  isRead: false,
} as UserLoginRequest);

const loading = ref(false);
const router = useRouter();
const store = useStore();

const handleSubmit = async () => {
  if (!form.isRead) {
    message.warning("请先阅读并同意用户协议");
    return;
  }

  loading.value = true;
  try {
    const res = await UserControllerService.userLoginUsingPost(form);
    if (res.code === 0) {
      await store.dispatch("user/getLoginUser");
      message.success("登录成功");
      router.push({
        path: "/",
        replace: true,
      });
    } else {
      message.error("登录失败，" + res.message);
    }
  } catch (error) {
    message.error("登录请求失败");
  } finally {
    loading.value = false;
  }
};
const goRegister = () => {
  router.push("/user/register");
};
const goToAgreement = () => {
  router.push("/user/agreement");
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.9); /* 半透明背景 */
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* 增强阴影 */
  backdrop-filter: blur(10px); /* 模糊背景，让文字更清晰 */
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-header h2 {
  font-size: 24px;
  color: var(--color-text-1);
  margin-bottom: 8px;
  font-weight: 500;
}

.login-header p {
  font-size: 14px;
  color: var(--color-text-3);
}

.login-form {
  margin-bottom: 24px;
}

.login-footer {
  display: flex;
  justify-content: space-between;
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
