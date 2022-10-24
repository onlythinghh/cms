import Request from '@/request'
import request2 from '../../../../request'

import { showLoading, showMessage } from '@/utils'

const request = ({ method = 'post', url, data = {} } = {}) => {
    return Request[method](url, data).then(res => {
        if (res.data.success) {
            return Promise.resolve(res)
        } else {
            const errMsg = res.data.errMsg || '服务器出现异常'
            showLoading(false)
            showMessage({
                type: 'error',
                message: errMsg
            })
            return Promise.reject({ message: errMsg })
        }
    })
}
export default {
    // 获取频道列表
    getChannelList (data) {
        return request({
            url: '/cms/channel/list',
            data
        })
    },
    addChannel(data) {
        return request2.post("/cms/channel/save", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        })
    },
    // 新增频道
    // addChannel (data) {
    //     return request({
    //         url: '/cms/channel/save',
    //         data
    //     })
    // },

    // 流程设置
    // async addChannel ({commit}, reqData) {
    //     try {
    //         let { data } = await request2({
    //             url: '/cms/channel/save',
    //             headers: {
    //                 'Content-Type': 'application/json;utf-8'
    //             },
    //             data: {
    //                 ...reqData
    //             }
    //         })
    //         return Promise.resolve(data)
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // },
    releaseChannel (data) {
        return request({
            url: '/cms/channel/release',
            data
        })
    },


    // 删除频道
    deleteChannel (data) {
        return request({
            url: '/cms/channel/del',
            data
        })
    },

    // 复制频道
    copyChannel (data) {
        return request({
            url: '/cms/channel/copy',
            data
        })
    },

    // 移动频道
    moveChannel (data) {
        return request({
            url: '/cms/channel/remove',
            data
        })
    },

    // 获取频道回收站列表
    getChannelRecycleList (data) {
        return request({
            url: '/cms/channel/recycle/list',
            data
        })
    },

    // 操作频道回收站
    operationRecycleChannel (data) {
        return request({
            url: '/cms/channel/recycle/opt',
            data
        })
    },
    // 操作频道回收站
    getfromList (data) {
        return request({
            url: '/cms/form/list',
            data
        })
    },

    //流程审核
    // auditProcess (data) {
    //     return request({
    //         url: '/cms/channel/flows',
    //         data
    //     })
    // }
}
