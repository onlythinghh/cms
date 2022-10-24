const ADD_ERROR_LOG = 'ADD_ERROR_LOG'
const state = {
    logs: []
}

const mutations = {
    [ADD_ERROR_LOG](state, { error, info, url }) {
        // vue 实例(vm) 不能放进 state中，会出现死循环，不信你可以试试
        state.logs.push({ error, info, url })
    }
}

const actions = {
    addErrorLog({ commit }, log) {
        commit(ADD_ERROR_LOG, log)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
