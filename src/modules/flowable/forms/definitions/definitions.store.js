import { get, toQueryString, toStart } from '../../request'

const DEFINITIONS = 'DEFINITIONS'
const state = {
    definitions: {
        data: [],
        page: 1,
        size: 10,
        total: 0
    }
}
const getters = {}
const mutations = {
    [DEFINITIONS](state, { page, size, total, data }) {
        state.definitions = { page, size, total, data }
    }
}
const actions = {
    getFormDefinitions({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-form/form-repository/form-definitions?' + toQueryString({
            start: toStart(page, size),
            size,
            ...params
        })).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(DEFINITIONS, { page, size, total: rest.total, data: rest.data })
                return Promise.resolve('success.')
            }
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
