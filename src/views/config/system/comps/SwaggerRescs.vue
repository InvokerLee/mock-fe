<template>
  <div v-loading="loading">
    <template v-if="!finished">
      <BaseTable
        ref="rescTable"
        :columns="columns"
        :data="tableData"
        :max-height="680"
        @selection-change="selectionChange"
      >
        >
      </BaseTable>
      <div class="footer">
        <el-button size="mini" type="info" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="confirm">添加资源</el-button>
      </div>
    </template>
    <template v-else>
      <div v-if="result.success && result.success.length">
        <el-alert
          title="添加成功的接口如下："
          type="success"
          effect="dark"
          show-icon
          :closable="false"
        >
        </el-alert>
        <ul class="box">
          <li v-for="(resc, index) in result.success" :key="index" class="color-success">
            {{ resc.rescPath }} {{ resc.rescName }} {{ resc.type }}
          </li>
        </ul>
      </div>
      <div v-if="result.fail && result.fail.length">
        <el-alert
          title="添加失败的接口如下："
          type="error"
          effect="dark"
          show-icon
          :closable="false"
        >
        </el-alert>
        <ul class="box">
          <li v-for="(resc, index) in result.fail" :key="index" class="color-danger">
            {{ resc.rescPath }} {{ resc.rescName }} {{ resc.type }}
          </li>
        </ul>
      </div>
      <div class="footer">
        <el-button size="mini" type="info" @click="cancel">关闭</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { resolveSwagger } from '@/api/config/system';
import { addManyResc } from '@/api/config/resc';

export default {
  props: {
    sysId: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          type: 'selection',
          label: '选择',
        },
        {
          prop: 'rescPath',
          minWidth: '300px',
          label: '接口地址',
          align: 'left',
        },
        {
          prop: 'type',
          width: '80px',
          label: '类型',
          align: 'left',
        },
        {
          prop: 'rescName',
          label: '接口描述',
          minWidth: '200px',
          align: 'left',
        },
      ],
      tableData: [],
      selectedItems: [],

      finished: false,
      result: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      if (!this.sysId || !this.prefix) {
        this.cancel();
        return;
      }
      this.loading = true;
      const [, res] = await resolveSwagger({ _id: this.sysId });
      this.loading = false;
      this.tableData = res.filter((v) => v.rescPath.startsWith(this.prefix)) || [];
      this.$nextTick(() => {
        this.$refs.rescTable.toggleAllSelection();
      });
    },
    selectionChange(v) {
      this.selectedItems = v;
    },
    cancel() {
      this.$emit('close');
    },
    async confirm() {
      if (!this.selectedItems.length) {
        return this.$message.warning('请选择需要添加的资源');
      }
      const payload = this.selectedItems.map((v) => ({
        rescPath: v.rescPath,
        rescName: v.rescName,
        type: v.type,
        system: v.systemId,
      }));
      this.loading = true;
      const [, res] = await addManyResc(payload);
      this.loading = false;
      if (!res) return;

      this.showResult(res);
    },
    showResult(res) {
      this.finished = true;
      this.result = res;
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  text-align: right;
  padding-top: 24px;
}
.box {
  max-height: 300px;
  overflow: auto;
  line-height: 24px;
}
</style>
