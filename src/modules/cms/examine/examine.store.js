import Request from "../../../request";

export default {
    actions: {
        getlist({ commit }, reqData) {
            return Request.post("/cms/article/review/list", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        exaudit({ commit }, reqData) {
            return Request.post("/cms/article/review/audit", reqData,{
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
        exforward({ commit }, reqData) {
            return Request.post("/cms/article/review/forward", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        exadopt({ commit }, reqData) {
            return Request.post("/cms/article/review/adopt", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 附件信息
        reviewDetail({ commit }, reqData) {
            return Request.post("/cms/article/review/detail", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        
        
    },
};
