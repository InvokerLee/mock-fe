<template>
  <BaseWrapper class="system">
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-form :inline="true" :model="searchParams">
          <el-form-item label="系统名称">
            <el-input v-model.trim="searchParams.systemName"></el-input>
          </el-form-item>
          <el-form-item label="host">
            <el-input v-model.trim="searchParams.host"></el-input>
          </el-form-item>
          <!-- IP，端口 -->

          <el-form-item>
            <el-button type="primary" @click="search()">查询</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="btns">
        <el-button type="success" @click="toAdd">新增</el-button>
        <!-- <el-button type="danger">删除</el-button> -->
      </el-col>
    </el-row>
    <BaseTable
      autoHeight
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      pagination
      :current-page.sync="searchParams.currentPage"
      :page-size="searchParams.pageSize"
      :total="total"
      @pageChange="pageChange"
    >
    </BaseTable>
  </BaseWrapper>
</template>

<script>
import SysForm from './comps/SysForm';
import SwaggerRescs from './comps/SwaggerRescs';
import { getSystems, delSystem } from '@/api/config/system';
import { tryConnect } from '@/api';

const initParams = (params = {}) => {
  return {
    ...{
      systemName: '',
      host: '',
      currentPage: 1,
      pageSize: 25,
    },
    ...params,
  };
};

export default {
  name: 'System',
  data() {
    return {
      loading: false,
      searchParams: initParams(),

      columns: [
        {
          prop: 'systemName',
          minWidth: '120px',
          label: '系统名称',
        },
        {
          prop: 'host',
          minWidth: '180px',
          label: 'Host',
        },
        {
          label: '转发地址',
          minWidth: '240px',
          render: (h, scope) => {
            return (
              <div>
                {scope.row.scheme}://
                <span class='color-success'>{scope.row.ip}</span>
                {scope.row.port ? ':' + scope.row.port : ''}
              </div>
            );
          },
        },
        {
          width: 150,
          label: 'Swagger',
          render: (h, scope) => {
            return (
              <el-button type='primary' onClick={() => this.loadSwagger(scope.row)}>加载Swagger</el-button>
            );
          },
        },
        {
          width: 100,
          label: '连接状态',
          render: (h, scope) => {
            return (
              <el-button type='text' onClick={() => this.checkStatus(scope.row)}>点击测试</el-button>
            );
          },
        },
        {
          width: 150,
          label: '操作',
          render: (h, scope) => {
            return (
              <div>
                <i class='el-icon-edit btn-icon color-warning' onClick={() => this.toEdit(scope.row)}></i>
                <i class='el-icon-delete btn-icon color-danger' onClick={() => this.beforeDel(scope.row)}></i>

              </div>
            );
          },
        },
      ],
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      const [, res] = await getSystems(this.searchParams);
      this.loading = false;
      const { dataList, totalRow } = res;
      this.tableData = dataList;
      this.total = totalRow;
    },
    async toDel(row) {
      const [err] = await delSystem({
        ids: [row._id],
      });
      if (err) return;
      this.$message.success('删除成功');
      this.getList();
    },
    search() {
      this.searchParams.currentPage = 1;
      this.getList();
    },
    pageChange() {
      this.getList();
    },
    reset() {
      this.searchParams = initParams();
      this.search();
    },
    toAdd() {
      this.$Dialog({
        props: {
          title: '新增系统',
          width: '480px',
        },
        component: SysForm,
        on: {
          success: this.getList,
        },
      });
    },
    toEdit(row) {
      this.$Dialog({
        props: {
          title: '编辑系统',
          width: '480px',
        },
        component: SysForm,
        componentProps: { row },
        on: {
          success: this.getList,
        },
      });
    },
    beforeDel(row) {
      this.$confirm('确认要删除吗？', {
        confirmButtonText: '确认',
        type: 'warning',
      })
        .then(() => this.toDel(row))
        .catch(() => null);
    },
    async checkStatus(row) {
      const [, res] = await tryConnect({ host: row.ip, port: row.port });
      if (!res) return;
      if (res.includes('success')) {
        this.$message.success(res);
      } else {
        this.$message.error(res);
      }
    },
    loadSwagger(row) {
      this.$prompt('例：/wmsc', '请输入资源前缀', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\/[a-zA-Z]+$/,
        inputErrorMessage: '格式不正确',
      }).then(({ value }) => {
        this.$Dialog({
          props: {
            title: '加载Swagger接口',
            width: '720px',
            'close-on-press-escape': false,
          },
          component: SwaggerRescs,
          componentProps: { sysId: row._id, prefix: value },
        });
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.system {
  .btns {
    width: auto;
    flex-shrink: 0;
  }
}
</style>
