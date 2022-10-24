
export default {
    path: 'task',
    name: 'task',
    meta: { title: '任务管理' },
    component: {
        render: h => h('router-view')
    },
    children: [
        {
            path: 'task-management',
            name: 'taskManagement',
            meta: { title: '任务列表' },
            component: () => import('./index.vue'),
        },
    ]
}
