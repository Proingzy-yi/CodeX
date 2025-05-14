<template>
  <div id="exampleView">
    <MdEditor :handle-change="onMdChange" :value="codevalue" />
    <CodeEditor :handle-change="onCodeChange" :value="mdvalue" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdEditor from "@/components/MdEditor.vue";

const mdvalue = ref();
const codevalue = ref();
const onMdChange = (v: string) => {
  mdvalue.value = v;
  console.log(v);
};

const onCodeChange = (v: string) => {
  codevalue.value = v;
  console.log(v);
};
</script>
