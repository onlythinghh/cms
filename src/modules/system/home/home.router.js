import Home from './Home.vue'
import { defaultRoute } from '@/utils/ServiceUtil'
import store from '@/store'
const home = {
    path: defaultRoute.path,
    component: Home,
    name: 'Home',
    meta: { title: '主页' },
    beforeEnter(to, from, next) {

        // 跳转到首页
        const indexRoute = store.getters['authen/indexView']
        if (indexRoute === defaultRoute.path) {
            next()
        } else {
            next(indexRoute)
        }
    }
}
export default [
    home
]
