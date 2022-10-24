import { get, toQueryString, toStart } from "../../request"
import { downloadByBlob } from '@/utils/BaseUtil'

const PROCESS_DEFINSTIONS = 'PROCESS_DEFINSTIONS'
const setDeploymentId = 'setDeploymentId'

const state = {
    definstions: {
        data: [],
        page: 1,
        size: 10,
        total: 0
    },
    deploymentId: ''
}
const getters = {}
const mutations = {
    [PROCESS_DEFINSTIONS](state, { page, size, total, data } = {}) {
        state.definstions = { data, size, page, total }
    },
    [setDeploymentId](state, deploymentId) {
        state.deploymentId = deploymentId
    }
}
const actions = {
    getRepositoryProcessDefinitions({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-process/repository/process-definitions?' + toQueryString({ start: toStart(page), size, ...params })).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(PROCESS_DEFINSTIONS, { data: rest.data, page, size, total: rest.total })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    getProcessDefinitionResourceData({ commit }, { processDefinitionId = '', resourceName = '' } = {}) {
        return get(`/flowable/process-definitions/${processDefinitionId}/resource`, { responseType: 'arraybuffer' }).then(response => {
            const rest = response.data
            if (rest.success) {
                downloadByBlob(rest.data, { filename: resourceName })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getProcessDefinitionXMLResource({ commit }, processDefinitionId = '') {
        return get(`/flowable/process-definitions/${processDefinitionId}/resource/xml`).then(response=>{
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
