<template>
  <div
    class="no-result"
    :style="{ color, height: `${height}px`, 'font-size': `${fontSize}px` }"
  >
    No Results Found
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#999',
    },
    height: {
      type: Number,
      default: 200,
    },
    fontSize: {
      type: Number,
      default: 48,
    },
  },
};
</script>

<style lang="scss" scoped>
.no-result {
  font-weight: Bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
