import Request from '../../../request'

const LOAD_ROLES = 'LOAD_ROLES'
const CLEAR_ROLES = 'CLEAR_ROLES'
const state = {
    roles: []
}
const mutations = {
    [LOAD_ROLES](state, roles) {
        state.roles = roles
    },
    [CLEAR_ROLES](state){
        state.roles = []
    }
}
const actions = {
    loadRoles({ commit, state }, role) {
        // const preRoles = state.roles
        // if (preRoles && preRoles.length > 0) {
        //     // 已经存在就不用加载，直接使用
        //     return Promise.resolve(preRoles)
        // }
        return Request.post('/role/list', role).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(LOAD_ROLES, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    saveRole(context, role) {
        return Request.post('/role/save', role).then(response => {
            const rest = response.data
            if (rest.success) {
                context.commit(CLEAR_ROLES)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    delRole(context, role) {
        return Request.post('/role/del', { id: role.id }).then(response => {
            const rest = response.data
            if (rest.success) {
                context.commit(CLEAR_ROLES)
                return Promise.resolve('删除角色成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    }

}
export default {
    state,
    mutations,
    actions
}
