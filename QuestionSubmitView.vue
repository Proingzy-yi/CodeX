<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" class="search-form" layout="inline">
      <a-form-item field="questionId" label="题号">
        <a-input v-model="searchParams.questionId" placeholder="请输入题号" />
      </a-form-item>
      <a-form-item field="language" label="语言">
        <a-select v-model="searchParams.language" placeholder="选择语言">
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">🔍 搜索</a-button>
      </a-form-item>
    </a-form>

    <a-divider size="0" />

    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <!-- 判题状态 彩色 -->
      <template #judgeInfo="{ record }">
        <a-tag :color="getJudgeColor(record.judgeInfo?.message)">
          {{ record.judgeInfo?.message || "正在判题....." }}
        </a-tag>
      </template>

      <!-- 编程语言 彩色 -->
      <template #language="{ record }">
        <a-tag :color="getLangColor(record.language)">
          {{ record.language }}
        </a-tag>
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/** 监听 searchParams 改变 */
watchEffect(() => {
  loadData();
});

/** 页面挂载时加载 */
onMounted(() => {
  loadData();
});

/** 表格列定义 */
const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "语言",
    slotName: "language",
  },
  {
    title: "判题状态",
    slotName: "judgeInfo",
  },
  {
    title: "题目ID",
    dataIndex: "questionId",
  },
  {
    title: "提交者ID",
    dataIndex: "userId",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

/** 分页切换 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/** 跳转题目页面 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/** 点击搜索 */
const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

/** 判题状态 => 颜色 */
const getJudgeColor = (status: string) => {
  if (!status) return "gray";
  const lower = status.toLowerCase();
  if (lower.includes("ac")) return "green";
  if (lower.includes("wr")) return "red";
  if (lower.includes("tle")) return "purple";
  if (lower.includes("runtime") || lower.includes("re")) return "gold";
  return "blue";
};

/** 编程语言 => 颜色 */
const getLangColor = (lang: string) => {
  if (!lang) return "gray";
  const lower = lang.toLowerCase();
  if (lower === "java") return "purple";
  if (lower === "cpp") return "green";
  if (lower === "python") return "cyan";
  if (lower === "html") return "volcano";
  return "gray";
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 紧凑现代感 */
.search-form {
  margin-bottom: 16px;
}

.search-form .arco-form-item {
  margin-right: 16px;
}
</style>
