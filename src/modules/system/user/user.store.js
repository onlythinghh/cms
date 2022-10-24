import Request from '../../../request'
import { BASE64Helper } from '../../../utils/CryptUtil'

const USERINFO_LIST = 'USERINFO_LIST'
const MODIFY_USER = 'MODIFY_USER'
const setOrgid = 'setOrgid'

const state = {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    orgid: ''
}
const getters = {

}
const mutations = {
    [USERINFO_LIST](state, { data, page, limit, total }) {
        state.data = data
        state.page = page
        state.limit = limit
        state.total = total
    },
    [MODIFY_USER](state, userinfo) {
        state.data.forEach(user => {
            if (user.id === userinfo.id || user.account === userinfo.account) {
                Object.assign(user, userinfo)
            }
        })
    },
    [setOrgid](state, orgid) {
        state.orgid = orgid
    }
}
const actions = {
    searchList({ commit, state }, searchParams = { page: 1, limit: 10 }) {
        // 设置组织ID
        searchParams.orgid = state.orgid
        return Request.post('/user/page', searchParams).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(USERINFO_LIST, { data: rest.data, total: rest.count, page: searchParams.page, limit: searchParams.limit })
                return Promise.resolve(rest.count)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    saveUser({ commit }, userinfo) {
        userinfo = {
            ...userinfo,
            pcode: userinfo.pcode ? BASE64Helper.encode(userinfo.pcode) : '',
            repcode: userinfo.repcode ? BASE64Helper.encode(userinfo.repcode) : '',
        }
        return Request.post('/user/save', userinfo).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('保存成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    enableUser(context, { id, account, enabled, locked }) {
        return Request.post('/user/enable', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    deleteUser({ commit }, { id, account }) {
        return Request.post('/user/del', { id, account }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('保存成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    assignRole({ commit }, { id, account, roles }) {
        return Request.post('/user/role', { id, account, roles }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(MODIFY_USER, { id, account, roles: roles.split(',').map(role => Number(role)) })
                return Promise.resolve('角色分配成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    unlock(context, request) {
        return Request.post('/user/unlock',{...request}).then(res=>{
            return Promise.resolve(res.data)
        }).catch(err=>{
            return Promise.reject(new Error(err.message || '服务器出现异常'))
        })
    },
    resetPassWord({commit}, request) {
        return Request.post('/user/repwd',{
            id:request.id,
            pcode:BASE64Helper.encode(request.pcode),
            repcode:BASE64Helper.encode(request.repcode),
        }) .then(response=>{
            const rest = response.data
            if(rest.success) {
                return Promise.resolve(rest.data)
                
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
