
export default {
    path: 'sites',
    name: 'site',
    meta: { title: '站点管理' },
    component: {
        render: h => h('router-view')
    },
    children: [
        {
            path: 'site-list',
            name: 'SiteList',
            meta: { title: '站点维护' },
            component: () => import('./index.vue'),
        },
        {
            path: 'siteview',
            name: 'SiteView',
            meta: { title: '统计分析' },
            component: () => import('./siteview/index.vue'),
        },
        {
            path: 'filexplorer/:id',
            name: 'filexplorer',
            meta: { title: '站点资源管理' },
            component: () => import('./filexplorer/index.vue'),
        },
        {
            path: 'site-recycle',
            name: 'siteRecycle',
            meta: { title: '回收站管理' },
            component: () => import('./recycle/index.vue'),
        }
    ]
}
