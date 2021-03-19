/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const memberRouter = {
  path: '/childlist',
  component: Layout,
  redirect: '/childlist/index',
  meta: { roles: ['ADMIN', 'AGENT','NORMAL'] },
  children: [{
    path: 'index',
    component: () => import('@/views/table/rabbit/childlist'),
    name: 'childlist',
    meta: {
      title: 'childlist',
      icon: 'lock', // 图标
      noCache: true // 不会被 <keep-alive> 缓存
    }
  }]
}
export default memberRouter
