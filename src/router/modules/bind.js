/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const memberRouter = {
  path: '/bind',
  component: Layout,
  redirect: '/bind/index',
  meta: { roles: ['NORMAL', 'AGENT', 'ADMIN'] },
  children: [{
    path: 'index',
    component: () => import('@/views/table/rabbit/bind'),
    name: 'bindlist',
    meta: {
      title: 'bindlist',
      icon: 'lock', // 图标
      role: ['AGENT', 'ADMIN', 'NORMAL'], // 或者你可以给每一个子路由设置自己的权限
      noCache: true // 不会被 <keep-alive> 缓存
    }
  }]
}
export default memberRouter
