import Request from '@/request'
import { downloadByBlob } from '@/utils/BaseUtil'
const state = {
    data: [],
    resChangeinfo: {},
}

const getters = {
}
const mutations = {
}
const actions = {
    // 获取搜索报表的列表
    getSearchList({commit}, data) {
        return Request.post('/html/text/getSearchList', data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            const rest = response.data
            return Promise.resolve(rest)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 导出报表
    getExcelexport({commit}, data) {
        return Request.post('/html/text/export', data, {
            responseType:'blob',
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            console.log('response',response)
            if(response.status == 200) {
                // return Promise.resolve(rest)
                const rest = response.data
                downloadByBlob(rest, { filename: '搜索报表.xlsx' })
                return Promise.resolve({ success: true, message: '导出成功' })
            }
            return Promise.reject(new Error(response.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
}
export {
    state,
    getters,
    mutations,
    actions
}