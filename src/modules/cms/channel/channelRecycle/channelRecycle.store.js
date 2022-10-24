import API from '../api'
import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
const UPDATE_RECYCLE_LIST = 'UPDATE_RECYCLE_LIST'
const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE'
const UPDATE_TOTAL_PAGE = 'UPDATE_TOTAL_PAGE'

const channelRecycle = {
    state: {
        tableData: [],
        limit: DEFAULT_PAGE_LIMIT,
        currentPage: 1,
        totalPage: 0
    },

    mutations: {
        [UPDATE_RECYCLE_LIST] (state, data) {
            state.tableData = data
        },

        [UPDATE_CURRENT_PAGE] (state, n) {
            state.currentPage = n
        },

        [UPDATE_TOTAL_PAGE] (state, n) {
            state.totalPage = n
        }
    },

    actions: {
        // 获取回收站列表
        async getRecycleList ({ commit }, requestData) {
            try {
                let { data } = await API.getChannelRecycleList(requestData)
                commit(UPDATE_TOTAL_PAGE, data.count)
                commit(UPDATE_RECYCLE_LIST, data.data)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 恢复删除频道
        async operationRecycleChannel ({ commit }, requestData) {
            try {
                await API.operationRecycleChannel(requestData)
                return Promise.resolve(requestData.flag === 'recovery' ? '恢复成功！' : '删除成功！')
            } catch (error) {
                return Promise.reject(error)
            }
        }
    }
}

export default channelRecycle
