import Request from '@/request'
import { downloadByBlob/* , downloadByForm */ } from '@/utils/BaseUtil'
const state = {
    data: [],
    layerList:[],
}

const getters = {
    layerList: state => state.layerList
}
const mutations = {
    setlayerList(state, infos) {
        state.layerList = infos
    }
}
const actions = {
    // ab测试列表 abtest/test
    getABtestList({ commit }, data) {
        return Request.post("/abtest/test", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ABTest测试指标事件查询
    getIndicatorAction({ commit }, data) {
        return Request.post("/abtest/indicator/action", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ABTest测试指标事件的 属性 查询
    getIndicatorProperty({ commit }, data) {
        return Request.post("/abtest/indicator/property", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ab测试列表 新增 修改 复制
    getABtestListSave({ commit }, data) {
        return Request.post("/abtest/test/save", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ab测试列表 发布 继续
    getABtestListStart({ commit }, data) {
        return Request.post("/abtest/test/start", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ab测试列表 暂停
    getABtestListPause({ commit }, data) {
        return Request.post("/abtest/test/pause", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ab测试列表 下线 abtest/test/delete
    getABtestListFinish({ commit }, data) {
        return Request.post("/abtest/test/finish", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // ab测试列表 删除 
    getABtestListDelete({ commit }, data) {
        return Request.post("/abtest/test/delete", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 图片上传 
    getlImageSave({ commit }, data) {
        return Request.post("/abtest/test/upload", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 查看测试报告 1
    getABtestReport({ commit }, data) {
        return Request.post("/abtest/report", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 查看测试报告 2
    getABtestReportDetail({ commit }, data) {
        return Request.post("/abtest/report/detail", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 操作记录
    getABtestDetailLog({ commit }, data) {
        return Request.post("/abtest/test/log", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 下载报告
    getABtestReportDownload({ commit }, data) {
        return Request.post("/abtest/report/download", data, {
            responseType:'blob',
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            if(res.status == 200) {
                // return Promise.resolve(rest)
                const rest = res.data
                downloadByBlob(rest, { filename: 'list.xlsx' })
                return Promise.resolve({ success: true, message: '导出成功' })
            } else {
                return Promise.resolve({ success: false, message: res.errMsg })
            }
            return Promise.reject(new Error(res.errMsg))
            // return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 测试层列表查询
    getabtestLayer({ commit }, data) {
        return Request.post("/abtest/layer", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            console.log('resqqqqq',res)
            const { data, success } = res.data
            if(success){
                commit('setlayerList', data.content)
            }
            // return Promise.resolve(res.data);
            return Promise.resolve({success: success});
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 测试层新增 编辑
    getlayerSave({ commit }, data) {
        return Request.post("/abtest/layer/save", data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    // 测试层数据删除
    getlayerdDelete({ commit }, data) {
        return Request.post("/abtest/layer/delete", data, {
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