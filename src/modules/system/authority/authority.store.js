import Request from '../../../request'
// import API from '../api'
const TEMP_LIST='TEMP_LIST'
const APP_SELECT_LIST='APP_SELECT_LIST'
const CHANNEL_LIST='CHANNEL_LIST'
const APP_LIST='APP_LIST'
const ROLE_SELECT_LIST='ROLE_SELECT_LIST'
const USER_LIST='USER_LIST'
const ROLE_LIST='ROLE_LIST'
const LINK_USER = 'LINK_USER'


const state = {
    temps: [
        {
            app: [],
            template: []
        }
    ],
    appSelect:[],
    pots: [],
    channelList:[],
    appList:[],
    channelSelect:[],
    userEcho:[],
    roleEcho:[],

}

const mutations = {
    [TEMP_LIST](state,  data) {
        state.temps = data
    },
    [APP_SELECT_LIST](state,  data) {
        state.appSelect = data
    },
    [ROLE_SELECT_LIST](state,  data) {
        state.channelSelect = data
    },
    [CHANNEL_LIST](state,  data) {
        state.channelList = data
    },
    [APP_LIST](state,  data) {
        state.appList = data
    },
    [USER_LIST](state,  data) {
        state.userEcho = data
    },
    [ROLE_LIST](state,  data) {
        state.roleEcho = data
    },
    [LINK_USER](state,data) {
        state.linkuser = data
    }
}


const actions = {
    linkuser({commit},val){
        commit(LINK_USER,val)
    },
    // 获取所有的站点模块频道文章
    authorityList({ commit }) {
        return Request.post('/resource/modules').then(response => {
            const rest = response.data
            if (rest.success) {
                commit(TEMP_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    appSelectList({ commit },types) {
        return Request.post('/user/perm',types).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(APP_SELECT_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    channelSelectList({ commit },types) {
        return Request.post('/role/perm',types).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(ROLE_SELECT_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    //频道进入，展示已添加权限的列表
    channelPermList({ commit },channel) {
        return Request.post('/cms/channel/permList',channel).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CHANNEL_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    //站点进入，展示已添加权限的列表
    sitePermList({ commit },channel) {
        return Request.post('/cms/app/permList',channel).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(APP_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    //用户进入的权限回显接口
    userPermList({ commit },user) {
        return Request.post('/user/permList',user).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(USER_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    //角色进入的权限回显接口
    rolePermList({ commit },role) {
        return Request.post('/role/permList',role).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(ROLE_LIST, [rest.data])
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    appPermUpdate({ commit },user) {
        return Request.post('/cms/app/permUpdate',user).then(response => {
            const rest = response.data
            if (rest.success) {

                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    channelPermUpdate({ commit },user) {
        return Request.post('/cms/channel/permUpdate',user).then(response => {
            const rest = response.data
            if (rest.success) {

                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    roleList({ commit },role) {
        return Request.post('/role/list',role).then(response => {
            const rest = response.data
            if (rest.success) {

                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
}

const getters = {

}
export default {
    state,
    actions,
    getters,
    mutations
}
