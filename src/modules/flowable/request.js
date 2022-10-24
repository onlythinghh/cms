import qs from 'qs'
import toRegexp from 'path-to-regexp'
import request from '@/request'
// const PROCESS_API_BASE = '/process-api'

const processApiRegexp = toRegexp('(.*)/flowable(.*)')

const isPagination = (data) => {
    return (data.start !== undefined || data.total !== undefined)
}
const transformData = (response) => {
    const rest = {
        code: response.status
    }
    if ((response.status >= 200 && response.status < 300) || response.status === 304) {
        if (response.data.statusCode) {
            rest.success = false
            rest.code = response.data.statusCode
            rest.errMsg = response.data.errorMessage
        } else {
            rest.success = true
            rest.errMsg = ''

            if (isPagination(response.data)) {
                const { data, ...res } = response.data
                Object.assign(rest, { data, ...res })
            } else {
                rest.data = response.data
            }
        }
    } else {
        rest.success = false
        rest.errMsg = '服务器异常'
    }
    return rest
}

request.interceptors.response.use(response => {
    const { config } = response
    const url = config.url
    if (processApiRegexp.test(url)) {
        response.data = transformData(response)
    }
    return response
}, error => {
    if (error.response) {
        const { message } = error.response.data
        return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
})

// const addProcessBaseURL = (config) => {
//     // Object.assign(config, { baseURL: PROCESS_API_BASE })
// }
const skipEmpty = (data) => {
    const target = {}
    Object.keys(data).forEach(key => {
        if (data[key]) {
            target[key] = data[key]
        }
    })
    return target
}
export const toStart = (page = 1, size = 10) => {
    if (page <= 0) {
        return 0
    }
    return (page - 1) * size
}

export const toQueryString = (data) => {
    return qs.stringify(skipEmpty(data), { skipNulls: true })
}
export const get = (url, config = {}) => {
    return request.get(url, config)
}

export const post = (url, data, config = {}) => {
    return request.post(url, data, config)
}

export const put = (url, data, config = {}) => {
    return request.put(url, data, config)
}

export const del = (url, config = {}) => {
    return request.delete(url, config)
}
const json = (config = {}) => {
    let _config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
    if (config) {
        const headers = config.headers || {}
        _config.headers = { ...headers, ..._config.headers }
        _config = { ...config, ..._config }
    }
    return request(_config)
}
export const getJSON = (url, config = {}) => {
    config.url = url
    config.method = 'get'
    return json(config)
}
export const postJSON = (url, data, config = {}) => {
    config.url = url
    config.data = data || {}
    config.method = 'post'
    return json(config)
}
export const putJSON = (url, data, config = {}) => {
    config.url = url
    config.data = data || {}
    config.method = 'put'
    return json(config)
}
