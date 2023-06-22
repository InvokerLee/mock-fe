import * as constants from '@/utils/constants';

const getters = {
  sidebar: state => state.app.sidebar,
  realname: state => state.user.userInfo.realname,
  menuList: state => state.user.userInfo.menuList,
  cachedViews: state => state.tagsView.cachedViews,
  routes: state => state.permission.routes,
  getConstMap: () => (keyName) => {
    const g = constants[keyName];
    const map = new Map();
    if (Array.isArray(g) && g.length) {
      g.forEach(item => map.set(item.code, item.name));
    }
    return map;
  },
};
export default getters;
