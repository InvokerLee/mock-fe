<template>
  <BaseWrapper v-loading="loading" class="mock-data">
    <el-row slot="head">
      <el-button type="info" icon="el-icon-back" @click="goBack()">返回</el-button>
      <el-button type="success" @click="toAdd">新增</el-button>
    </el-row>
    <section class="pt-4">
      <el-row type="flex" :gutter="24" v-if="list.length">
        <el-col class="left">
          <div
            v-for="j in list"
            :key="j._id"
            :class="{'json-item': true, 'json-item-actived': j._id === activedItem._id}"
            @click="changeJson(j)"
          >
            <span class="remark">备注: {{ j.remark || '-' }}</span>
            <el-tag class="icon" type="success" effect="dark" v-if="j.isPriority">优先</el-tag>
          </div>
        </el-col>
        <el-col class="right" v-if="activedItem._id">
          <div class="bar">
            <span class="title">{{ activedItem.remark }}</span>
            <div>
              <el-button v-if="!activedItem.isPriority" type="text" @click="setFirst">设置为优先数据</el-button>
              <el-button type="text" @click="toEdit">编辑</el-button>
              <el-button type="text" disabled>复制</el-button>
              <el-button type="text" disabled>下载</el-button>
              <el-button type="text" class="color-danger" @click="toDel">删除</el-button>
            </div>
          </div>
          <JsonView :jsonData="activedItem.jsonData"></JsonView>
        </el-col>
      </el-row>
      <NoResult v-else></NoResult>
    </section>
  </BaseWrapper>
</template>

<script>
import JsonView from '@/components/JsonView';
import MockForm from './comps/MockForm';
import { getMockDatas, delMockData, setPriority } from '@/api/config/resc';

export default {
  components: { JsonView },
  data() {
    return {
      loading: false,

      list: [],
      activedItem: {},
    };
  },
  computed: {
    rescId() {
      return this.$route.params.rescId;
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    goBack() {
      this.$goto(-1);
    },
    async getDetail() {
      this.loading = true;
      const [, res] = await getMockDatas({ rescId: this.rescId });
      this.loading = false;
      if (!res) return;
      const item = res.find((v) => v.isPriority);
      this.changeJson(item || (res.length && res[0])); // 如果没有设置优先级，取第一个
      this.list = res;
    },
    toAdd() {
      this.$Dialog({
        props: {
          title: '新增',
          width: '960px',
        },
        component: MockForm,
        componentProps: {
          rescId: this.rescId,
        },
        on: {
          success: this.getDetail,
        },
      });
    },
    toEdit() {
      this.$Dialog({
        props: {
          title: '编辑',
          width: '960px',
        },
        component: MockForm,
        componentProps: {
          rescId: this.rescId,
          row: this.activedItem,
        },
        on: {
          success: this.getDetail,
        },
      });
    },
    changeJson(item) {
      this.activedItem = item;
    },
    async toDel() {
      const [err] = await delMockData({ _id: this.activedItem._id });
      if (err) return;
      this.$message.success('刪除成功');
      this.getDetail();
    },
    async setFirst() {
      const [err] = await setPriority({ _id: this.activedItem._id, isPriority: true });
      if (err) return;
      this.$message.success('设置成功');
      this.getDetail();
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid #ccc;
  .json-item {
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 12px;
    .remark {
      flex: 1;
      max-width: 230px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow: ellipsis;
    }
    .ico {
      width: initial;
      flex: 0;
    }
    &:hover {
      color: #6eb6fd;
    }
    &-actived {
      color: #409EFF;
    }
  }
}
.right {
  .title {
    font-size: 14px;
    color: #666;
    font-weight: bold;
  }
  .bar {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
