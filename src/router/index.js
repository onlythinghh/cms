import Vue from 'vue'
import Router from 'vue-router'
import routerInterceptor from './routerInterceptor'
import Main from '../views/Main.vue'
import errorRoutes from '../views/error'
import { isEmpty } from '../utils/BaseUtil'
import Login from './modules/login'

Vue.use(Router)

//解决重复点击左侧菜单的报错问题
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err)
// }
const getModulsRoutes = function () {
    // 匹配src/modules 目录下所有以.router.js结尾的js
    const context = require.context('../modules', true, /\.router\.js$/)
    const modulesRoutes = []
    context.keys().forEach(routerModulePath => {
        const itemModuleRoutes = context(routerModulePath)
        const itemRoutes = itemModuleRoutes.default || itemModuleRoutes
        if (isEmpty(itemRoutes)) {
            return
        }
        if (Array.isArray(itemRoutes)) {
            [].push.apply(modulesRoutes, itemRoutes)
        } else {
            modulesRoutes.push(itemRoutes)
        }
    })

    return modulesRoutes
}

const routes = [
    {
        path: '/',
        component: Main,
        meta: { title: '主页' },
        children: getModulsRoutes()
    },
    ...Login,
    ...errorRoutes
]


const createRouter = () => new Router({
    mode: 'history',  // require service support (history|hash)
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

// 路由拦截器，做权限处理
routerInterceptor(router)

export default router
