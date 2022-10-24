import { postJSON, get, put, putJSON, post, del } from '../../request'
import { downloadByBlob } from '@/utils/BaseUtil'

const setSelectedTask = 'setSelectedTask'
const setTaskDetail = 'setTaskDetail'
const setTaskContent = 'setTaskContent'
const setSubTasks = 'setSubTasks'
const addTaskContent = 'addTaskContent'
const clear = 'clear'
const state = {
    selectedTask: '',
    taskDetail: {},
    taskContent: [],
    subtasks: []
}
const getters = {}
const mutations = {
    [setSelectedTask](state, task) {
        state.selectedTask = task
    },
    [setTaskDetail](state, taskDetail) {
        state.taskDetail = taskDetail
    },
    [setTaskContent](state, taskContent) {
        state.taskContent = taskContent
    },
    [setSubTasks](state, subtasks) {
        state.subtasks = subtasks
    },
    [addTaskContent](state, content) {
        const taskContent = state.taskContent || []
        if (content && content.id) {
            taskContent.push(content)
            state.taskContent = taskContent
        }
    },
    [clear](state) {
        state.selectedTask = ''
        state.taskDetail = {}
        state.taskContent = {}
        state.subtasks = []
    }
}
const actions = {
    queryTasks({ commit }, { ...params } = {}) {
        return postJSON('/flowable/query/tasks', { ...params }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getTask({ commit }, taskId) {
        if (!taskId) {
            commit(setTaskDetail, {})
            return Promise.resolve('success.')
        }
        return get('/flowable/tasks/' + taskId).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(setTaskDetail, rest.data)
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getTaskContent({ commit }, taskId) {
        if (!taskId) {
            commit(setTaskContent, {})
            return Promise.resolve('success.')
        }
        return get('/flowable/tasks/' + taskId + '/content').then(response => {
            const rest = response.data
            if (rest.success) {
                commit(setTaskContent, rest.data)
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    getSubTasks({ commit }, { taskId = '', latestFirst = true } = {}) {
        if (!taskId) {
            commit(setSubTasks, [])
            return Promise.resolve('success.')
        }
        return get('/flowable/tasks/' + taskId + '/subtasks?latestFirst=' + latestFirst).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(setSubTasks, rest.data)
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    completeTask({ commit }, taskId) {
        return put('/flowable/tasks/' + taskId + '/action/complete').then(response => {
            return Promise.resolve('success.')
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    createTask({ commit }, task) {
        return postJSON('/flowable/tasks', task).then(response => {
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
    updateTask({ commit }, { taskId, ...task } = {}) {
        return putJSON('/flowable/tasks/' + taskId, { ...task }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest.data)
            }
            return Promise.reject(rest.errMsg)
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    assignUser({ commit }, { taskId = '', ...params } = {}) {
        return putJSON(`/flowable/tasks/${taskId}/action/assign`, { ...params }).then(response => {
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
    involveUser({ commit }, { taskId = '', ...params } = {}) {
        return putJSON(`/flowable/tasks/${taskId}/action/involve`, { ...params }).then(response => {
            return Promise.resolve('success.')
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    removeInvolveUser({ commit }, { taskId = '', ...params } = {}) {
        return putJSON(`/flowable/tasks/${taskId}/action/remove-involved`, { ...params }).then(response => {
            return Promise.resolve('success.')
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    createTaskContent({ commit, dispatch }, { taskId = '', file = null } = {}) {
        const formData = new FormData()
        formData.append('file', file)
        return post(`/flowable/tasks/${taskId}/raw-content`, formData).then(response => {
            const rest = response.data
            if (rest.success) {
                return dispatch('getTaskContent', taskId)//Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    removeTaskContent({ commit, dispatch }, { contentId = '', taskId = '' } = {}) {
        return del(`/flowable/content/${contentId}`).then(response => {
            return dispatch('getTaskContent', taskId)
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    dowloadTaskContent({ commit }, { contentId = '', filename = '' } = {}) {
        return get(`/flowable/content/${contentId}/raw`, { responseType: 'blob' }).then(response => {
            const rest = response.data
            if (rest.success) {
                downloadByBlob(rest.data, { filename })
                return Promise.resolve('success.')
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
