import pathToRegexp from 'path-to-regexp'
import store from '../store'
import { isString, isEmpty, isPlainObject } from '../utils/BaseUtil'
import { logoutRoute, loginRoute, notFoundRoute, forbiddenRoute, defaultRoute, simpleLoginRout } from '../utils/ServiceUtil'
import { authorExcludeRoutes } from '../setting'

class Auth {
    constructor(route) {
        if (!isString(route) && !isPlainObject(route)) {
            throw new Error('route must be string or plain object')
        }
        if (isString(route)) {
            this.route = route
        } else if (isPlainObject(route)) {
            this.route = route.fullPath
        }
        return this
    }
    route = null
    authenExcludes = [logoutRoute.path, notFoundRoute.path, simpleLoginRout.path]
    authorExcludes = [notFoundRoute.path, forbiddenRoute.path, logoutRoute.path, simpleLoginRout.path, ...authorExcludeRoutes]
    isAuthenExcludeRoute() {
        const excludes = this.authenExcludes
        const path = this.route
        for (let i = 0; i < excludes.length; i++) {
            const pathRegexp = pathToRegexp(excludes[i])
            if (pathRegexp.test(path)) {
                return true
            }
        }
        return false
    }
    isAuthorExcludeRoute() {
        const excludes = this.authorExcludes
        const path = this.route
        for (let i = 0; i < excludes.length; i++) {
            const pathRegexp = pathToRegexp(excludes[i])
            if (pathRegexp.test(path)) {
                return true
            }
        }
        return false
    }
    isLoginRoute() {
        const path = this.route
        const pathRegexp = pathToRegexp(loginRoute.path)
        return !!pathRegexp.test(path)
    }
    isAuthen() {
        // 认证(登录成功，返回 true,否则返回false)
        return store.getters['authen/isLogined']
    }
    isAuthor() {
        // 是否有权限
        return store.getters['author/hasPermission'](this.route)
    }
    isSimpleLoginRoute() {
        const path = this.route
        // const pathRegexp = pathToRegexp(simpleLoginRout.path)s
        // return !!pathRegexp.test(path)
        return (path.indexOf("simpleLogin?") != -1) 
    }
    next() {
        // console.log('00000', this.route)
        if (isEmpty(this.route)) {
            return true
        }
        
        if(this.isSimpleLoginRoute()) {
            // console.log('快速登录路由')
            return true
        }
        if (this.isAuthenExcludeRoute()) {
            return true
        }

        if (this.isAuthen()) {
            // 已经认证
            if (this.isLoginRoute()) {
                // 已经登录，再次请求登录页面将被拒绝
                return { isAccess: false, redirectRoute: defaultRoute }
            }
            if (this.isAuthorExcludeRoute()) {
                // 不需要授权
                return true
            }
            if (this.isAuthor()) {
                // 已经授权
                return true
            }
            // 未授权
            return { isAccess: false, redirectRoute: forbiddenRoute }
        } else {
            // 未认证
            if (this.isLoginRoute()) {
                // 登录路由
                return true
            }
            // 非登录路由
            return { isAccess: false, redirectRoute: loginRoute }
        }
    }
}

export default (router) => {
    router.beforeEach((to, from, next) => {

        const auth = new Auth(to).next()
        if (auth === true) {
            document.title = to.meta.title || 'hz vue admin v1.0'
            next()
        } else if (auth.isAccess === false) {
            next(auth.redirectRoute)
        } else {
            document.title = to.meta.title || 'hz vue admin v1.0'
            next()
        }
    })
}
