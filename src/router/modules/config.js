import Layout from '@/layout';

const auth = {
  path: '/config',
  name: 'Config',
  component: Layout,
  meta: { title: '配置', icon: 'el-icon-setting' },
  redirect: '/config/resc',
  children: [
    {
      path: 'resc',
      name: 'Resc',
      component: () => import('@/views/config/resc'),
      meta: { title: '资源列表' },
    },
    {
      path: 'mock-data/:rescId',
      name: 'MockData',
      component: () => import('@/views/config/mock-data'),
      meta: { title: 'Mock数据' },
      hidden: true,
    },
    {
      path: 'ip',
      name: 'Ip',
      component: () => import('@/views/config/ip'),
      meta: { title: '人员IP' },
    },
    {
      path: 'system',
      name: 'System',
      component: () => import('@/views/config/system'),
      meta: { title: '系统管理' },
    },
  ],
};

export default auth;
