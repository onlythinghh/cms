import { get, toQueryString, toStart } from "../../request"

const PROCESS_INSTANCES = 'PROCESS_INSTANCES'
const setProcessDefinitionId = 'setProcessDefinitionId'

const state = {
    instances: {
        data: [],
        page: 1,
        size: 10,
        total: 0
    },
    processDefinitionId: ''
}
const getters = {}
const mutations = {
    [PROCESS_INSTANCES](state, { data, page, size, total } = {}) {
        state.instances = { data, page, size, total }
    },
    [setProcessDefinitionId](state, processDefinitionId) {
        state.processDefinitionId = processDefinitionId
    }
}
const actions = {
    getProcessInstances({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-process/runtime/process-instances?' + toQueryString({ start: toStart(page, size), size, ...params })).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(PROCESS_INSTANCES, { data: rest.data, page, size, total: rest.total })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getInstanceModelJson({ commit }, instanceId) {
        return get(`/modeler/${instanceId}/model-json`).then(response=>{
            return Promise.resolve(response.data)
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
