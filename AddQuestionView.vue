<template>
  <div class="question-form-container">
    <h2 class="form-title">创建题目</h2>
    <a-form
      :model="form"
      class="custom-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-row :gutter="24">
        <!-- 标题 -->
        <a-col :span="12">
          <a-form-item
            :rules="[{ required: true, message: '请输入标题' }]"
            field="title"
            label="标题"
          >
            <a-input
              v-model="form.title"
              allow-clear
              placeholder="请输入题目标题"
            />
          </a-form-item>
        </a-col>

        <!-- 标签 -->
        <a-col :span="12">
          <a-form-item
            :rules="[{ required: true, message: '请添加标签' }]"
            field="tags"
            label="标签"
          >
            <a-input-tag
              v-model="form.tags"
              allow-clear
              placeholder="输入标签后按回车确认"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 题目内容 -->
      <a-form-item
        :rules="[{ required: true, message: '请输入题目内容' }]"
        field="content"
        label="题目内容"
      >
        <MdEditor
          :handle-change="onContentChange"
          :value="form.content"
          height="300px"
          placeholder="请输入题目描述..."
          width="2000px"
        />
      </a-form-item>

      <!-- 答案 -->
      <a-form-item
        :rules="[{ required: true, message: '请输入参考答案' }]"
        field="answer"
        label="参考答案"
      >
        <MdEditor
          :handle-change="onAnswerChange"
          :value="form.answer"
          height="300px"
          placeholder="请输入解题思路或参考答案..."
        />
      </a-form-item>

      <!-- 配置 -->
      <div class="section-box">
        <h3 class="section-title">题目配置</h3>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item
              :rules="[{ required: true }]"
              field="judgeConfig.timeLimit"
              label="时间限制(ms)"
            >
              <a-input-number
                v-model="form.judgeConfig.timeLimit"
                :max="10000"
                :min="100"
                :step="100"
                mode="button"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :rules="[{ required: true }]"
              field="judgeConfig.memoryLimit"
              label="内存限制(KB)"
            >
              <a-input-number
                v-model="form.judgeConfig.memoryLimit"
                :max="102400"
                :min="1024"
                :step="1024"
                mode="button"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :rules="[{ required: true }]"
              field="judgeConfig.stackLimit"
              label="堆栈限制(KB)"
            >
              <a-input-number
                v-model="form.judgeConfig.stackLimit"
                :max="102400"
                :min="1024"
                :step="1024"
                mode="button"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <!-- 测试用例 -->
      <div class="section-box">
        <h3 class="section-title">测试用例配置</h3>
        <a-space direction="vertical" fill size="large">
          <div
            v-for="(caseItem, index) in form.judgeCase"
            :key="index"
            class="test-case-item"
          >
            <a-card :bordered="true" class="case-card">
              <template #title>
                测试用例 #{{ index + 1 }}
                <a-button
                  class="delete-btn"
                  size="mini"
                  status="danger"
                  type="text"
                  @click="handleDelete(index)"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                </a-button>
              </template>

              <a-form-item :field="`judgeCase[${index}].input`" label="输入">
                <a-textarea
                  v-model="caseItem.input"
                  :auto-size="{ minRows: 3 }"
                />
              </a-form-item>

              <a-form-item :field="`judgeCase[${index}].output`" label="输出">
                <a-textarea
                  v-model="caseItem.output"
                  :auto-size="{ minRows: 3 }"
                />
              </a-form-item>
            </a-card>
          </div>

          <a-button class="add-case-btn" long type="dashed" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            添加测试用例
          </a-button>
        </a-space>
      </div>

      <!-- 提交 -->
      <a-form-item>
        <a-space size="large">
          <a-button html-type="submit" size="large" type="primary"
            >提交题目
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { QuestionControllerService } from "../../../generated";
import { useRoute } from "vue-router";
import message from "@arco-design/web-vue/es/message";

const STORAGE_KEY = "question-form-cache";
let form = ref({
  title: "",
  tags: [],
  content: "",
  answer: "",
  judgeConfig: {
    memoryLimit: 1024,
    stackLimit: 1024,
    timeLimit: 1000,
  },
  judgeCase: [{ input: "", output: "" }],
});
const route = useRoute();
const updatePage = route.path.includes("update");
const loaddata = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }

  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    if (form.value.judgeCase) {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (form.value.judgeConfig) {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (form.value.tags) {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败" + res.message);
  }
};

onMounted(() => {
  loaddata();
});

const handleAdd = () => {
  form.value.judgeCase.push({ input: "", output: "" });
};

const handleDelete = (index: number) => {
  if (form.value.judgeCase.length > 1) {
    form.value.judgeCase.splice(index, 1);
  } else {
    Message.warning("至少保留一个测试用例");
  }
};

const handleSubmit = async () => {
  console.log("提交的表单：", form.value);
  //区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("题目更新成功！");
    } else {
      Message.error("更新失败" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("题目提交成功！");
    } else {
      Message.error("创建失败" + res.message);
    }
  }

  localStorage.removeItem(STORAGE_KEY); // 清除缓存
};

// 自动保存本地缓存
watch(
  form,
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
  },
  { deep: true }
);
const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

// 加载缓存
onMounted(() => {
  const cache = localStorage.getItem(STORAGE_KEY);
  if (cache) {
    Object.assign(form.value, JSON.parse(cache));
    Message.info("已恢复上次未提交的内容");
  }
});
</script>

<style scoped>
.question-form-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px 40px;
  background-color: var(--color-bg-2);
  border-radius: 8px;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: var(--color-text-1);
}

.section-box {
  margin-top: 32px;
  padding: 20px;
  background-color: var(--color-fill-2);
  border-radius: 8px;
}

.section-title {
  font-weight: 600;
  font-size: 18px;
  color: var(--color-text-2);
  margin-bottom: 16px;
}

.case-card {
  background-color: var(--color-bg-2);
  margin-bottom: 16px;
}

.markdown-preview {
  border: 1px solid var(--color-border-2);
  padding: 12px;
  border-radius: 4px;
  background-color: #fff;
  max-height: 250px;
  overflow-y: auto;
}

.delete-btn {
  float: right;
  margin-top: -4px;
}
</style>
