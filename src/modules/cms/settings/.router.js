
export default {
    path: 'cms-settings',
    name: 'cmsSettings',
    meta: { title: 'CMS配置' },
    component: {
        render: h => h('router-view')
    },
    children: [
        {
            path: 'need',
            name: 'Need',
            meta: { title: '需求评估' },
            component: ()=>import('./need/index.vue'),
        },
        {
            path: 'need_edit',
            name: 'NeedEdit',
            meta: { title: '需求评估' },
            component: ()=>import('./need/edit.vue'),
        },
        {
            path: 'sugg',
            name: 'Sugg',
            meta: { title: '建议反馈' },
            component: ()=>import('./sugg/index.vue'),
        },
        {
            path: 'article-source',
            name: 'articleSource',
            meta: { title: '文章来源配置' },
            component: ()=>import('./article/source'),
        },
        {
            path: 'hotword',
            name: 'hotword',
            meta: { title: '热词管理' },
            component: ()=>import('./hotword/hotWordManage.vue')


        },
        {
            path: 'sensitive',
            name: 'sensitive',
            meta: { title: '敏感词管理' },
            component: ()=>import('./sensitive/sensitiveManage.vue')

        },
        {
            path: 'category',
            name: 'category',
            meta: { title: '分类管理' },
            component: ()=>import('./category/index.vue'),
        },
        {
            path: 'leaveMessage',
            name: 'LeaveMessage',
            meta: { title: '留言管理' },
            component: ()=>import('./message/index.vue'),
        },
        {
            path: 'vote',
            name: 'Vote',
            meta: { title: '问卷' },
            component: ()=>import('./vote/index.vue'),
        },
        {
            path: 'vote/voteAdd',
            name: 'VoteAdd',
            meta: { title: '编辑' },
            component: ()=>import('./vote/add.vue'),
        },
        {
            path: 'poll',
            name: 'Poll',
            meta: { title: '投票'},
            component: () => import('./poll/index.vue')
        },
        {
            path: 'poll/pollAdd',
            name: 'PollAdd',
            meta: { title: '编辑'},
            component: () => import('./poll/add.vue')
        },
        {
            path: 'guidance',
            name: 'guidance',
            meta: { title: '办事指南'},
            component: ()=>import('./guidance/index.vue')
        },
        {
            path: 'watermark',
            name: 'watermark',
            meta: { title: '水印管理'},
            component: ()=>import('./guidance/watermark.vue')
        },
        {
            path: 'mourning',
            name: 'mourning',
            meta: { title: '灰白设置'},
            component: ()=>import('./mourning/index.vue')
        },
        {
            path: 'worksheet',
            name: 'worksheet',
            meta: { title: '自定义表单' },
            component: ()=>import('./metadata/index.vue'),
            children: [
                {
                    path: 'add',
                    name: 'worksheetAdd',
                    component: ()=>import('./metadata/edit.vue'),
                    // meta: { title: `自定义表单${this.$route.query.type === 'add' ? '新增' : (this.$route.query.type === 'edit' ? '修改' : '复制') }` }
                    meta: {title: '自定义表单编辑'}
                }
            ]
        },
        {
            path: 'imgHouse',
            name: 'imgHouse',
            meta: { title: '图片库' },
            component: ()=>import('./imgHouse/index.vue')
        },
        {
            path: 'imgRecycle',
            name: 'imgRecycle',
            meta: { title: '图片库回收站' },
            component: ()=>import('./imgHouse/imgRecycle/recycle.vue')
        },
        {
            path: 'resourcesMage',
            name: 'resourcesMage',
            meta: { title: '资源管理'},
            component: () => import('./resourcesMage/index.vue')
        },
        {
            path: 'abtest',
            name: 'abtest',
            meta: { title: 'ab测试'},
            component: () => import('./abtest/index.vue')
        },
        {
            path: 'abtest/viewreport',
            name: 'viewreport',
            meta: { title: '查看报告'},
            component: () => import('./abtest/viewReport/index.vue')
        },
        {
            path: 'usergroup',
            name: 'usergroup',
            meta: { title: '用户分群'},
            component: () => import('./userGroup/index.vue')
        },
        {
            path: 'interestrate',
            name: 'interestrate',
            meta: { title: '结算利率'},
            component: () => import('./interestRate/index.vue')
        },
        {
            path: 'datamanage',
            name: 'datamanage',
            meta: { title: '数据管理'},
            component: () => import('./dataManage/index.vue')
        },
        {
            path: 'interestrateChange',
            name: 'interestrateChange',
            meta: { title: '利率修改'},
            component: () => import('./interesReateChange/index.vue')
        },
        {
            path: 'searchReport',
            name: 'searchReport',
            meta: { title: '搜索报表'},
            component: () => import('./searchReport/index.vue')
        },
    ]
}
