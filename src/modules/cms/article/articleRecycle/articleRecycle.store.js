import API from '../api'
import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
const UPDATE_RECYCLE_LIST = 'UPDATE_RECYCLE_LIST'
const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE'
const UPDATE_TOTAL_PAGE = 'UPDATE_TOTAL_PAGE'
const articleRecycle = {
    state: {
        list: [],
        limit: DEFAULT_PAGE_LIMIT,
        currentPage: 1,
        totalPage: 0
    },

    mutations: {
        [UPDATE_RECYCLE_LIST] (state, data) {
            state.list = data
        },

        [UPDATE_CURRENT_PAGE] (state, n) {
            state.currentPage = n
        },

        [UPDATE_TOTAL_PAGE] (state, n) {
            state.totalPage = n
        }
    },

    actions: {
        // 获取文章回收站列表
        async getArticleRecycleList ({ state, commit }, requestData) {
            try {
                let { data } = await API.getArticleRecycleList({
                    limit: DEFAULT_PAGE_LIMIT,
                    page: state.currentPage,
                    ...requestData
                })
                commit(UPDATE_TOTAL_PAGE, data.count)
                commit(UPDATE_RECYCLE_LIST, data.data)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 恢复删除文章
        async operationRecycleArticle ({ commit }, requestData) {
            try {
                await API.operationRecycleArticle(requestData)
                return Promise.resolve(requestData.flag === 'recovery' ? '恢复成功！' : '删除成功！')
            } catch (error) {
                return Promise.reject(error)
            }
        }
    }
}

export default articleRecycle
