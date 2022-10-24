import zhCN from 'element-ui/lib/locale/lang/zh-CN'
import en from 'element-ui/lib/locale/lang/en'
const elementI18n = {
    'zh-cn': zhCN,
    en: en
}
// Element 国际化语言适配
module.exports = (messages = {}) => {
    Object.keys(elementI18n).forEach(locale => {
        if (messages[locale]) {
            Object.assign(messages[locale], elementI18n[locale])
        } else {
            messages[locale] = elementI18n[locale]
        }
    })
}
