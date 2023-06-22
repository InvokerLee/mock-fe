<template>
  <div>
    <el-table
      ref="elTable"
      border
      size="mini"
      v-bind="$attrs"
      v-on="$listeners"
      v-auto-height="autoHeight && { bottomOffset: pagination ? 64 : 20 }"
      :height="autoHeight ? 100 : height"
      :data="data"
    >
      <BaseColumn
        v-for="(item, index) in columns"
        :key="index"
        :column="item"
      >
      </BaseColumn>
    </el-table>
    <template v-if="pagination && data.length">
      <el-pagination
        :style="{ 'margin-top': '16px', 'text-align': 'center' }"
        :layout="layout"
        v-bind="$attrs"
        v-on="$listeners"
        @current-change="pageChange"
      >
      </el-pagination>
    </template>
  </div>
</template>

<script>
import BaseColumn from './BaseColumn';
import adaptive from './utils/adaptive';

export default {
  name: 'BaseTable',
  components: { BaseColumn },
  directives: {
    'auto-height': adaptive,
  },
  props: {
    columns: {
      type: Array,
      default() { return []; },
    },
    data: {
      type: Array,
      default() { return []; },
    },
    height: {
      type: [String, Number],
      default: 'auto',
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper',
    },
  },
  methods: {
    // el-table文档 Methods
    clearSelection() {
      this.$refs.elTable.clearSelection();
    },
    toggleRowSelection(row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected);
    },
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection();
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded);
    },
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row);
    },
    clearSort() {
      this.$refs.elTable.clearSort();
    },
    clearFilter(columnKey) {
      this.$refs.elTable.clearFilter(columnKey);
    },
    doLayout() {
      this.$refs.elTable.doLayout();
    },
    sort(prop, order) {
      this.$refs.elTable.sort(prop, order);
    },
    pageChange(val) {
      this.$emit('pageChange', val);
    },
  },
};
</script>
