// 接口返回字段名称
const AUTH_KEY = 'funcKey';
const AUTH_NAME = 'funcName';

const cacheMap = new Map(); // 权限缓存

export default {
  install(Vue) {
    Vue.prototype.$own = function _own(value) {
      if (!value || typeof value !== 'string') {
        return false;
      }

      // 1.从缓存中查找
      if (cacheMap.has(value)) {
        return cacheMap.get(value);
      }

      // 2.从用户权限中查找
      const funcVOList = this.$store.getters && this.$store.getters.menuList;
      const funcVO = funcVOList.find(v => v[AUTH_KEY] === value);

      const result = funcVO ? funcVO[AUTH_NAME] : false;
      cacheMap.set(value, result);

      return result;
    };
  },
};
