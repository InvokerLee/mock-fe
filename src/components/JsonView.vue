<template>
  <JsonViewer
    :value="formatData"
    theme="dark-json-theme"
    :expand-depth="2"
    boxed
  >
  </JsonViewer>
</template>

<script>
import JsonViewer from 'vue-json-viewer';

export default {
  components: { JsonViewer },
  props: {
    jsonData: {
      type: String,
      default: '',
    },
  },
  computed: {
    formatData() {
      try {
        return JSON.parse(this.jsonData);
      } catch (error) {
        return this.jsonData;
      }
      // return JSON.parse(this.jsonData);
    },
  },
};
</script>

<style lang="scss">
.dark-json-theme {
    background: #384548;
    white-space: nowrap;
    color: #d1d2d2;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button { color: #49b3ff }
  .jv-key { color: #d19a66 }
  .jv-item {
    &.jv-array { color: #eee }
    &.jv-boolean { color: #f5397e }
    &.jv-function { color: #067bca }
    &.jv-number { color: #f5397e }
    &.jv-number-float { color: #f5397e }
    &.jv-number-integer { color: #f5397e }
    &.jv-object { color: #eee }
    &.jv-undefined { color: #999 }
    &.jv-string {
      color: #98c379;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
