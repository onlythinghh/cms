import Request from '../../request'
import { BASE64Helper } from '../../utils/CryptUtil'
import {
    saveUserinfo,
    loadUserinfo,

    saveRights,
    loadRights,

    saveLastLoginAccount,
    loadLastLoginAccount,

    loadDictionary,
    saveDictionary,

    logout
} from '../../utils/ServiceUtil'
import { showLoading, hideLoading } from '../../utils'
import { deepCopy, isString, isArray, pathNormalize } from '../../utils/BaseUtil'
// import { setTranslates } from '../../i18n/AsyncTranslate'

const SAVE_AUTHEN_INFO = 'SAVE_AUTHEN_INFO'
const SAVE_MY_DICT_INFO = 'SAVE_MY_DICT_INFO'

// 默认加载本地用户信息
const userinfo = loadUserinfo()

// 默认加载本地数据字典
const dictionary = loadDictionary() || {}

// 默认加载本地用户权限信息
const rights = loadRights()
const { menus = [], buttons = [], roles = [], permissions = [], isAdmin = false } = rights

const state = {
    userinfo: (({ token, ...rest }) => rest)(userinfo),
    token: userinfo.token,
    menus: menus,
    buttons: buttons,
    roles: roles,
    permissions: permissions,
    lastLoginAccount: loadLastLoginAccount(),
    dictionary: dictionary,
    isAdmin
}

const getters = {
    isLogined(state) {
        return !!state.token && !!state.userinfo.account
    },
    dictionaries(state) {
        return deepCopy(state.dictionary) || {}
    },
    getDictionary(state) {
        const _dictionary = deepCopy(state.dictionary) || {}
        return key => {
            if (!key || (!isString(key) && !isArray(key))) {
                throw new Error('parameter must be String or Array, but found', typeof key)
            }

            if (isString(key)) {
                return _dictionary[key] || {}
            }
            const result = {}
            if (isArray(key)) {
                [].slice.call(key).forEach(k => {
                    const dict = _dictionary[k]
                    if (dict) {
                        result[k] = dict
                    } else {
                        result[k] = {}
                    }
                })
            }
            return result
        }
    },
    getAttachModule(state, getters) {
        const attachModule = getters.getDictionary('attachModule') || {}
        return key => {
            return attachModule[key] || {}
        }
    },
    indexView(state) {
        // 获取首页地址
        const menus = state.menus || []
        const findIndex = (menus, path = []) => {
            return menus.some(menu => {
                if (menu.children && menu.children.length > 0) {
                    findIndex(menu.children, path)
                    return false
                } else {
                    path.push(menu.url || '')
                    return true
                }
            })
        }
        let index = []
        if (menus.length > 0) {
            findIndex(menus, index)
            return pathNormalize(index.map(pathNormalize).join('/'))
        }
        return false
    },
}

const mutations = {
    [SAVE_AUTHEN_INFO](state, data) {

        const _userinfo = (({ permissions, menuCodes, buttonCodes, menus, roles, ...userinfo }) => userinfo)(data)
        const rights = (({ menus, buttonCodes: buttons, roles, permissions, admin }) => ({ menus, buttons, roles, permissions, isAdmin }))(data)

        const token = _userinfo.token || state.token || ''
        state.token = token
        state.userinfo = _userinfo
        state.menus = rights.menus
        state.buttons = rights.buttons
        state.roles = rights.roles
        state.permissions = rights.permissions
        state.isAdmin = rights.isAdmin
        _userinfo.token = token

        saveRights(rights)
        saveUserinfo(_userinfo)
        saveLastLoginAccount(_userinfo.account)
    },
    [SAVE_MY_DICT_INFO](state, dict) {
        state.dictionary = dict || {}
        saveDictionary(dict)
    },
    logout(state) {
        state.token = ''
        state.userinfo = {}
        state.menus = []
        state.buttons = []
        state.roles = []
        state.permissions = []
        state.lastLoginAccount = loadLastLoginAccount() || ''
        logout()
        // Request.post('../html/sso/logout')
    }
}

const actions = {
    login({ commit, dispatch, getters }, params) {
        return Request.post('/login', {
            ...params,
            pcode: BASE64Helper.encode(params.password)
        }).then(response => {
            const rest = response.data
            if (rest.success) {
                if(!response.data.data.menus.length){
                    return Promise.reject(new Error('您没有任何权限，请联系管理员'))
                }
                if (!rest.data.token) {
                    return Promise.reject(new Error('返回数据中缺少必要的参数 token'))
                }
                commit(SAVE_AUTHEN_INFO, rest.data)

                // 获取默认首页路由
                const indexRoute = getters.indexView
                return dispatch('reloadDictionary').then(() => {
                    return Promise.resolve(indexRoute)
                }).catch(() => {
                    // 数据字典加载失败不影响登录后的操作
                    return Promise.resolve(indexRoute)
                })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    simpleLogin({commit, dispatch}, params) {
        return Request.post('/loginWithTicket', {
            ...params,
        }).then(response => {
            const rest = response.data
            // console.log('rest',rest)
            if (rest.success) {
                if(!response.data.data.menus.length){
                    return Promise.reject(new Error('您没有任何权限，请联系管理员'))
                }
                if (!rest.data.token) {
                    return Promise.reject(new Error('返回数据中缺少必要的参数 token'))
                }
                commit(SAVE_AUTHEN_INFO, rest.data)
                // const indexRoute = getters.indexView
                const indexRoute = rest.data.home
                
                console.log('体哦啊转:',indexRoute)
                return dispatch('reloadDictionary').then(() => {
                    return Promise.resolve(indexRoute)
                }).catch(() => {
                    // 数据字典加载失败不影响登录后的操作
                    return Promise.resolve(indexRoute)
                })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    loginSSO({ commit, dispatch, getters }, ssoid) {
        return Request.post('../html/sso/info', {
            ssoid: ssoid
        }).then(response => {
            const rest = response.data
            if (rest.success) {

                if (!rest.data.token) {
                    return Promise.reject(new Error('返回数据中缺少必要的参数 token'))
                }
                commit(SAVE_AUTHEN_INFO, rest.data)

                // 获取默认首页路由
                const indexRoute = getters.indexView
                return dispatch('reloadDictionary').then(() => {
                    return Promise.resolve(indexRoute)
                }).catch(() => {
                    // 数据字典加载失败不影响登录后的操作
                    return Promise.resolve(indexRoute)
                })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    reloadRights({ commit }) {
        showLoading(true, '正在加载资源信息')
        return Request.post('/my/info').then(response => {
            hideLoading()
            const rest = response.data
            if (rest.success) {
                commit(SAVE_AUTHEN_INFO, rest.data)
                return Promise.resolve('权限获取成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            hideLoading()
            console.error(error)
            return Promise.reject(error)
        })
    },
    reloadDictionary({ commit }) {
        showLoading(true, '正在加载数据字典数据')
        return Request.post('/dictionaries').then(response => {
            hideLoading()
            const rest = response.data
            if (rest.success) {
                commit(SAVE_MY_DICT_INFO, rest.data)
                return Promise.resolve('加载成功')
            }
        }).catch(error => {
            hideLoading()
            console.error(error)
            return Promise.reject(error)
        })
    },
    // 加载审核人信息
    getReviewerList({ commit }) {
        showLoading(true, '正在加载审核人信息')
        return Request.post('/cms/app/reviewer').then(response => {
            hideLoading()
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
        }).catch(error => {
            hideLoading()
            console.error(error)
            return Promise.reject(error)
        })
    },
    getReviewerLog({ commit }, { id }) {
        showLoading(true, '正在加载审核日志')
        return Request.post('/cms/article/log',{ id }).then(response => {
            hideLoading()
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
        }).catch(error => {
            hideLoading()
            console.error(error)
            return Promise.reject(error)
        })
    },
    combine({commit},reqDate){
        return Request.post('/uploader/combine',reqDate)
            .then(res=>{
                return Promise.resolve(res.data)
            })
            .catch(err=>{
                return Promise.reject(err)
            })
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
