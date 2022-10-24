import Request from '@/request'
const state = {
    // data: [],
}

const getters = {
}
const mutations = {
}
const actions = {
    // 用户分群列表查询
    getUserGroupList({ commit }, data) {
        return Request.post("/user/group", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 用户分群新增 / 编辑
    getUserGroupSave({ commit }, data) {
        return Request.post("/user/group/save", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 用户行为
    getUserGroupAction({ commit }, data) {
        return Request.post("/user/group/action", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 用户属性查询
    getUserGroupProperty({ commit }, data) {
        return Request.post("/user/group/property", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 属性操作列表
    getUserGroupOperator({ commit }, data) {
        return Request.post("/user/group/operator", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 用户组删除
    getUserGroupDelete({ commit }, data) {
        return Request.post("/user/group/delete", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 用户行为操作
    getUserGroupCondition({ commit }, data) {
        return Request.post("/user/group/condition", data, {
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
export {
    state,
    getters,
    mutations,
    actions
}