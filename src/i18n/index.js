import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { cookie } from '../utils/WebStore'
import { LANGUAGE } from '../utils/Const'
import { isEmpty } from '../utils/BaseUtil'

Vue.use(VueI18n)

/**
 *  获取所有的语言包
 *  用法
 *     模板中:  $t('title')
 *     实例： this.$t('title')
 */
const resolveMessages = function () {
    const localMessages = {}
    const context = require.context('./languages', true, /\.js$/)
    context.keys().forEach(localeMessageFile => {
        const localeMessage = context(localeMessageFile)
        const localeName = localeMessageFile.replace(/^(.*\/)?([^/]+).js$/, '$2')
        const __name__ = localeMessage.__name__ || localeName
        const _localeMessage = localeMessage.default || localeMessage || {}
        localMessages[localeName.toLowerCase()] = { ..._localeMessage, __name__ }
    })
    return localMessages
}

/**
 * 适配其他国际化语言
 * @param {*} messages
 */
const adapter = messages => {
    const localeAdapterContext = require.context('./adapters', true, /\.js$/)
    localeAdapterContext.keys().forEach(adapterFile => {
        const _localeAdapter = localeAdapterContext(adapterFile)
        const localeAdapter = _localeAdapter.default || _localeAdapter
        if (isEmpty(localeAdapter)) {
            return
        }
        if (!(localeAdapter instanceof Function)) {
            throw new Error(`locale message adapter must be export function`)
        }
        localeAdapter(messages)
    })
}

// 解析所有国际化语言
const messages = resolveMessages()
// 适配其他国际化语言
adapter(messages)

const getLanguage = () => {
    let _locale = cookie.get(LANGUAGE)
    if (_locale) {
        return _locale
    }

    _locale = (navigator.language || navigator.browserLanguage).toLowerCase()
    const locales = Object.keys(messages)
    for (const locale of locales) {
        if (_locale.indexOf(locale) > -1) {
            return locale
        }
    }
    return 'zh-cn'
}

const i18n = new VueI18n({
    // set locale
    // options: zh-cn | zh | es
    locale: getLanguage(),
    // suppress localization fail warnings
    silentTranslationWarn: true,
    // set locale messages
    messages
})


export default i18n
