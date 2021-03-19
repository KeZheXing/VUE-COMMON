/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const memberRouter = {
  path: '/permission',
  component: Layout,
  redirect: '/permission/index',
  meta: { roles: ['ADMIN', 'AGENT'] },
  children: [{
    path: 'index',
    component: () => import('@/views/table/rabbit/rabbitExchange4'),
    name: 'memberlist',
    meta: {
      title: 'memberlist',
      icon: 'lock', // 图标
      role: ['AGENT', 'ADMIN'], // 或者你可以给每一个子路由设置自己的权限
      noCache: true // 不会被 <keep-alive> 缓存
    }
  }]
}
export default memberRouter
