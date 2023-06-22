import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';

/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{bottomOffset: 30}">...</el-table>
 * el-table height is must be set
 * bottomOffset: 30(default)   // The height of the table from the bottom of the page.
 */

const doResize = (el, binding, vnode) => {
  const { componentInstance: $table } = vnode;

  const { value } = binding;

  if (!$table) return;
  if (!$table.height) {
    throw new Error('el-$table must set the height. Such as height=\'100px\'');
  }
  const bottomOffset = (value && value.bottomOffset) || 30;

  const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset;

  setTimeout(() => {
    $table.layout.setHeight(Math.max(height, 150));
    $table.doLayout();
  }, 0);
};

export default {
  bind(el, binding, vnode) {
    el.resizeListener = () => {
      doResize(el, binding, vnode);
    };
    // parameter 1 is must be "Element" type
    addResizeListener(window.document.body, el.resizeListener);
  },
  inserted(el, binding, vnode) {
    setTimeout(() => {
      doResize(el, binding, vnode);
    }, 0);
  },
  unbind(el) {
    removeResizeListener(window.document.body, el.resizeListener);
  },
};
