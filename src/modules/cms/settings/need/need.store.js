import Request from '@/request'


const actions = {
    schedulerList({ commit }, reqData) {
        return Request.post("/cms/assess/list-assess", reqData,{
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
        return Request.post("/cms/assess/save-assess", reqData,{
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
    getProduct({ commit }, reqData) {
        return Request.post("/cms/assess/list-product", reqData,{
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
    savePr({ commit }, reqData) {
        return Request.post("/cms/assess/save-product", reqData,{
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
    getQuestion({ commit }, reqData) {
        return Request.post("/cms/assess/list-question", reqData,{
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
    saveQu({ commit }, reqData) {
        return Request.post("/cms/assess/save-question", reqData,{
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
    colldel({ commit }, {key,id}) {
        return Request.post(`cms/assess/delete-${key}`, {id},{
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
    getAssess({ commit },reqData) {
        return Request.post("/cms/assess/get-assess",reqData,{
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
    publish({ commit },reqData) {
        return Request.post("/cms/assess/publish",reqData,{
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
}



export default {
    actions
}