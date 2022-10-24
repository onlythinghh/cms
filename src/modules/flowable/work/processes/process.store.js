import { toStart, getJSON, postJSON, del, get } from '../../request'

const PROCESS_INSTANCES = 'PROCESS_INSTANCES'
const PROCESS_DEFINITIONS = 'PROCESS_DEFINITIONS'
const setSelectedInstance = 'setSelectedInstance'
const state = {
    processInstances: {
        data: [],
        page: 1,
        size: 25,
        total: 0
    },
    processDefinitions: {
        page: 1,
        size: 5,
        total: 0,
        data: []
    },
    selectedInstance: {}
}
const getters = {
    hasProcessInstance(state) {
        return processInstanceId => {
            return (state.processInstances.data || []).some(instance => instance.id === processInstanceId)
        }
    }
}

const mutations = {
    [PROCESS_INSTANCES](state, { page, size, total, data }) {
        state.processInstances = { page, size, total, data }
    },
    [PROCESS_DEFINITIONS](state, { data, page, size, total }) {
        state.processDefinitions = { data, page, size, total }
    },
    [setSelectedInstance](state, instance) {
        state.selectedInstance = instance
    }
}
const actions = {
    queryProcessInstances({ commit }, { page = 1, size = 25, ...params }) {
        return postJSON('/flowable/query/process-instances?', { start: toStart(page, size), size, ...params }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(PROCESS_INSTANCES, { data: rest.data, total: rest.total, page, size })
                const defaultData = rest.data && rest.data.length > 0 ? rest.data[0] : {}
                return Promise.resolve(defaultData)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getProcessInstance({ commit }, processInstanceId) {
        return getJSON('/flowable/process-instances/' + processInstanceId).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    deleteProcessInstance({ commit }, processInstanceId) {
        return del('/flowable/process-instances/' + processInstanceId).then(() => {
            return Promise.resolve()
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getProcessDefinitions({ commit }, { latest = true, page = 1, size = 25 } = {}) {
        return get('/flowable/process-definitions?latest=' + latest + '&start=' + toStart(page, size) + '&size=' + size).then(response => {
            const rest = response.data
            if (rest.success) {
                const defaultData = rest.data && rest.data.length > 0 ? rest.data[0] : {}
                commit(PROCESS_DEFINITIONS, { data: rest.data, size: rest.size, page, total: rest.total })
                return Promise.resolve(defaultData)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    startProcessInstance({ commit }, { name = '', processDefinitionId = '' } = {}) {
        return postJSON('/flowable/process-instances', { name, processDefinitionId }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getProcessDefinitionsStartForm({ commit }, processDefinitionId) {
        return getJSON(`/flowable/process-definitions/${processDefinitionId}/start-form`).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
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
