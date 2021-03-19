/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const tableRouter = {
  path: '/table/rabbit',
  component: Layout,
  redirect: '/rabbitExchange',
  name: 'exchangeTable',
  meta: {
    title: 'exchangeTable',
    icon: 'table'
  },
  children: [
    {
      path: 'osstable',
      component: () => import('@/views/table/common/osstable'),
      name: '存储管理',
      meta: { title: '存储管理' }
    },
    {
      path: 'usertable',
      component: () => import('@/views/table/common/usertable'),
      name: '用户管理',
      meta: { title: '用户管理',roles: ['admin'] }
    }
    // {
    //   path: 'rabbitExchange2',
    //   component: () => import('@/views/table/rabbit/rabbitExchange2'),
    //   name: 'rabbitExchange',
    //   meta: { title: 'rabbitExchange' }
    // }
    // {
    //   path: 'rabbitQueue',
    //   component: () => import('@/views/table/rabbit/rabbitQueue'),
    //   name: 'rabbitQueue',
    //   meta: { title: 'rabbitQueue' }
    // },
    // {
    //   path: 'rabbitChannel',
    //   component: () => import('@/views/table/rabbit/rabbitChannel'),
    //   name: 'rabbitChannel',
    //   meta: { title: 'rabbitChannels' }
    // },

  ]
}
export default tableRouter
