import System from './index.vue'
import User from './user/index.vue'
import Org from './user/org.vue'
import Dict from './dict/index.vue'
import Role from './role/index.vue'
import Resource from './resource/index.vue'
import Permission from './permission/index.vue'
import Authority from './authority/index.vue'
import Log from './log/index.vue'
module.exports = {
    path: '/system',
    name: 'system',
    meta: { title: '系统管理' },
    component: System,
    children: [
        {
            path: 'user',
            // name: 'user',
            component: Org,
            meta: { title: '用户管理' },
            children: [
                {
                    path: '',
                    name: 'user',
                    component: User,
                }, {
                    path: 'org',
                    name: 'Org',
                    component: ()=>import('./user/org/editOrg.vue')
                },
                {
                    path: 'jurisdiction',
                    name: 'Jurisdiction',
                    meta: { title: '权限设置' },
                    component: ()=>import('./user/jurisdiction/index.vue'),
                }
            ]
        },
        {
            path: 'role',
            name: 'Role',
            component: Role,
            meta: { title: '角色管理' }
        },
        {
            path: 'perm',
            name: 'Permission',
            component: Permission,
            meta: { title: '权限管理' }
        },
        {
            path: 'resource',
            name: 'Resource',
            component: Resource,
            meta: { title: '资源管理' }
        },
        {
            path: 'dict',
            name: 'dict',
            component: Dict,
            meta: { title: '数据字典' }
        },
        {
            path: 'authority',
            name: 'Authority',
            component: Authority,
            meta: { title: '权限设置' }
        },
        {
            path: 'log',
            name: 'log',
            component: Log,
            meta: { title: '日志管理' }
        },
    ]
}

