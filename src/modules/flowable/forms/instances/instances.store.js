import { get, toQueryString, toStart } from '../../request'

const INSTANCES = 'INSTANCES'
const state = {
    instances: {
        data: [],
        page: 1,
        size: 10,
        total: 0
    }
}
const getters = {}
const mutations = {
    [INSTANCES](state, { page, size, total, data }) {
        state.instances = { page, size, total, data }
    }
}
const actions = {
    getFormInstances({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-form/form/form-instances?' + toQueryString({ start: toStart(page, size), size, ...params })).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(INSTANCES, { data: rest.data, size, page, total: rest.total })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
