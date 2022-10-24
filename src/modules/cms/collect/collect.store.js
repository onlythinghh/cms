import Request from "../../../request";

export default {
    actions: {
        getlist({ commit }, reqData) {
            return Request.post("/cms/data/list", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        collsave({ commit }, reqData) {
            return Request.post("/cms/data/save", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        colldetail({ commit }, reqData) {
            return Request.post("/cms/data/detail", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        colldel({ commit }, reqData) {
            return Request.post("/cms/data/del", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        
        
    },
};
