<template>
  <div id="userHomeView" class="user-container">
    <div class="user-header">
      <img alt="Vue logo" src="../assets/img.png" />
      <h2>{{ user?.userName || "未登录用户" }}</h2>
      <p>{{ user?.userProfile || "这个人很神秘，什么都没写。" }}</p>
    </div>

    <a-descriptions
      v-if="user"
      :column="1"
      bordered
      class="user-descriptions"
      title="基本信息"
    >
      <a-descriptions-item label="用户角色">
        {{ user.userRole }}
      </a-descriptions-item>
      <a-descriptions-item label="注册时间">
        {{ formatDate(user.createTime) }}
      </a-descriptions-item>
      <a-descriptions-item label="最后更新时间">
        {{ formatDate(user.updateTime) }}
      </a-descriptions-item>
    </a-descriptions>

    <div v-else class="text-center mt-20">加载中...</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { UserControllerService } from "../../../generated";
import dayjs from "dayjs"; // 引入 dayjs

// 使用 dayjs 格式化日期
const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format("YYYY年MM月DD日 HH:mm:ss");
};

const user = ref<any>(null);

const fetchUserInfo = async () => {
  try {
    const res = await UserControllerService.getLoginUserUsingGet();
    if (res.code === 0) {
      user.value = res.data;
    } else {
      console.error("获取用户信息失败", res.message);
    }
  } catch (error) {
    console.error("请求错误", error);
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
/* 背景渐变动画 */
@keyframes gradientBackground {
  0% {
    background: linear-gradient(45deg, #ff4b1f, #1fddff);
  }
  50% {
    background: linear-gradient(45deg, #00bcd4, #ff5722);
  }
  100% {
    background: linear-gradient(45deg, #ff4b1f, #1fddff);
  }
}

/* 全局背景设置 */
body {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  background: linear-gradient(45deg, #ff4b1f, #1fddff);
  animation: gradientBackground 5s ease infinite;
  height: 100vh;
}

/* 用户容器 */
.user-container {
  max-width: 600px;
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin: 40px auto;
  backdrop-filter: blur(10px);
  animation: fadeIn 1s ease;
}

/* 透明度渐变 */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 头部样式 */
.user-header {
  text-align: center;
  margin-bottom: 36px;
  opacity: 0;
  animation: slideIn 1s ease forwards;
}

.user-header h2 {
  font-size: 24px;
  color: var(--color-text-1);
  margin-top: 16px;
  font-weight: 500;
}

.user-header p {
  font-size: 14px;
  color: var(--color-text-3);
  margin-top: 8px;
}

/* 内容描述 */
.user-descriptions {
  margin-top: 24px;
}

/* 头部滑动动画 */
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-descriptions-item {
  font-size: 16px;
  color: var(--color-text-1);
  margin-bottom: 12px;
}

.user-descriptions-item label {
  font-weight: 600;
  color: var(--color-text-2);
}

/* 动态光标效果 */
.text-center {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.text-center:hover {
  transform: scale(1.05);
}

.mt-20 {
  margin-top: 20px;
}
</style>
