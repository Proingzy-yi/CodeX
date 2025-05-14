<template>
  <div id="userLayout">
    <a-layout class="layout">
      <!-- 顶部导航栏 -->
      <a-layout-header class="header">
        <img class="logo" src="../assets/oj-logo.png" />
        <span class="title">Online Judge</span>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <!-- 页脚 -->
      <a-layout-footer class="footer">
        <p>© 2025 Online Judge. All Rights Reserved.</p>
        <a href="https://codeforces.com" target="_blank">Visit Codeforces</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
/* 页面整体布局 */
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to right, #4facfe, #00f2fe);
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Logo 样式 */
.logo {
  width: 80px;
  height: auto;
  margin-right: 10px;
}

/* 标题样式 */
.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* 主体内容 */
.content {
  flex: 1;
  padding: 30px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

/* 底部栏 */
.footer {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  text-align: center;
  padding: 15px;
  font-size: 14px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.footer a:hover {
  color: #0056b3;
}
</style>

<script lang="ts" setup></script>
