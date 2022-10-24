import Request, { isRequestTimeout, isNotFound } from './request'
import dataVersionControl from './dataVersionControl'
import CmsInterceptor from './CmsInterceptor'
import store from '../store'
import router from '../router'
import { logoutRoute, NEED_TO_LOGIN_CODE } from '../utils/ServiceUtil'
import { showMessage, hideLoading } from '../utils'
import i18n from '../i18n'


// base url
Request.defaults.baseURL = process.env.VUE_APP_REQUEST_BASE_API

// 前缀拦截处理
Request.interceptors.request.use(config => {
    if(config.url.indexOf('/upload')!=-1){
        config.timeout=0
    }
    // 添加 token
    config.headers.token = store.state.authen.token || ''
    return config
})

// 统计消息展示次数，不能超过1
const storeMessage = {
    redirectLogin: 0,
    timeout: 0
}

// 响应处理
Request.interceptors.response.use(response => {
    if (response.data && !response.data.success) {
        if (response.data.code === NEED_TO_LOGIN_CODE) {
            hideLoading()
            // 401 Token 失效或不正确 前端执行退出 跳转到登录
            const message = response.data.errMsg
            const duration = 1000
            const type = 'error'
            if(storeMessage.redirectLogin <= 0){
                storeMessage.redirectLogin+=1
                showMessage({
                    type, duration, message, onClose: () => {
                        router.push(logoutRoute)
                        storeMessage.redirectLogin = 0
                    }
                })
            }
            return new Promise(() => { })
        }
    }
    // 数据版本控制
    return dataVersionControl.handle(response.config.url, response.data.version).then(() => {
        return {
            config: response.config,
            data: response.data,
            status: response.status,
            headers: response.headers,
            statusText: response.statusText
        }
    }).catch(error => Promise.reject(error))

}, error => {

    if (isRequestTimeout(error)) {
        if(storeMessage.timeout <= 0){
            storeMessage.timeout += 1
            showMessage({ type: 'error', message: i18n.t('timeout') ,onClose:()=>{
                storeMessage.timeout = 0
            }})
        }
        hideLoading()
        return new Promise(() => { })
    }
    if (isNotFound(error)) {
        showMessage({ type: 'error', message: i18n.t('error.404') })
        hideLoading()
        return new Promise(() => { })
    }

    return Promise.reject(error)
})

/**
 * CMS 站点ID处理
 */
CmsInterceptor(Request)

export default Request
