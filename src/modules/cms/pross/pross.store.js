import Request from "../../../request";
import { downloadByBlob } from "@/utils/BaseUtil";

export default {
    actions: {
        getlist({ commit }, reqData) {
            return Request.post("/cms/flow/list", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 新增流程
        prossSeve({ commit }, reqData) {
            return Request.post("/cms/flow/save", reqData, {
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
        // 流程详情
        prossDetail({ commit }, reqData) {
            return Request.post("/cms/flow/detail", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 删除流程
        prossDel({ commit }, reqData) {
            return Request.post("/cms/flow/del", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 获取流程设置
        getSetting({ commit }, reqData) {
            return Request.post("/cms/flow/setting-get", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 流程设置
        pressSettingSave({ commit }, reqData) {
            return Request.post("/cms/flow/setting-save", reqData, {
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
        // 用户获取
        getUser({ commit }, reqData) {
            return Request.post("/org/query", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 日志查询
        getreviewLogs({ commit }, reqData) {
            return Request.post("/cms/article/review/logs/query", reqData, {
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        // 日志导出
        getlogsExport({ commit }, reqData) {
            return Request.post("/cms/article/review/logs/export", reqData, {
                responseType:'blob',
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(response => {
                const rest = response.data
                downloadByBlob(rest, { filename: '审核日志.xlsx' })
                return Promise.resolve({ success: true, message: '导出成功' })
                // return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
    }
};
