import pathToRegexp from 'path-to-regexp'
import { saveVersions, loadVersions } from '../utils/ServiceUtil'
import { isEmpty, isPlainObject } from '../utils/BaseUtil'
import store from '../store'
import { excludeVersionApis as excludes } from '../setting'
// 权限数据版本控制
const permissionHandler = function (newVersion, oldVersion) {
    if (newVersion !== oldVersion) {
        return store.dispatch('authen/reloadRights')
    }
    return Promise.resolve({ message: 'Permission nothing to upgrade' })
}

const dictHandler = function (newVersion, oldVersion) {
    if (newVersion !== oldVersion) {
        return store.dispatch('authen/reloadDictionary')
    }
    return Promise.resolve({ message: 'Dictionary nothing to upgrade' })
}

const VersionControl = {
    test(requestURI) {
        for (let i = 0; i < excludes.length; i++) {
            const exec = pathToRegexp(excludes[i]).test(requestURI)
            if (exec) {
                // 匹配成功
                return true
            }
        }
        return false
    },
    handlers: {
        permission: permissionHandler,
        dictionary: dictHandler
    },
    handle(requestURI, newVersions) {
        if (this.test(requestURI)) {
            if (newVersions && !isEmpty(newVersions)) {
                // 存储新的数据版本信息
                saveVersions(newVersions)
            }
            return Promise.resolve('无需版本更新')
        }

        if (!isPlainObject(newVersions)) {

            return Promise.reject(new Error('data version need plain object'))
        }

        if (isEmpty(newVersions)) {
            // 无需处理
            return Promise.resolve({ message: '无需版本更新' })
        }/*

        if (this.test(requestURI)) {
            if (newVersions) {
                // 存储新的数据版本信息
                saveVersions(newVersions)
            }
            // 无需处理
            return Promise.resolve({ message: '无需版本更新' })
        } */



        const oldVersions = loadVersions()
        const handlers = this.handlers

        const validHandlers = []
        for (let version in newVersions) {
            if (!handlers[version]) {
                // 不存在就不用处理
                continue
            }
            const versionHandler = handlers[version]

            validHandlers.push(versionHandler(newVersions[version], oldVersions[version]))
        }

        return Promise.all(validHandlers).then(response => {
            // 存储新的数据版本信息
            saveVersions(newVersions)

            return Promise.resolve(response)
        })
    }
}

export default VersionControl
