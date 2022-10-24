import zhCN from './translations/zh-CN'
const zhCNTranslate = (template, replacements) => {

    replacements = replacements || {}

    // translate
    template = zhCN[template] || template
    // console.log(template)
    // replace
    return template.replace(/{([^}]+)}/g, (_, key) => {
        const _template = replacements[key] || '{' + key + '}'
        return zhCN[_template] || _template
    })
}

export default {
    translate: ['value', zhCNTranslate]
}
