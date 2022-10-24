import API from '../api'
const CHANNEL_LIST = 'CHANNEL_LIST'
const TEMPLATE_LIST = 'TEMPLATE_LIST'
const CHANNELS_LIST = 'CHANNELS_LIST'
const AUDIT_LIST = 'AUDIT_LIST'

const channel = {
    state: {
        auditList: [],
        channelList: [],
        templateList: [],
        channelsList:[
            {
                app:[],
                article:[],
                channel:[],
                template:[],

            }
        ]
    },
    mutations: {
        [AUDIT_LIST] (state, data) {
            state.auditList = data
        },
        [CHANNEL_LIST] (state, data) {
            state.channelList = data
        },
        [CHANNELS_LIST] (state, data) {
            state.channelsList = data[0].children
        },

        [TEMPLATE_LIST] (state, data) {
            state.templateList = data
        }
    },
    actions: {
        // 获取频道列表
        async getChannelList ({ commit }, requestData) {
            try {
                let { data } = await API.getChannelList(requestData)
                let result = [
                    {
                        id: 0,
                        code: 'top',
                        name: '频道',
                        viewName: '频道',
                        isShowExtraMenu: false,
                        children: data.data
                    }
                ]
                commit(CHANNELS_LIST, result)
                commit(CHANNEL_LIST, result)
                return Promise.resolve(result)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },

        // 增加修改频道
        async addChannel ({ commit }, requestData) {
            try {
                let { data } = await API.addChannel(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },

        // 发布频道
        async releaseChannel ({ commit }, requestData) {
            try {
                let { data } = await API.releaseChannel(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },

        // 删除频道
        async deleteChannel ({ commit }, requestData) {
            try {
                let { data } = await API.deleteChannel(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },

        // 复制频道
        async copyChannel ({ commit }, requestData) {
            try {
                let { data } = await API.copyChannel(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },

        // 移动频道
        async moveChannel ({ commit }, requestData) {
            try {
                let { data } = await API.moveChannel(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },

        // 获取频道回收站列表
        async getChannelRecycleList ({ commit }, requestData) {
            try {
                let { data } = await API.getChannelRecycleList(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },


        // 增加修改频道
        async getChannel ({ commit }, requestData) {
            try {
                let { data } = await API.getChannelList(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },
        // 获取表单选项
        async getFromList ({ commit }, requestData) {
            try {
                let { data } = await API.getfromList(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },
        //流程审核
        // async _auditProcess ({commit}, requestData) {
        //     try {
        //         let {data} = await API.auditProcess(requestData)
        //         commit(AUDIT_LIST, data.data)
        //         return Promise.resolve(data.data)
        //     } catch (error) {
        //         console.error(error)
        //         return Promise.reject(new Error(error.message))
        //     }
        // }
    }
}

export default channel
