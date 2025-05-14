<template>
  <div class="md-editor-wrapper">
    <!-- 编辑器 -->
    <Editor :plugins="plugins" :value="markdown" @change="onChange" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch, withDefaults } from "vue";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";

import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";

// 插件初始化
const plugins = [gfm(), highlight()];

// Props
interface Props {
  value: string;
  handleChange?: (value: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
});

// emits
const emit = defineEmits(["change"]);

// 内部响应式变量用于编辑器和预览
const markdown = ref(props.value);

// 监听 props.value 变化（用于父组件控制内容时更新）
watch(
  () => props.value,
  (newVal) => {
    markdown.value = newVal;
  }
);

// 编辑器变化时触发
const onChange = (v: string) => {
  console.log(v);
  markdown.value = v;
  emit("change", v);
  props.handleChange?.(v); // 触发可选的回调函数
};
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
