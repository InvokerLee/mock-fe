<template>
  <BaseWrapper class="resc">
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-form :inline="true" :model="searchParams">
          <el-form-item label="路径">
            <el-input v-model.trim="searchParams.rescPath"></el-input>
          </el-form-item>
          <el-form-item label="系统">
            <el-select v-model="searchParams.system" filterable>
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in systemList"
                :key="item._id"
                :label="item.host"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model.trim="searchParams.rescName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">查询</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="btns">
        <el-button type="success" @click="toAdd">新增</el-button>
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
import RescForm from './comps/RescForm';
import { getRescs, delResc, switchProxy } from '@/api/config/resc';
import { getAllSystem } from '@/api/config/system';

const initParams = (params = {}) => {
  return {
    ...{
      rescName: '',
      rescPath: '',
      system: '',
      currentPage: 1,
      pageSize: 25,
    },
    ...params,
  };
};

export default {
  name: 'Resc',
  data() {
    return {
      loading: false,
      searchParams: initParams(),

      columns: [
        {
          label: '路径',
          minWidth: '200px',
          render: (h, scope) => {
            return <el-button type='text' onClick={() => this.routeTo(scope.row)}>{scope.row.rescPath}</el-button>;
          },
        },
        {
          prop: 'type',
          label: '类型',
          width: '60px',
        },
        {
          label: '所属系统',
          minWidth: '200px',
          render: (h, scope) => {
            const { system } = scope.row;
            return system ? (
              <span title={`${system.scheme}://${system.ip}${system.port ? ':' + system.port : ''}`}>
                {system.host}
              </span>
            ) : <span>-</span>;
          },
        },
        {
          prop: 'rescName',
          label: '描述',
        },
        {
          label: '开启代理',
          width: '80px',
          render: (h, scope) => {
            return <el-switch v-model={scope.row.isProxy} active-color='#13ce66' onChange={() => this.proxyStatusChange(scope.row)}></el-switch>;
          },
        },
        {
          width: 120,
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
      systemList: [],
    };
  },
  created() {
    this.getList();
    this.getSystems();
  },
  methods: {
    async getList() {
      this.loading = true;
      const [, res] = await getRescs(this.searchParams);
      this.loading = false;
      const { dataList, totalRow } = res;
      this.tableData = dataList;
      this.total = totalRow;
    },
    async getSystems() {
      const [, res] = await getAllSystem();
      this.systemList = res || [];
    },
    async toDel(row) {
      const [err] = await delResc({
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
          title: '新增资源',
          width: '480px',
        },
        component: RescForm,
        componentProps: {
          systemList: this.systemList,
        },
        on: {
          success: this.getList,
        },
      });
    },
    toEdit(row) {
      this.$Dialog({
        props: {
          title: '修改资源',
          width: '480px',
        },
        component: RescForm,
        componentProps: {
          row,
          systemList: this.systemList,
        },
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
    routeTo(row) {
      this.$goto(`/config/mock-data/${row._id}?title=${row.rescName}`);
    },
    async proxyStatusChange(row) {
      const [err] = await switchProxy({ rescId: row._id });
      if (err) {
        row.isProxy = !row.isProxy;
        return;
      }
      this.$message.success('切换成功');
    },
  },
};
</script>

<style lang="scss" scoped>
.resc {
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
