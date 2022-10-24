import store from '../store'
import { deepCopy } from './BaseUtil'

// 站点类型字典key
export const SITE_TYPE = 'siteType'
// 发布类型字典key
export const PUBLISH_TYPE = 'publishType'
// 模板类型字典key
export const TEMPLATE_TYPE = 'templateType'

// 文章类型字典key
export const ARTICLE_TYPE = 'articleType'

// 文章状态字典key
export const ARTICLE_STATUS = 'articleStatus'

// 链接类型字典key
export const LINK_TARGER = 'linkTarget'


/**
 * 获取所有的数据字典
 */
export const loadDictionaries = () => {
    const dictionaries = store.authen.getters.dictionaries
    return deepCopy(dictionaries)
}

/**
 * 根据key获取特定的数据字典
 * @param {*} val  字符串或数组
 */
export const loadDictionary = (val = "") => {
    return store.authen.getters.getDictionary(val)
}
