<template>
  <div id="manageQuestionView">
    <a-card bordered class="question-card">
      <template #title>
        <div class="header">
          <h2>题目管理</h2>
        </div>
      </template>

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
        <template #optional="{ record }">
          <a-space>
            <a-button size="small" type="primary" @click="doUpdate(record)"
              >修改
            </a-button>
            <a-button
              size="small"
              status="danger"
              @click="confirmDelete(record)"
              >删除
            </a-button>
          </a-space>
        </template>

        <template #judgeConfig="{ record }">
          <div v-if="record.judgeConfig">
            <div>时间限制: {{ record.judgeConfig.timeLimit }} ms</div>
            <div>
              内存限制:
              {{ (record.judgeConfig.memoryLimit / 1024).toFixed(1) }} MB
            </div>
            <div>
              堆栈限制:
              {{ (record.judgeConfig.stackLimit / 1024).toFixed(1) }} MB
            </div>
          </div>
        </template>

        <template #createTime="{ record }">
          {{ formatTime(record.createTime) }}
        </template>
      </a-table>
    </a-card>

    <!-- 删除确认对话框 -->
    <a-modal
      v-model:visible="isDeleteModalVisible"
      title="确认删除"
      @cancel="cancelDelete"
      @ok="doDelete"
    >
      <p>您确定要删除该题目吗？</p>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { TableColumnData } from "@arco-design/web-vue";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});
const isDeleteModalVisible = ref(false); // 控制删除确认框的显示与否
const deleteQuestion = ref<Question | null>(null); // 保存待删除的题目

const router = useRouter();

const confirmDelete = (question: Question) => {
  deleteQuestion.value = question; // 保存待删除的题目
  isDeleteModalVisible.value = true; // 显示删除确认框
};

const cancelDelete = () => {
  isDeleteModalVisible.value = false; // 取消删除，关闭确认框
};

const doDelete = async () => {
  if (deleteQuestion.value) {
    const res = await QuestionControllerService.deleteQuestionUsingPost({
      id: deleteQuestion.value.id,
    });
    if (res.code === 0) {
      message.success("删除成功");
      loadData();
    } else {
      message.error("删除失败" + res.msg);
    }
    isDeleteModalVisible.value = false; // 删除操作完成后关闭对话框
  }
};

const onpagechange = (page: number) => {
  searchParams.value = {
    ...(searchParams.value || {}),
    current: page,
  };
};
const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
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
  { title: "ID", dataIndex: "id" },
  { title: "标题", dataIndex: "title" },
  { title: "内容", dataIndex: "content" },
  { title: "标签", dataIndex: "tags" },
  { title: "答案", dataIndex: "answer" },
  { title: "提交数", dataIndex: "submitNum" },
  { title: "通过数", dataIndex: "acceptedNum" },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    slotName: "judgeConfig",
  },
  { title: "用户ID", dataIndex: "userId" },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
    fixed: "right",
    width: 140,
  },
] as TableColumnData[];
</script>

<style scoped>
#manageQuestionView {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.question-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.question-table :deep(.arco-table-tr) {
  transition: background 0.3s;
}

.question-table :deep(.arco-table-tr:hover) {
  background-color: #f0f9ff;
}
</style>
