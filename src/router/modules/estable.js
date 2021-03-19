/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const tableRouter = {
  path: '/table/estable',
  component: Layout,
  redirect: '/esTableZone',
  name: 'esTable',
  meta: {
    title: 'esTable',
    icon: 'table'
  },
  children: [
    {
      path: 'esTableZone',
      component: () => import('@/views/table/crawler/esTableZone'),
      name: 'esTableZone',
      meta: { title: 'esTableZone' }
    },
    {
      path: 'esTablePoi',
      component: () => import('@/views/table/crawler/esTablePoi'),
      name: 'esTablePoi',
      meta: { title: 'esTablePoi' }
    }
  ]
}
export default tableRouter
