import Request from '../../../request'
import { deepCopy } from '../../../utils/BaseUtil'

const state = {
    
}
const getters = {
   
}
const mutations = {

}
const actions = {
    addLog({ commit }, reqData) {
        return Request.post('/cms/log/sign', reqData).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    logList({ commit }, reqData) {
        return Request.post("/cms/log/list", reqData,{
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        })
            .then(res => {
                return Promise.resolve(res.data);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    },
    ajaxGet({commit},reqData){
        return Request.get(reqData.url).then(res => {
            return Promise.resolve(res.data);
        }).catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    },
    ajaxForm({ commit }, reqData) {
        return Request.post(reqData.url, {...reqData.data}).then(res => {
            return Promise.resolve(res.data);
        })
        .catch(err => {
            return Promise.reject(err);
        });
    },
    ajaxJson({ commit }, reqData) {
        return Request.post(reqData.url, {...reqData.data},{
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
}
export default {
    state,
    getters,
    mutations,
    actions
}
