<template>
  <div id="basicLayout">
    <a-layout class="layout" style="min-height: 100vh">
      <!-- 顶部导航栏 -->
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <!-- 页脚 -->
      <a-layout-footer class="footer">
        <a href="https://codeforces.com" target="_blank"> Codeforces </a>
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
}

/* 主体内容 */
.content {
  padding: 20px;
  background: #f5f5f5; /* 浅灰色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 底部栏 */
.footer {
  background: white;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  position: sticky;
}

.footer a {
  color: darkgrey;
  text-decoration: none;
}

.footer a:hover {
  color: lightgrey;
}
</style>

<script lang="ts" setup>
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
