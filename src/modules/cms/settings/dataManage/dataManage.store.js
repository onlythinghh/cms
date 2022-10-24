import Request from '@/request'
const state = {
    // data: [],
}

const getters = {
}
const mutations = {
}
const actions = {
    
    getIndicatorAction({ commit }, params) {
        // (指标)基础事件查询 用户属性查询 (指标)事件属性查询
        let urls = ['/abtest/indicator/action', '/user/group/property', '/abtest/indicator/property']
        let {data, idx} = params
        return Request.post(urls[idx], data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
}

export {
    state,
    getters,
    mutations,
    actions
}