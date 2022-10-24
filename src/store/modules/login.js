/* import {
    saveLastLoginAccount,
    loadLastLoginAccount
} from '../../utils/ServiceUtil' */
import Request from '@/request'
export default {
    namespaced: true,
    state: {
        enableVerCode: true, // 是否启用验证码
        enableRememberMe: false, //是否启用记住我
        enableFotgot: false, // 是否启用忘记密码
        verCodeURL: ''
    },
    mutations: {
        enableVerCode(state, enabled) {
            state.enableVerCode = enabled
        },
        enableRememberMe(state, enabled) {
            state.enableRememberMe = enabled
        },
        enableFotgot(state, enabled) {
            state.enableFotgot = enabled
        },
        setVerCodeURL(state, url) {
            state.verCodeURL = url
        }
    },
    actions: {
        loadVerCodeURL({ commit }) {
            return Request.post('/capt').then(response => {
                const rest = response.data
                if (rest.success) {
                    commit('setVerCodeURL', rest.data)
                    return Promise.resolve(rest.data)
                }
                return Promise.reject(new Error(rest.errMsg))
            }).catch(error => {
                console.error(error)
            })
        }
    },
    getters: {}
}
