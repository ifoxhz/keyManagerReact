// import loadable from '@/utils/loadable'
import React, { lazy } from 'react'
import {
  HomeFilled,
  AppstoreFilled,
  ExclamationCircleFilled,
  LayoutFilled,
  FormOutlined
} from '@ant-design/icons'

const Index = lazy(() =>
  import(/*webpackChunkName: 'index' */ '@/views/pages/table-page/QueryTable')
)

const About = lazy(() =>
  import(/*webpackChunkName: 'layout' */ '@/views/pages/About')
)

const Button = lazy(() =>
  import(/*webpackChunkName: 'layout' */ '@/views/pages/general/Button')
)
const Icon = lazy(() =>
  import(/*webpackChunkName: 'layout' */ '@/views/pages/general/Icon')
)

const BasicForm = lazy(() =>
  import(
    /*webpackChunkName: 'form-pages' */ '@/views/pages/form-pages/BasicForm'
  )
)

const StepForm = lazy(() =>
  import(
    /*webpackChunkName: 'form-pages' */ '@/views/pages/form-pages/StepForm'
  )
)

const QueryTable = lazy(() =>
  import(
    /*webpackChunkName: 'table-pages' */ '@/views/pages/table-page/QueryTable'
  )
)
const StandardTable = lazy(() =>
  import(
    /*webpackChunkName: 'table-pages' */ '@/views/pages/table-page/StandardTable'
  )
)

export const DefaultLayout = lazy(() =>
  import(/* webpackChunkName: 'index' */ '../views/Layout')
)

export const NotFound = lazy(() =>
  import(/* webpackChunkName: '404' */ '../views/404')
)

export const Login = lazy(() =>
  import(/* webpackChunkName: 'login' */ '../views/Login')
)

const ProdPermit = lazy(() =>
  import(
    /*webpackChunkName: 'table-pages' */ '@/views/pages/prodpermit'
  )
)

// const FakeDevice = lazy(() =>
//   import(
//     /*webpackChunkName: 'table-pages' */ '@/views/pages/fake'
//   )
// )

const CredentTable = lazy(() =>
  import(
    /*webpackChunkName: 'table-pages' */ '@/views/pages/credent'
  )
)


const routes = [
  {
    path: '/index',
    exact: true,
    name: 'Index',
    component: Index,
    title: '产品管理',
    icon: <HomeFilled />,
  },
  // {
  //   path: '/credent',
  //   exact: true,
  //   name: 'credent',
  //   component: CredentTable,
  //   title: '证书查询',
  //   icon: <ExclamationCircleFilled />
  // },
  // {
  //   path: '/fake',
  //   exact: true,
  //   name: 'fakedevice',
  //   component: FakeDevice,
  //   title: '仿真拉取',
  //   icon: <ExclamationCircleFilled />
  // },
  // {
  //   path: '/general',
  //   title: '通用',
  //   icon: <AppstoreFilled />,
  //   subs: [
  //     {
  //       path: '/general/button',
  //       exact: true,
  //       name: 'Button',
  //       component: Button,
  //       title: '按钮',
  //       icon: ''
  //     },
  //     {
  //       path: '/general/icon',
  //       exact: true,
  //       name: 'Icon',
  //       component: Icon,
  //       title: '图标',
  //       icon: ''
  //     }
  //   ]
  // },
  {
    path: '/form-pages',
    title: '配置',
    icon: <FormOutlined />,
    subs: [
      {
        path: '/form-pages/basic-table',
        exact: true,
        name: 'BasicForm',
        component: BasicForm,
        title: '用户配置',
        icon: ''
      }
    ]
  },
  {
    path: '/table-pages',
    title: '报表',
    icon: <LayoutFilled />,
    subs: [
      {
        path: '/table-pages/query-table',
        exact: true,
        name: 'QueryTable',
        component: QueryTable,
        title: '总体报表',
        icon: ''
      }
    ]
  },

  {
    path: '/about',
    exact: true,
    name: 'About',
    component: About,
    title: '关于',
    icon: <ExclamationCircleFilled />
  }
]

export default routes
