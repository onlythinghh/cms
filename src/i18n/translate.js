import i18n from './index'
import { isPlainObject } from '../utils/BaseUtil'

/**
 * 单个翻译
 * @param {*} newMessage  单个字符串或对象
 */
const translate = newMessage => {
    let _newMessage
    if (typeof newMessage === 'string') {
        _newMessage = {}
        _newMessage[newMessage] = newMessage
    } else if (isPlainObject(newMessage)) {
        _newMessage = newMessage
    } else {
        throw new Error('new translate must be string or plain object')
    }
    const messages = i18n._getMessages()
    Object.keys(messages).forEach(localeName => {
        const localMessage = messages[localeName] || {}
        const newLocalMessage = { ...localMessage, _newMessage }
        i18n.setLocaleMessage(localeName, newLocalMessage)
    })
}

/**
 * 多组翻译
 * @param {*} newMessages
 *{
    'zh-cn':{
        name: '名称'
        ...
    },
    'en':{
        name: 'Last Name',
        ...
    }
 *}
 */
const translates = newMessages => {
    if (!isPlainObject(newMessages)) {
        throw new Error(`
            new translates must be like \n{
                'zh-cn':{
                    name: '名称'
                    ...
                },
                'en':{
                    name: 'Last Name',
                    ...
                }
            }
        `)
    }
    const messages = i18n._getMessages()
    Object.keys(newMessages).forEach((localeName = '') => {
        if (!isPlainObject(newMessages[localeName])) {
            throw new Error(`${localeName} message body must be plain object`)
        }
        const _localeName = localeName.toLowerCase()
        let newMessage = {}
        if (messages[_localeName]) {
            newMessage = { ...messages[_localeName], ...newMessages[localeName] }
        } else {
            newMessage = newMessages[localeName]
        }
        i18n.setLocaleMessage(_localeName, newMessage)
    })
}

export default {
    translate,
    translates
}
