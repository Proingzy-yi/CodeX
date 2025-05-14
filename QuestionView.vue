<template>
  <div id="questionView">
    <a-card bordered class="question-card">
      <template #title>
        <div class="header">
          <h2>Questions</h2>
        </div>
      </template>

      <a-form :layout="'inline'" :model="searchParams">
        <a-form-item field="title" label="题目名称">
          <a-input v-model="searchParams.title" placeholder="请输入题目名称" />
        </a-form-item>
        <a-form-item field="tags" label="标签">
          <a-input-tag
            v-model="searchParams.tags"
            placeholder="请输入题目标签(按下回车以确认)"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="doSubmit">搜索</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :data="dataList"
        :pagination="{
          showTotal: true,
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total,
        }"
        class="question-table"
        row-key="id"
        size="large"
        @page-change="onpagechange"
      >
        <!-- 标签列 -->
        <template #tags="{ record }">
          <a-space wrap>
            <a-tag
              v-for="(tag, index) of record.tags"
              :key="index"
              color="green"
            >
              {{ tag }}
            </a-tag>
          </a-space>
        </template>

        <!-- 通过率列 -->
        <template #acceptedRate="{ record }">
          <div style="min-width: 120px">
            <a-progress
              :percent="
                record.submitNum
                  ? Math.round((100 * record.acceptedNum) / record.submitNum) /
                    100
                  : 0
              "
              :show-text="true"
              color="#4ade80"
              size="small"
              track-color="#f1f5f9"
            />
          </div>
        </template>

        <!-- 收藏数列 -->
        <template #favourNum="{ record }">
          <a-space align="center">
            <icon-heart-fill style="color: #f43f5e" />
            <span style="font-weight: 500; color: #475569">
              {{ record.favourNum || 0 }}
            </span>
          </a-space>
        </template>

        <!-- 创建时间列 -->
        <template #createTime="{ record }">
          {{ formatTime(record.createTime) }}
        </template>

        <!-- 操作列 -->
        <template #optional="{ record }">
          <a-space>
            <a-tooltip content="开始答题">
              <a-button
                shape="round"
                size="small"
                type="primary"
                @click="toQuestionPage(record)"
              >
                做题
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { TableColumnData } from "@arco-design/web-vue";
import { IconHeartFill } from "@arco-design/web-vue/es/icon";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});
const isDeleteModalVisible = ref(false);
const deleteQuestion = ref<Question | null>(null);
const router = useRouter();

const confirmDelete = (question: Question) => {
  deleteQuestion.value = question;
  isDeleteModalVisible.value = true;
};

const onpagechange = (page: number) => {
  searchParams.value = {
    ...(searchParams.value || {}),
    current: page,
  };
};

const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code == 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败" + res.msg);
  }
};

const doSubmit = () => {
  searchParams.value = {
    ...(searchParams.value || {}),
    current: 1,
  };
};

const formatTime = (timeStr: string) => {
  return dayjs(timeStr).format("YYYY年MM月DD日 HH:mm");
};

onMounted(() => {
  loadData();
});
watchEffect(() => {
  loadData();
});

const columns = [
  { title: "题号", dataIndex: "id" },
  { title: "题目名称", dataIndex: "title" },
  { title: "标签", slotName: "tags" },
  { title: "通过率", slotName: "acceptedRate" },
  { title: "收藏", slotName: "favourNum", align: "center" },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    slotName: "optional",
    fixed: "right",
    width: 140,
  },
] as TableColumnData[];
</script>

<style scoped>
#questionView {
  padding: 24px 32px;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  min-height: calc(100vh - 48px); /* 减去上下padding */
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  display: flex;
  flex-direction: column;
}

.question-card {
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  transition: all 0.3s ease;
  flex: 1; /* 使卡片填充可用空间 */
  display: flex;
  flex-direction: column;
  min-height: 0; /* 修复flex布局问题 */
}

.question-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.search-form {
  padding: 16px 24px;
  margin-bottom: 0;
  border-bottom: 1px solid #f1f5f9;
}

.question-table {
  flex: 1; /* 表格填充剩余空间 */
  margin: 0;
  padding: 0 16px;
  overflow: auto; /* 添加滚动条以防内容过多 */
}

.question-table :deep(.arco-table-container) {
  height: 100%; /* 确保表格容器填充空间 */
}

.question-table :deep(.arco-table-content) {
  height: calc(100% - 48px); /* 减去分页器高度 */
}

.question-table :deep(.arco-table-tr) {
  transition: background 0.3s, transform 0.2s;
}

.question-table :deep(.arco-table-tr:hover) {
  background-color: #e0f2fe;
  transform: scale(1.005);
  cursor: pointer;
}

.question-table :deep(.arco-table-td) {
  transition: all 0.2s ease-in-out;
  padding: 12px 16px !important;
}

.question-table :deep(.arco-table-td:hover) {
  background-color: #f9fafb;
}

.question-table :deep(.arco-tag) {
  border-radius: 16px;
  padding: 2px 10px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.question-table :deep(.arco-tag:hover) {
  transform: scale(1.05);
  background-color: #34d399 !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(52, 211, 153, 0.3);
}

.question-table :deep(.arco-progress-line) {
  height: 12px !important;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.question-table :deep(.arco-progress-line-bg) {
  transition: width 0.5s ease-in-out;
}

.question-table :deep(.arco-progress-text) {
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
}

.question-table :deep(.arco-icon) {
  font-size: 18px;
  vertical-align: middle;
  transition: transform 0.2s;
}

.question-table :deep(.arco-icon:hover) {
  transform: scale(1.2);
}

:deep(.arco-btn) {
  transition: all 0.2s ease;
  border-radius: 24px;
  font-weight: 500;
}

:deep(.arco-btn-primary) {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  color: #fff;
}

:deep(.arco-btn-primary:hover) {
  transform: translateY(-2px) scale(1.05);
  background: linear-gradient(to right, #60a5fa, #2563eb);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}

:deep(.arco-btn:active) {
  transform: scale(0.97);
}

:deep(.arco-input),
:deep(.arco-tag-input) {
  border-radius: 8px;
  box-shadow: none;
  transition: all 0.2s ease;
  width: 240px; /* 固定输入框宽度 */
}

:deep(.arco-input:focus),
:deep(.arco-tag-input:focus-within) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

/* 分页器样式 */
:deep(.arco-table-pagination) {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #f1f5f9;
  border-radius: 0 0 16px 16px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  #questionView {
    padding: 16px;
  }

  .header {
    padding: 12px 16px;
  }

  .search-form {
    padding: 12px 16px;
  }

  :deep(.arco-input),
  :deep(.arco-tag-input) {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .header h2 {
    font-size: 20px;
  }

  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.arco-form-item) {
    margin-bottom: 12px;
    width: 100%;
  }

  :deep(.arco-input),
  :deep(.arco-tag-input) {
    width: 100%;
  }
}
</style>
