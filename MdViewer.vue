<template>
  <div class="md-editor-wrapper">
    <!-- 编辑器 -->
    <Viewer :plugins="plugins" :value="value" readonly />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from "vue";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/vue-next";

import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";

// 插件初始化
const plugins = [gfm(), highlight()];

// Props
interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
});
</script>

<style scoped>
.md-editor-wrapper {
  width: 100%;
  min-height: 300px;
  height: 100%;
}

.md-editor-wrapper .bytemd {
  height: 100%;
  min-height: 300px;
}
</style>
