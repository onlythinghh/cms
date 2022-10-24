import Profile from './index.vue'
import Base from './base.vue'
import Passwd from './passwd.vue'
export default {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '用户信息' },
    children: [
        {
            path: 'base',
            name: 'baseProfile',
            component: Base,
            meta: { title: '个人信息' }
        },
        {
            path: 'passwd',
            name: 'passwd',
            component: Passwd,
            meta: { title: '修改密码' }
        }
    ]

}
