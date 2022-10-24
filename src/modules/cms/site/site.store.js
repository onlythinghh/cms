import Request from '../../../request'
import { saveSite, getSite } from '../../../utils/ServiceUtil'
const SITES = 'SITES'
const CLEAR_SITES = 'CLEAR_SITES'
const choose = 'choose'

const findSite = (sites = [], siteId) => {
    if (!sites || !siteId) {
        return null
    }
    const normalSites = normalizeSites(sites)
    const site = normalSites.find(site => {
        return site.id == siteId
    })
    return site
}
const normalizeSites = (sites) => {
    const normalSites = []

    const normailze = (_sites = [], target = []) => {

        _sites.forEach(({ children, ...site }) => {
            target.push({ ...site })

            if (children && children.length > 0) {
                normailze(children, target)
            }
        })

    }
    normailze(sites, normalSites)
    return normalSites
}
// 检查已经选择的站点，不存在就默认选择列表中的第一个
const checkStoreSiteAndGetDefault = (sites = [], siteId) => {
    let site = findSite(sites, siteId)
    if (!site || !site.id) {
        if (sites && sites.length > 0) {
            site = sites[0]
        }
    }
    if (site && site.id) {
        saveSite(site)
    }
    return site || {}
}
// 从本地存储中获取站点信息
const storeSite = getSite()
const state = {
    sites: [],
    storeSite: storeSite,
    authString: []
    // appPermissions: [],
    // tplPermissions: []
}
const getters = {
    site(state) {
        const storeSite = state.storeSite
        const sites = state.sites
        let site = {}
        if (storeSite && storeSite.id) {
            site = checkStoreSiteAndGetDefault(sites, storeSite.id) || {}
        }
        return site
    },
    getSite(state) {
        const sites = state.sites
        return siteId => {
            if (!siteId) {
                if (sites && sites.length > 0) {
                    return sites[0]
                }
                return {}
            }
            return findSite(sites, siteId) || {}
        }
    },
    hasSites(state) {
        return state.sites && state.sites.length > 0
    },
    hasSite(state) {
        return !!state.storeSite.id
    },
    normalizeSites(state) {
        const sites = state.sites
        return normalizeSites(sites)
    }
}

const mutations = {
    [SITES](state, data) {
        state.sites = data || []
    },
    [CLEAR_SITES](state) {
        state.sites = []
    },
    [choose](state, site) {
        state.storeSite = site
        // 存储站点信息
        localStorage.removeItem('channelData')
        saveSite(site)
    }
}

const actions = {
    loadSites({ commit, state, getters }, name, isReload = false) {
        // if (!isReload) {
        //     const _sites = state.sites
        //     if (_sites && _sites.length > 0) {
        //         return Promise.resolve(_sites)
        //     }
        // }
        return Request.post('/cms/app/list', name, {}).then(response => {
            const rest = response.data
            if (rest.success) {
                const sites = rest.data.tree || []

                if (!getters.hasSite && sites && sites.length > 0) {
                    // 默认选择第一个站点
                    commit(choose, sites[0])
                }
                commit(SITES, sites)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    saveSite({ commit }, { children, ...site }) {
        return Request.post('/cms/app/save', site, {
            headers: {
                'Content-Type': 'application/json;chartset=uft-8'
            },
        }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_SITES)
                // if (state.site.id === site.id) {
                //     // 更新选择过的站点信息
                //     commit(choose, { ...state.site, ...site })
                // }
                return Promise.resolve('保存成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    delSite({ commit }, { id }) {
        return Request.post('/cms/app/del', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_SITES)
                return Promise.resolve('保存成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    publishSite({ commit }, { id, type, range,plan }) {
        return Request.post('/cms/app/release', { id, type,range,plan }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('站点发布成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    copySite({ commit }, { id, name }) {
        return Request.post('/cms/app/copy', { id, name }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_SITES)
                return Promise.resolve('站点复制成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    /**
     * 暂时不需要该接口
     * @Deprecated
     * @param {*} param0
     * @param {*} param1
     */
    previewSite({ commit }, { id }) {
        return Request.post('/cms/app/review', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    /**
     * Logo 上传
     * @param {*} param0
     * @param {*} param1
     */
    uploadLogo({ dispatch }, { file, type ,appid}) {

        return dispatch('cms/imageUpload', { file, type,appid }, { root: true }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(response)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
