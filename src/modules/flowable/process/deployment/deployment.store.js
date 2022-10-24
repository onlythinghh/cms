import { get, toQueryString, toStart, post, del } from "../../request"
const DEPLOYMENTS = 'DEPLOYMENTS'
const state = {
    deployments: {
        data: [],
        total: 0,
        page: 1,
        size: 0
    }
}
const mutations = {
    [DEPLOYMENTS](state, { data = [], page, size, total } = {}) {
        state.deployments = { data, page, size, total }
    }
}
const getters = {}
const actions = {
    getProcessDeployments({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-process/repository/deployments?' + toQueryString({ start: toStart(page), size, ...params })).then(response => {
            const rest = response.data
            if (rest.success) {
                const data = rest.data
                commit(DEPLOYMENTS, { data, page: page, size, total: rest.total })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    createRepositoryDeployments({ commit }, { file }) {
        const formData = new FormData()
        formData.append('file', file)
        return post('/flowable-process/repository/deployments', formData).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(response)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    deleteRepositoryDeployment({ commit }, deploymentId) {
        return del('/flowable-process/repository/deployments/' + deploymentId, { cascade: true }).then(() => {
            return Promise.resolve('success.')
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    deploymentXMLModel({ commit }, { resourceName, data } = {}) {
        return post('/flowable/deployment', { resourceName, data }).then(() => {
            return Promise.resolve('success.')
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}
