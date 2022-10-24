import Request from '@/request'
import { deepCopy } from '@/utils/BaseUtil'
const LIST = 'LIST'
const ADD = 'ADD'
const DELETE = 'DELETE'


const filterByType = (categories = [], type = '') => {
    return categories.filter(category => category.type === type)
}

const state = {
    categories: [],
    list: []
}
const getters = {
    /* getCategoriesByType(state) {
        const categories = deepCopy(state.categories)
        return type => {
            // 热词 1 敏感词 2
            return categories.find(category => category.type === type)
        }
    } */
}
const mutations = {
    [LIST](state, data) {
        // state.categories = categories
        state.list = data
    },
    [ADD](state, category) {
        const categories = deepCopy(state.categories)
        let exists = categories.some(_category => {
            if (Number(_category.id) === Number(category.id)) {
                Object.assign(_category, category)
                return true
            }
            return false
        })
        if (!exists) {
            categories.push(category)
        }
        state.categories = categories
    },
    [DELETE](state, category) {
        const categories = deepCopy(state.categories)
        const index = categories.findIndex(_category => {
            if (Number(_category.id) === Number(category.id)) {
                return true
            }
            return false
        })
        if (index > -1) {
            categories.splice(index, 1)
        }
        state.categories = categories
    },
}
const actions = {
    loadCategories({ commit }, category) {
        return Request.post('/cms/category/list', category).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(LIST, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    getCategoriesByType({ dispatch }, type) {
        // 热词 1 敏感词 2
        const categories = state.categories
        if (categories && categories.length > 0) {
            return Promise.resolve(filterByType(deepCopy(categories), type))
        }
        return dispatch('loadCategories', { type }).then(data => {
            return Promise.resolve(filterByType(data, type))
        }).catch(error => {
        })
    },
    saveCategory({ commit }, category) {
        return Request.post('/cms/category/save', category).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(ADD, { ...category, id: rest.data })
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    deleteCategory({ commit }, { id }) {
        return Request.post('/cms/category/del', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(DELETE, { id })
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    }

}
export default {
    state,
    getters,
    mutations,
    actions
}
