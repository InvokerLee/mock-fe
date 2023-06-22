<template>
  <el-table-column
    :type="column.type"
    :index="column.index"
    :label="column.label"
    :prop="column.prop"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable || false"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :show-overflow-tooltip="column.showOverflowTooltip || false"
    :align="column.align || 'center'"
    :header-align="column.headerAlign || column.align || 'center'"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
  >
    <template
      slot="header"
      slot-scope="scope"
    >
      <BaseRender
        v-if="column.renderHeader"
        :scope="scope"
        :render="column.renderHeader"
      >
      </BaseRender>
      <span v-else>{{ scope.column.label }}</span>
    </template>

    <template slot-scope="scope">
      <BaseRender
        v-if="column.render"
        :scope="scope"
        :render="column.render"
      >
      </BaseRender>
      <span v-else>{{ scope.row[column.prop] }}</span>
    </template>
  </el-table-column>
</template>

<script>
import BaseRender from './utils/render';

/**
 * element-ui源码 路径node_modules\element-ui\packages\table\src\table-column.js
 */
const forced = {
  selection: {
    renderHeader: (h, { store }) => {
      return (
        <el-checkbox
          disabled={store.states.data && store.states.data.length === 0}
          indeterminate={
            store.states.selection.length > 0 && !store.states.isAllSelected
          }
          nativeOn-click={store.toggleAllSelection}
          value={store.states.isAllSelected}
        />
      );
    },
    render: (h, { row, column, store, $index }) => {
      return (
        <el-checkbox
          nativeOn-click={event => event.stopPropagation()}
          value={store.isSelected(row)}
          disabled={
            column.selectable
              ? !column.selectable.call(null, row, $index)
              : false
          }
          on-input={() => {
            store.commit('rowSelectedChanged', row);
          }}
        />
      );
    },
    sortable: false,
    resizable: false,
  },
  index: {
    renderHeader(h, { column }) {
      return <span>{column.label || '#'}</span>;
    },
    render(h, { $index, column }) {
      let i = $index + 1;
      const { index } = column;

      if (typeof index === 'number') {
        i = $index + index;
      } else if (typeof index === 'function') {
        i = index($index);
      }

      return <div>{ i }</div>;
    },
    sortable: false,
  },
  expand: {
    renderHeader(h, { column }) {
      return <span>{column.label || ''}</span>;
    },
    render(h, { row, store }, proxy) {
      const expanded = store.states.expandRows.indexOf(row) > -1;
      return <div class={ `el-table__expand-icon ${expanded ? 'el-table__expand-icon--expanded' : ''}` }
        on-click={ e => proxy.handleExpandClick(row, e) }>
        <i class='el-icon el-icon-arrow-right'></i>
      </div>;
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column',
  },
};

export default {
  name: 'BaseColumn',
  components: { BaseRender },
  props: {
    column: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    column: {
      handler() {
        this.setSpecialColumn();
      },
      immediate: true,
    },
  },
  methods: {
    setSpecialColumn() {
      const source = forced[this.column.type];
      if (!source) return;
      Object.keys(source).forEach((key) => {
        const value = source[key];
        if (value !== undefined) {
          this.column[key] = key === 'className' ? `${this.column[key]} ${value}` : value;
        }
      });
    },
  },
};
</script>
