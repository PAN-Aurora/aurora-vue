import Main from '@/views/Main.vue';

export const loginRouter = {
  path: '/login',
  meta: {
    title: 'Login - 登录'
  },
  component: (resolve) => require(['../views/login.vue'], resolve)
}

export const renderRouter = {
  path: '/',
  icon: 'key',
  type: 'fa fa-tasks',
  title: '初始化注册',
  component: (resolve) => require(['../views/Main.vue'], resolve)
}

export const appRouter = [
    {
        path: '/home',
        iconType: 'home',
        title: '首页',
        key: 'home',
        component: Main,
        redirect: '/home',
        children: [
            //{ path: '/home',iconType:'home', title: '首页', key: 'home',component: (resolve) => require(['../views/home/HomeAll.vue'], resolve)},
         ]
    },
    {
    path: '/system',
    iconType: 'setting',
    title: '系统管理',
    key: 'system',
    component: Main,
    children: [
      { path: '/system/userManage',iconType:'user', title: '用户管理', key: 'userManage',component: (resolve) => require(['../views/system/userManage.vue'], resolve)},
      { path: '/system/roleManage',iconType:'team', title: '角色管理',key: 'roleManage', component: (resolve) => require(['../views/system/roleManage.vue'], resolve)},
      { path: '/system/logManage', iconType:'file-search', title: '操作日志',key: 'logManage',component: (resolve) => require(['../views/system/logManage.vue'], resolve)},
    ]
    },
    {
    path: '/dataBase',
    iconType: 'database',
    title: '基础数据',
    key: 'dataBase',
    component: Main,
    children: [
       { path: '/modules/filelib/FileLibList',iconType:'user', title: '文件库管理', key: 'FileLibList',component: (resolve) => require(['../views/modules/filelib/file-lib-list.vue'], resolve)},
    ]
  },

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  renderRouter
];
