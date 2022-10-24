/**
 * 业务工具方法
 */
import { isEmpty } from './BaseUtil'
import { session, local } from './WebStore'
import { AESHelper } from './CryptUtil'

const USERINFO = 'userinfo'
const RIGHTS = 'rights'
const VERSION = 'versions'
const LAST_LOGIN_ACCOUNT = 'lastLogin'
const DICTIONARY = 'DICTIONARY'
const SITE = 'SITE'

/**
 * 需要重新登录的状态码
 */
export const NEED_TO_LOGIN_CODE = '401'

export const REDIRECT_CODE = '302'

/**
 * 登录简易路由
 */
export const loginRoute = {
    path: '/login',
    name: 'Login'
}
/**
 * 退出简易路由
 */
export const logoutRoute = {
    path: '/logout',
    name: 'Logout'
}
/**
 * 404 路由
 */
export const notFoundRoute = {
    path: '/404',
    name: '404'
}
/**
 * 没有权限访问路由
 */
export const forbiddenRoute = {
    path: '/forbidden',
    name: 'Forbidden'
}

/**
 * 快速登录路由
 */
export const simpleLoginRout = {
    path: '/simpleLogin',
    name: 'simpleLogin'
}

/**
 * 默认页
 */
export const defaultRoute = {
    path: '/'
}
/**
 * 保存用户信息 AES 加密存储 该方法是耗时方法，请勿频繁调用
 * @param {*} userinfo
 */
export const saveUserinfo = (userinfo = {}) => {
    if (isEmpty(userinfo)) {
        return
    }
    session.set(USERINFO, AESHelper.encrypt(JSON.stringify(userinfo)), false)
}

/**
 * 加载保存的用户信息 AES解密 该方法是耗时方法，请勿频繁调用
 */
export const loadUserinfo = () => {
    try {
        return JSON.parse(AESHelper.decrypt(session.get(USERINFO, false)) || '{}')
    } catch (error) {
        console.error('用户信息加载失败', error)
        return {}
    }
}

/**
 * 保存权限信息  AES 加密存储 该方法是耗时方法，请勿频繁调用
 * @param {*} rights
 */
export const saveRights = (rights = {}) => {
    if (isEmpty(rights)) {
        return
    }
    session.set(RIGHTS, AESHelper.encrypt(JSON.stringify(rights)), false)
}

/**
 * 加载权限信息 AES解密 该方法是耗时方法，请勿频繁调用
 */
export const loadRights = () => {
    try {
        return JSON.parse(AESHelper.decrypt(session.get(RIGHTS, false)) || '{}')
    } catch (error) {
        console.error('权限信息加载失败', error)
        return {}
    }
}

/**
 * 保存版本号信息
 * @param {*} version
 */
export const saveVersions = (version = {}) => {
    if (isEmpty(version)) {
        return
    }
    session.set(VERSION, version)
}

/**
 * 加载版本号信息
 */
export const loadVersions = () => {
    try {
        return session.get(VERSION) || {}
    } catch (error) {
        console.error(error)
        return {}
    }
}

export const saveLastLoginAccount = (account = '') => {
    if (isEmpty(account)) {
        return
    }
    local.set(LAST_LOGIN_ACCOUNT, account)
}

export const loadLastLoginAccount = () => {
    try {
        return local.get(LAST_LOGIN_ACCOUNT) || ''
    } catch (error) {
        console.error(error)
        return ''
    }
}

export const loadDictionary = () => {
    try {
        return session.get(DICTIONARY) || {}
    } catch (error) {
        console.error(error)
        return {}
    }
}
export const saveDictionary = (dicts = {}) => {
    if (isEmpty(dicts)) {
        return
    }
    session.set(DICTIONARY, dicts)
}

export const logout = () => {
    session.clear()
}

export const saveSite = ({ id, name, authString }) => {
    if (!id || !name || !authString ) {
        return
    }
    session.set(SITE, { id, name, authString })
}

export const getSite = () => {
    try {
        return session.get(SITE) || {}
    } catch (error) {
        console.error(error)
        return {}
    }
}
