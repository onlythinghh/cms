
import Request from '@/request'
import { downloadByBlob } from '@/utils/BaseUtil'

const PROCESS_DEFINSTIONS = 'PROCESS_DEFINSTIONS'
const setDeploymentId = 'setDeploymentId'
const toStart = (page = 1, size = 10) => {
    if (page <= 0) {
        return 0
    }
    return (page - 1) * size
}

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
    // 获取列表
    getProcessesDefinitions({ commit }, { page = 1, size = 10, ...params } = {}) {
        return Request.post('/processes', { page: toStart(page), size, ...params }).then(response => {
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
    // 下载
    getProcessDefinitionResourceData({ commit }, { processDefinitionId = '', resourceName = '' } = {}) {
        return Request.get(`/processes/${processDefinitionId}/resource`, { responseType: 'arraybuffer' }).then(response => {
            const data = response.data
            downloadByBlob(data, { filename: resourceName })
            return Promise.resolve('success.')
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    // 获取xml
    getProcessDefinitionXMLResource({ commit }, processDefinitionId = '') {
        return Request.get(`/processes/${processDefinitionId}/resource/xml`).then(response => {
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
    // 删除
    deleteRepositoryDeployment({ commit }, definstionId) {
        return Request.delete('/processes/' + definstionId).then(() => {
            return Promise.resolve('success.')
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    // xml方式部署
    deploymentXMLModel({ commit }, { resourceName, data } = {}) {
        return Request.post('/processes/deployment', { resourceName, data }).then(() => {
            return Promise.resolve('success.')
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getAssigneees({ commit }) {
        return Request.post('/processes/assignees', {}).then(response => {
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
