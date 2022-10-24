/**
 * CMS 拦截器处理
 */
import pathToRegexp from 'path-to-regexp'
import store from '../store'
// import qs from 'qs'
import { siteIdApis } from '../setting'
import { isPlainObject } from '../utils/BaseUtil'
const axiosUtils = require('axios/lib/utils')
const isMatchCmsApi = (url) => {
    return siteIdApis.some(api => pathToRegexp(api).test(url))
}
const setId = (config) => {
    if (isMatchCmsApi(config.url)) {
        // 添加siteId
        const appid = (store.getters['cms/site/site'] || {}).id || ''
        const transformRequest = config.transformRequest
        config.transformRequest = (data, headers) => {
            const id = data.appid ? data.appid : appid
            if (axiosUtils.isFormData(data) || axiosUtils.isURLSearchParams(data)) {
                data.append('appid', id)
            } else if (isPlainObject(data)) {
                data['appid'] = id
            }
            return transformRequest(data, headers)
        }
    }
}

export default (api) => {
    api.interceptors.request.use(config => {
        // 设置站点ID
        setId(config)
        return config
    })
}
