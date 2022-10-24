import Request from '@/request'

const actions = {
    schedulerList({ commit }, reqData) {
        return Request.post("/cms/feedback/list", reqData,{
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
        return Request.post("/cms/feedback/del", reqData,{
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
    async publish ({commit}, reqData) {
        try {
            let { data } = await Request.post('/cms/feedback/export', reqData, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                responseType: 'blob' 
            })
            return Promise.resolve(data)
        } catch (err) {
            return Promise.reject(err)
        }
    },
}



export default {
    actions
}