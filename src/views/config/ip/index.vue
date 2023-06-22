<template>
  <BaseWrapper class="ip">
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-form :inline="true" :model="searchParams">
          <el-form-item label="姓名">
            <el-input v-model.trim="searchParams.username"></el-input>
          </el-form-item>

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
import IpForm from './comps/IpForm';
import { getUserIps, delUserIp } from '@/api/config/ip';
import { tryConnect } from '@/api';

const initParams = (params = {}) => {
  return {
    ...{
      username: '',
      currentPage: 1,
      pageSize: 25,
    },
    ...params,
  };
};

export default {
  name: 'Ip',
  data() {
    return {
      loading: false,
      searchParams: initParams(),

      columns: [
        {
          prop: 'username',
          label: '姓名',
        },
        {
          prop: 'userIp',
          label: 'IP',
        },
        {
          width: 180,
          label: '连接测试',
          render: (h, scope) => {
            return (
              <div>
                <el-input class='inline-input mr-2' v-model={scope.row.port} placeholder='端口'></el-input>
                <el-button type='text' onClick={() => this.checkStatus(scope.row)}>点击测试</el-button>
              </div>
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
      const [, res] = await getUserIps(this.searchParams);
      this.loading = false;
      const { dataList, totalRow } = res;
      this.tableData = dataList.map((v) => ({
        ...v,
        port: '',
      }));
      this.total = totalRow;
    },
    async toDel(row) {
      const [err] = await delUserIp({
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
          title: '新增人员IP',
          width: '480px',
        },
        component: IpForm,
        on: {
          success: this.getList,
        },
      });
    },
    toEdit(row) {
      this.$Dialog({
        props: {
          title: '修改人员IP',
          width: '480px',
        },
        component: IpForm,
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
      const [, res] = await tryConnect({ host: row.userIp, port: row.port });
      if (!res) return;
      if (res.includes('success')) {
        this.$message.success(res);
      } else {
        this.$message.error(res);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ip {
  .btns {
    width: auto;
    flex-shrink: 0;
  }
  ::v-deep .inline-input {
    width: 68px;
    display: inline-block;
  }
}
</style>
