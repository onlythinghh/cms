import { get, toQueryString, toStart } from "../../request"

const RUNTIME_TASKS = 'RUNTIME_TASKS'

const state = {
    tasks: {
        data: [],
        page: 1,
        size: 10,
        total: 0
    }
}
const getters = {}
const mutations = {
    [RUNTIME_TASKS](state, { data, page, size, total }) {
        state.tasks = { data, page, size, total }
    }
}
const actions = {
    getTasks({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-process/runtime/tasks?' + toQueryString({ start: toStart(page), size, ...params })).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(RUNTIME_TASKS, { data: rest.data, page, size, total: rest.total })
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
