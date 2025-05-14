<template>
  <div id="viewquestionView">
    <a-row :gutter="[24, 24]">
      <!-- 左侧题目信息 -->
      <a-col :md="12" :xs="24">
        <a-tabs centered default-active-key="question" type="line">
          <a-tab-pane key="question" title="题目">
            <a-card
              v-if="question"
              :bordered="false"
              :title="question.title"
              class="question-card"
            >
              <template #extra>
                <a-space>
                  <a-button size="small" type="text" @click="goBack"
                    >返回
                  </a-button>
                  <a-button
                    :status="liked ? 'success' : undefined"
                    size="small"
                    type="outline"
                    @click="toggleLike"
                  >
                    {{ liked ? "已收藏" : "收藏题目" }}
                  </a-button>
                </a-space>
              </template>
              <a-descriptions
                :column="{ xs: 1, md: 2 }"
                style="margin-bottom: 16px"
                title="判题要求"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig?.timeLimit ?? 0 }} ms
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig?.memoryLimit ?? 0 }} KB
                </a-descriptions-item>
              </a-descriptions>

              <div class="markdown-wrapper">
                <MdViewer :value="question.content || ''" />
              </div>

              <a-space style="margin-top: 16px" wrap>
                <a-tag
                  v-for="(tag, index) of question.tags"
                  :key="index"
                  color="green"
                >
                  {{ tag }}
                </a-tag>
              </a-space>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="comment" title="评论"> 评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案">
            <MdViewer :value="question?.answer || ''" />
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- 右侧编程区域 -->
      <a-col :md="12" :xs="24">
        <a-card :bordered="false" class="editor-card">
          <a-form :model="form" layout="inline" style="margin-bottom: 12px">
            <a-form-item field="title" label="编程语言">
              <a-select
                v-model="form.language"
                :style="{ width: '120px' }"
                placeholder="选择语言"
              >
                <a-option>java</a-option>
                <a-option>cpp</a-option>
                <a-option>go</a-option>
                <a-option>python</a-option>
                <a-option>html</a-option>
              </a-select>
            </a-form-item>
          </a-form>

          <CodeEditor
            :handle-change="changecode"
            :language="form.language"
            :value="form.code"
          />

          <a-divider />

          <a-button
            :loading="loading"
            class="submit-button"
            size="large"
            type="primary"
            @click="doSubmit"
          >
            提交代码
          </a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const liked = ref(false); // 假设你将来从接口拿收藏状态
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});
const loading = ref(false);
const router = useRouter();

// 加载题目信息
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
    const savedCode = localStorage.getItem("code_" + props.id);
    if (savedCode) {
      form.value.code = savedCode;
    }
  } else {
    message.error("加载失败：" + res.message);
  }
};

// 提交代码
const doSubmit = async () => {
  if (!question.value?.id) return;
  loading.value = true;
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  loading.value = false;
  if (res.code === 0) {
    message.success("提交成功!");
    router.push("/question_submit");
  } else {
    message.error("提交失败：" + res.message);
  }
};

// 实时保存代码
const changecode = (value: string) => {
  form.value.code = value;
  localStorage.setItem("code_" + props.id, value);
};

// 返回上页
const goBack = () => {
  router.back();
};

// 模拟收藏行为（你可以接后端接口）
const toggleLike = () => {
  liked.value = !liked.value;
  message.info(liked.value ? "已收藏该题目" : "取消收藏");
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#viewquestionView {
  padding: 32px 24px;
  background: linear-gradient(to bottom right, #f0f4f8, #d9e2ec);
  min-height: 100vh;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.question-card {
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 20px;
  background: white;
  transition: all 0.3s ease;
}

.editor-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

a-button.submit-button {
  width: 100%;
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
}

a-tabs {
  --arco-tabs-header-padding: 12px 16px;
}

a-tag {
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 13px;
}

.markdown-wrapper {
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fafafa;
  margin-top: 12px;
  transition: all 0.2s;
}
</style>
