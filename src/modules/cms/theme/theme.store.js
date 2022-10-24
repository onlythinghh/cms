import Request from '../../../request'

const actions = {
    schedulerList({ commit }, reqData) {
        return Request.post("/cms/theme/list", reqData,{
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
    thsave({ commit }, reqData) {
        return Request.post("/cms/theme/save", reqData,{
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
    nostop({ commit }, reqData) {
        return Request.post("/cms/theme/enable", reqData,{
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
    colldel({ commit }, reqData) {
        return Request.post("/cms/theme/del", reqData,{
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
    publish({ commit }) {
        return Request.post("/cms/theme/publish")
            .then(res => {
                return Promise.resolve(res.data);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    },
}



export default {
    actions
}