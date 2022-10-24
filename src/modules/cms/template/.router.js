import templateList from './templateList.vue'
import templateImport from './templateImport.vue'
import templateAdd from './templateAdd.vue'
export default {
    path: 'template',
    name: 'template',
    meta: { title: '模板管理' },
    component: {
        render: h => h('router-view')
    },
    children: [
        {
            path: 'template-list',
            name: 'templateList',
            meta: { title: '模板维护' },
            component: templateList
        },
        {
            path: 'template-import',
            name: 'templateImport',
            meta: { title: '导入模板' },
            component: templateImport,
        },
        {
            path: 'template-add',
            name: 'templateAdd',
            meta: { title: '' },
            component: templateAdd,
        }
    ]
}
