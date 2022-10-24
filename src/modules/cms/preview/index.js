/**
 * 预览
 */
import Request from '@/request'
import { openLink } from '@/utils/BaseUtil'
import { showLoading, showError } from '@/utils'
// import store from '@/store'

// 站点预览地址
const SITE_PREVIEW_URL = '/cms/app/preview'             // '/preview/{appid}/html/index.html'
// 频道预览地址
const CHANNEL_PREVIEW_URL = '/cms/channel/preview'      // '/preview/{appid}/html/{channelId}/index{pageNo}.html'
// 文章预览地址
const ARTICLE_PREVIEW_URL = '/cms/article/preview'      // '/preview/{appid}/html/{channelId}/detail{articleId}.html'
// 自定义文章预览
const CUSTOM_PREVIEW_URL = '/cms/form/data/preview'

const preview = (url, target) => {
    openLink(url, target)
}

/* const getAppId = () => {
    return (store.state['cms/site']['site'] || {}).id || ''
} */
/**
 * 加载预览地址
 * @param {*} url
 * @param {*} params
 */
const loadPreviewURL = (url, params = {}) => {
    showLoading(true, '正在生成预览...')
    return Request.post(url, params).then(response => {
        showLoading(false)
        const rest = response.data
        if (rest.success) {
            return Promise.resolve(rest.data)
        }
        return Promise.reject(new Error(rest.errMsg))
    }).catch(error => {
        showLoading(false)
        showError(error.message || '预览失败')
    })
}
/**
 * 中宏预览路径解析
 * 路径中在preview后面加上 /zh_渠道名称
 * @param {*} value 路径
 * @param {*} channlelName 渠道名称
 */
const loadCustomUrl = (value, channlelName='') => {
    let arr = value.split('/')
    // 如果名称中有/ 就转换成@
    let str = channlelName.replace('/', '@')
    arr.splice(2, 1, `${arr[2]}_${str}`)
    let _url = arr.join('/')
    return _url
}

/**
 * 预览站点
 * @param {*} appid 站点ID
 * @param {*} target 同 a 标签target
 */
export const previewApp = (appid, target) => {
    loadPreviewURL(SITE_PREVIEW_URL, { id: appid }).then(link => {
        preview(link, target)
    })
}

/**
 * 预览频道
 * @param {*} channelId 频道ID
 * @param {*} target  同 a 标签target
 */
export const previewChannel = (channelId = '', target) => {
    loadPreviewURL(CHANNEL_PREVIEW_URL, { id: channelId }).then(link => {
        preview(link, target)
    })
}
/**
 * 移动端预览频道
 * @param {*} channelId 频道ID
 * @param {*} target  同 a 标签target
 */
export const previewMobileChannel = (channelId = '', target) => {
    return loadPreviewURL(CHANNEL_PREVIEW_URL, { id: channelId }).then(link => {
        if(link){
            return Promise.resolve({ success: true, link: link })
            // preview(link, target)
        } else {
            return Promise.reject({ success: false, link: '' })
        }
    })
}

/**
 * 预览文章
 * @param {*} channelId  频道Id
 * @param {*} articleId 文章Id
 * @param {*} target   同 a 标签target
 */
export const previewArticle = (channelId = '', articleId = '', target) => {
    loadPreviewURL(ARTICLE_PREVIEW_URL, { channelId, id: articleId }).then(link => {
        if(link){
            preview(link, target)
        }
    })
}
/**
 * 预览自定义文章
 * @param {*} channelId  频道Id
 * @param {*} formId    表单ID
 * @param {*} dataId 文章Id
 * @param {*} target   同 a 标签target
 */
export const previewCustom = (channelId = '',formId = '', dataId = '', target) => {
    loadPreviewURL(CUSTOM_PREVIEW_URL, { channelId, dataId,formId }).then(link => {
        if(link){
            preview(link, target)
        }
    })
}


/**
 * 中宏预览自定义产品文章
 * @param {*} channelId  频道Id
 * @param {*} formId    表单ID
 * @param {*} dataId 文章Id
 * @param {*} target   同 a 标签target
 * @param {*} channlelName 频道名称
 * @param {*} parentId 父频道id
 */
export const NewPreviewCustom = (data) => {  
    let { channelId = '',formId = '', dataId = '', target, channlelName='', parentId='' } = data
    loadPreviewURL(CUSTOM_PREVIEW_URL, { channelId, dataId,formId }).then(link => {
        if(link){
            // let _url = loadCustomUrl(link, channlel  Name)
            let include = [293, 296, 412]
            // 293 产品频道 296产品下的健康保障
            // 产品下的链接字段拼接
            let _url = link // include.includes(parentId) ? `${link}?pid=${dataId}&id=${channelId}` : link
            preview(_url, target)
        }
    })
}

/**
 * 预览 移动端文章
 * @param {*} channelId  频道Id
 * @param {*} formId    表单ID
 * @param {*} dataId 文章Id
 * @param {*} target   同 a 标签target
 */
export const previewCustomMobile = (channelId = '',formId = '', dataId = '') => {
    return loadPreviewURL(CUSTOM_PREVIEW_URL, { channelId, dataId,formId }).then(link => {
        if(link){
            return Promise.resolve({ success: true, link: link })
            // preview(link, target)
        } else {
            return Promise.reject({ success: false, link: '' })
        }
    })
}