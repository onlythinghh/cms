import API from '../api'
import Request from '../../../../request'
// import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
const SET_ARTICLE_LIST = 'SET_ARTICLE_LIST'
const UPDATE_ARTICLE_DETAIL = 'UPDATE_ARTICLE_DETAIL'
const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE'
const UPDATE_TOTAL_PAGE = 'UPDATE_TOTAL_PAGE'
const APPID = 'APPID'
const CUSTOMER_FORM = 'CUSTOMER_FORM'

const list = {
    state: {
        list: [],
        isShowEditArticleWrapper: false,
        articleDetail: {},
        currentPage: 1,
        // limit: DEFAULT_PAGE_LIMIT,
        totalPage: 0,
        appid: 1,
        CustomerForm: false
    },

    mutations: {
        [SET_ARTICLE_LIST](state, data) {
            state.list = data
        },

        [UPDATE_ARTICLE_DETAIL](state, data) {
            state.articleDetail = data
        },

        [UPDATE_CURRENT_PAGE](state, n) {
            state.currentPage = n
        },

        [UPDATE_TOTAL_PAGE](state, n) {
            state.totalPage = n
        },
        //站点ID
        [APPID](state, n) {
            state.appid = n
        },
        // 自定义表单
        [CUSTOMER_FORM](state, n) {
            state.CustomerForm = n
        }
    },

    actions: {
        // 获取文章列表
        async getArticleList({ state, commit }, reqData) {
            try {
                let _data = null
                if (!state.CustomerForm) {
                    let { data } = await API.getArticleList({
                        ...reqData,
                        page: state.currentPage,
                        // limit: state.limit
                    })
                    _data = data
                } else {
                    let { data } = await API.currentList({
                        ...reqData,
                        page: state.currentPage,
                    })
                    _data = data
                }
                commit(SET_ARTICLE_LIST, _data.data)
                commit(UPDATE_TOTAL_PAGE, _data.count)
                return Promise.resolve(_data.data)
            } catch (error) {
                commit(SET_ARTICLE_LIST, [])
                return Promise.reject(error)
            }
        },
        async currentList({ state, commit }, reqData) {
            try {
                let { data } = await API.currentList({
                    ...reqData,
                    page: state.currentPage,
                    // limit: state.limit
                })
                commit(SET_ARTICLE_LIST, data.data)
                commit(UPDATE_TOTAL_PAGE, data.count)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 编辑文章时预览
        // async previewArticle({ commit, rootState }, reqData) {
        //     try {
        //         let { data } = await API.previewArticle(reqData)
        //         return Promise.resolve(data.data)
        //     } catch (error) {
        //         return Promise.reject(error)
        //     }
        // },
        //编辑自定义表单预览
        previewArticle({ commit }, reqData) {
            return Request.post("/cms/article/previewTemp", reqData, {
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
        //编辑自定义表单预览
        previewForm({ commit }, reqData) {
            return Request.post("/cms/form/data/previewTemp", reqData, {
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
        // // 保存文章
        // async saveArticle({ commit }, requestData) {
        //     try {
        //         let { data } = await API.saveArticle(requestData,{
        //             headers: {
        //                 "Content-Type": "application/json;utf-8"
        //             }
        //         })
        //         return Promise.resolve(data.data)
        //     } catch (error) {
        //         return Promise.reject(error)
        //     }
        // },
        saveArticle({ commit }, reqData) {
            return Request.post("/cms/article/save", reqData, {
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
        ////////////////////////////////

        // 查看文章
        async viewArticle({ commit }, requestData) {
            try {
                let { data } = await API.viewArticle(requestData)
                commit(UPDATE_ARTICLE_DETAIL, data.data)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 移动文章
        async moveArticle({ commit }, requestData) {
            try {
                let { data } = await API.moveArticle(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 自定义表单移动文章
        async moveFormArticle({ commit }, reqData) {
            return Request.post("/cms/form/data/batchMove", reqData, {
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

        // 复制文章
        async copyArticle({ commit }, requestData) {
            try {
                let { data } = await API.copyArticle(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 共享文章
        async quoteArticle({ commit }, requestData) {
            try {
                let { data } = await API.quoteArticle(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 发布文章
        async releaseArticle({ commit }, requestData) {
            try {
                let { data } = await API.releaseArticle(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async customArticle({ commit }, requestData) {
            try {
                let { data } = await API.customArticle(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },


        // 删除文章
        async deleteArticle({ commit }, requestData) {
            try {
                let { data } = await API.deleteArticle(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 审核撤回
        async setUditCancel({ commit }, requestData) {
            try {
                let { data } = await API.auditCancel(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 催办数据
        async setauditeViewer({ commit }, requestData) {
            try {
                let { data } = await API.auditeViewer(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 催办确认
        async setauditNotice({ commit }, requestData) {
            try {
                let { data } = await API.auditNotice(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 校对
        async collation({ commit }, requestData) {
            try {
                let { data } = await API.collation(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 校对
        async replaceHotword({ commit }, requestData) {
            try {
                let { data } = await API.replaceHotword(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        //文章审核
        async articleAudit({ commit }, requestData) {
            try {
                let { data } = await API.articleAudit(requestData)
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        //流程跟踪
        async processTrace({ commit }, { caseId }) {
            try {
                let { data } = await API.processTrace('/modeler/' + caseId + '/model-json', { caseId })
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        //撤稿
        async revoke({ commit }, requestData) {
            try {
                let { data } = await API.revoke(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        dataRevoke({ commit }, reqData) {
            return Request.post("/cms/form/data/revoke", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },

        //跨站分享
        async crossShare({ commit }, requestData) {
            try {
                let { data } = await API.crossShare(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 增加修改频道
        async getChannel({ commit }, requestData) {
            try {
                let { data } = await API.getChannelList(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(new Error(error.message))
            }
        },
        // 排序
        async Sort({ commit }, reqData) {
            try {
                let { data } = await API.getSort(reqData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        SortCustom({ commit }, reqData) {
            return Request.post("/cms/article/sort-custom", reqData, {
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
        async getSortList({ commit }, reqData) {
            try {
                let { data } = await API.getArticleLists({
                    ...reqData,
                })
                return Promise.resolve(data.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async getCurrent({ commit }, reqData) {
            try {
                let { data } = await API.getCurrent({
                    ...reqData,
                })
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 保存自定义文章
        // async saveCustomArticle({ commit }, requestData) {
        //     try {
        //         let { data } = await API.saveCustomArticle(JSON.stringify(requestData))
        //         return Promise.resolve(data.data)
        //     } catch (error) {
        //         return Promise.reject(error)
        //     }
        // },
        saveCustomArticle({ commit }, reqData) {
            return Request.post("/cms/form/data/save", reqData, {
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
        async currenDel({ commit }, requestData) {
            try {
                let { data } = await API.currenDel(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async sortingB({ commit }, requestData) {
            try {
                let { data } = await API.sortingB(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        sortingF({ commit }, reqData) {
            return Request.post("cms/form/data/sort-custom", reqData, {
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
        async directPublish({ commit }, requestData) {
            try {
                let { data } = await API.directPublish(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async auditPublish({ commit }, requestData) {
            try {
                let { data } = await API.auditPublish(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async customDetail({ commit }, requestData) {
            try {
                let { data } = await API.customDetail(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        getReviewer({ commit }, reqData) {
            return Request.post("/user/list", reqData, {
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
        async getSharelist({ commit }, requestData) {
            try {
                let { data } = await API.getSharelist(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        addShare({ commit }, reqData) {
            return Request.post("/cms/article/share", reqData, {
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

        async getVersionlist({ commit }, requestData) {
            try {
                let { data } = await API.getVersionlist(requestData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async getChanneldata({commit}, reqData) {
            try {
                let { data } = await API.getfFlowlist(reqData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 上传文件
        async uploaderSave({commit}, reqData) {
            try {
                let { data } = await API.getUploaderSave(reqData)
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 用户画像绑定频道
        async GrpupUserBindChannel({commit}, reqData) {
            return Request.post("/user/group/bind", reqData, {
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        // AB测试绑定频道
        async ABtestBindChannel({commit}, reqData) {
            return Request.post("/abtest/test/bind", reqData, {
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },

        // 获取可绑定产品列表
        async getProductList({commit}, reqData) {
            return Request.post("/cms/product/getProductList", reqData, {
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        // 获取当前绑定的产品关系
        async getProductCurrentList({commit}, reqData) {
            return Request.post("/cms/product/getList", reqData, {
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        // 保存当前选中绑定的产品关系
        async getProductCurrentSave({commit}, reqData) {
            return Request.post("/cms/product/save", reqData, {
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },

        // 获取二维码
        async getQRcode({commit}, reqData) {
            return Request.post("/cms/form/data/getCode", reqData, {
                
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        // 生成二维码
        async getgenerateCode({commit}, reqData) {
            return Request.post("/cms/form/data/generateCode", reqData, {
                
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        // 获取文章默认路径
        
        async getdefautChannel({commit}, reqData) {
            return Request.post("/cms/article/getChannel", reqData, {
                
            }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });
        },
    }
}

export default list
