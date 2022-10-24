import Vue from 'vue'
// import store from '@/store'
import { isString, isArray } from '../../utils/BaseUtil'

// errorLog:'production' | ['production', 'development']
const needErrorLog = ['production', 'development']

function checkNeed() {
    const env = process.env.NODE_ENV
    if (isString(needErrorLog)) {
        return env === needErrorLog
    }
    if (isArray(needErrorLog)) {
        return needErrorLog.includes(env)
    }
    return false
}

if (checkNeed()) {
    const errorHandler = function (error, info, vm) {
        // somewhere ask use Vue.nextTick
        // now no need Vue.nextTick
        // detail see
        // https://github.com/vuejs/vuex/issues/1505
        // https://github.com/vuejs/vue/pull/9489
        // console.log(store)
        console.error(error)
        Vue.nextTick(() => {
            /* store.dispatch('errorLog/addErrorLog', {
                error,
                info,
                url: window.location.href,
                vm,
            }) */

        })
    }
    Vue.config.errorHandler = errorHandler
    Vue.prototype.$throw = function (error, info) {
        errorHandler(error, info, this)
    }
}

// 忽略该组件不注册到vue的全局组件中，但依然会被加载
export const __ignore = true
