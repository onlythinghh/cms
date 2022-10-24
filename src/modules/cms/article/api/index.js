import request from './request'

export default {
    // 获取文章列表
    getArticleList(data) {
        return request({
            url: '/cms/article/list',
            data
        })
    },
    getArticleLists(data) {
        return request({
            url: '/cms/article/all',
            data
        })
    },

    // 新建、修改文章
    saveArticle(data) {
        return request({
            url: '/cms/article/save',
            data
        })
    },

    // 编辑文章时预览
    previewArticle(data) {
        return request({
            url: '/cms/article/previewTemp',
            data
        })
    },

    // 编辑文章时预览
    previewForm(data) {
        return request({
            url: '/cms/form/data/previewTemp',
            data
        })
    },

    // 查看文章
    viewArticle(data) {
        return request({
            url: '/cms/article/detail',
            data
        })
    },

    // 移动文章
    moveArticle(data) {
        return request({
            url: '/cms/article/remove',
            data
        })
    },

    // 复制文章
    copyArticle(data) {
        return request({
            url: '/cms/article/copy',
            data
        })
    },

    // 共享文章
    quoteArticle(data) {
        return request({
            url: '/cms/article/share',
            data
        })
    },

    // 发布文章
    releaseArticle(data) {
        return request({
            url: '/cms/article/release',
            data
        })
    },

    customArticle(data) {
        return request({
            url: '/cms/form/data/release',
            data
        })
    },
     

    // 删除文章
    deleteArticle(data) {
        return request({
            url: '/cms/article/delete',
            data
        })
    },
    // 审核撤回
    auditCancel(data) {
        return request({
            url: '/cms/form/data/audit/cancel',
            data
        })
    },
    // 催办数据
    auditeViewer(data) {
        return request({
            url: '/cms/form/data/audit/reviewer',
            data
        })
    },
    // 催办确认
    auditNotice(data) {
        return request({
            url: '/cms/form/data/audit/notice',
            data
        })
    },


    // 获取文章回收站列表
    getArticleRecycleList(data) {
        return request({
            url: '/cms/form/data/recycle/list',
            data
        })
    },

    // 操作文章回收站
    operationRecycleArticle(data) {
        return request({
            url: '/cms/form/data/recycle/opt',
            data
        })
    },

    // 校对
    collation(data) {
        return request({
            url: '/cms/monitor/content/colation',
            data
        })
    },

    // 替换热词
    replaceHotword(data) {
        return request({
            url: '/cms/hotword/swap',
            data
        })
    },

    //文章审核
    articleAudit(data) {
        return request({
            url: '/cms/article/audit',
            data
        })
    },

    //流程追踪
    processTrace(url, data) {
        return request({
            url,
            data,
            method: 'get'
        })
    },
    //撤稿
    revoke(data) {
        return request({
            url: '/cms/article/revoke',
            data
        })
    },

    //文章跨站分享
    crossShare(data) {
        return request({
            url: '/cms/article/crossShare',
            data
        })
    },

    // 获取频道列表
    getChannelList(data) {
        return request({
            url: '/cms/channel/list',
            data
        })
    },
    // 排序
    getSort(data) {
        return request({
            url: '/cms/article/sort',
            data
        })
    },
    getCurrent(data) {
        return request({
            url: '/cms/form/data/struct',
            data
        })
    },
    currentList(data) {
        return request({
            url: 'cms/form/data/list',
            data
        })
    },
    saveCustomArticle(data) {
        return request({
            url: 'cms/form/data/save',
            data
        })
    },
    currenDel(data) {
        return request({
            url: 'cms/form/data/del',
            data
        })
    },
    // 自定义排序
    sortingB(data) {
        return request({
            url: 'cms/form/data/all',
            data
        })
    },
    customDetail(data) {
        return request({
            url: 'cms/form/data/detail',
            data
        })
    },
    directPublish(data) {
        return request({
            url: 'cms/form/data/publish',
            data
        })
    },

    auditPublish(data) {
        return request({
            url: 'cms/form/data/publish-check',
            data
        })
    },

    getSharelist(data) {
        return request({
            url: 'cms/article/share/list',
            data
        })
    },
    // 获取版本
    getVersionlist(data) {
        return request({
            url: 'cms/article/version/list',
            data
        })
    },
    // 获取发布流程类型
    getfFlowlist(data) {
        return request({
            url: 'cms/flow/channel-list',
            data
        })
    },
    // 上传文件（附件）
    getUploaderSave(data) {
        return request({
            url: 'cms/attach/upload/file',
            data
        })
    }

}
