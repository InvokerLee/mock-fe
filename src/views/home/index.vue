<template>
  <BaseWrapper class="home">
    <h3>Chrome缓存清理</h3>
    <div class="color-info">修改完host文件若没有立即生效可使用，我一般清理完Socket缓存就生效了</div>
    <ul>
      <li>清除Socket缓存：chrome://net-internals/#sockets (复制到浏览器)</li>
      <li>清除DNS缓存：chrome://net-internals/#dns</li>
    </ul>
  </BaseWrapper>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
