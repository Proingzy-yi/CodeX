<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script lang="ts" setup>
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
/**
 *全局初始化函数，全局单次调用的代码都可以写到这里
 */
const doInit = () => {
  console.log("Welcome to my onlinejudge");
};

onMounted(() => {
  doInit();
});
</script>
