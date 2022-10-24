import Axios from 'axios';
import qs from 'qs';
import { BASE64Helper } from '../utils/CryptUtil';

const axiosUtils = require('axios/lib/utils');
const normalizeHeaderName = require('axios/lib/helpers/normalizeHeaderName');

const isRequestTimeout = (error) => {
    return error && (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1)
}
const isNotFound = (error) => {
    return error && (error.code === 404 || (error.response && error.response.status === 404))
}

const axiosCustomOptions = {
    timeout: 60000, // 60s
    retry: 0,
    retryDelay: 500,
    shouldRetry: error => isRequestTimeout(error), // 超时重试,
    cancelMultiple: true,
    debug: process.env.NODE_ENV !== 'production',
};


function setContentTypeIfUnset(headers, value) {
    if (!axiosUtils.isUndefined(headers) && axiosUtils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
    }
}
const axiosInstance = Axios.create({
    // baseURL: process.env.REQUEST_BASE_API,
    ...axiosCustomOptions,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Content-Type');
        if (axiosUtils.isFormData(data)
            || axiosUtils.isArrayBuffer(data)
            || axiosUtils.isBuffer(data)
            || axiosUtils.isStream(data)
            || axiosUtils.isFile(data)
            || axiosUtils.isBlob(data)
        ) {
            return data;
        }
        if (axiosUtils.isArrayBufferView(data)) {
            return data.buffer;
        }
        if (axiosUtils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            return data.toString();
        }
        /* if (utils.isObject(data)) {
            setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
            return JSON.stringify(data);
        } */
        if (headers['Content-Type'].search('application/json') !== -1) {
            return JSON.stringify(data);
        }
        return qs.stringify(data);
    },
});
axiosInstance.all = Axios.all
const { CancelToken } = Axios;


// 重复请求处理
const axiosRepeatRequest = {
    requests: {},
    generateRequestId(config) {
        const method = (config.method || 'get').toLowerCase();
        const encodeData = config.data ? BASE64Helper.encode(config.data) : ''
        return `${config.baseURL}${config.url}_${method}_${encodeData}`;
    },
    clear(config) {
        const requestId = config.requestId
        delete this.requests[requestId]
        delete config.cancelToken
        delete config.requestId
    },
    handler(config, cancel, isRemoveRightNow) {
        if (!config.cancelMultiple) {
            return
        }
        const requestId = config.requestId ? config.requestId : axiosRepeatRequest.generateRequestId(config)
        config.requestId = requestId

        if (this.requests[requestId]) {
            // 请求存在
            const axiosRequest = this.requests[requestId]
            if (isRemoveRightNow) {
                this.clear(config)
                delete config.retryCount
            } else if (axiosRequest.start + config.timeout + config.retryDelay + 200 - (+new Date()) < 0) {
                // 超过了某个时间 ， 自动丢弃上次请求 允许此次请求
                this.clear(config)
                delete config.retryCount
            } else {
                // 取消上次请求
                axiosRequest.cancel(`request [${config.method}] ${config.url} request is Duplicate and Canceled !`)
                // 取消后直接移除
                this.clear(config)
            }
        } else {
            !!cancel && (this.requests[requestId] = { start: +new Date(), cancel })
        }
    },
};

//  request拦截器的执行顺序是: 先加入后执行
//  response拦截器执行顺序是: 先加入的先执行

axiosInstance.interceptors.request.use((config) => {


    if (config.cancelMultiple) {
        // 处理重试参数
        config.retry = axiosUtils.isNumber(Number(config.retry)) ? Number(config.retry) : false;
        config.retryDelay = axiosUtils.isNumber(Number(config.retryDelay)) ? Number(config.retryDelay) : 0;
        config.shouldRetry = axiosUtils.isFunction(config.shouldRetry) ? config.shouldRetry : axiosCustomOptions.shouldRetry;

        // 重复请求处理
        axiosRepeatRequest.handler(config)
        // 防重复请求处理
        config.cancelToken = new CancelToken((cancel) => {
            axiosRepeatRequest.handler(config, cancel)
        })
    }
    config.debug
    // config.debug && console.log('%c Request', 'color:red', `[${config.method}]`, `${config.url}`, 'sending...')
    return config
}, (error) => {
    console.error(error)
    return Promise.reject(error)
});


axiosInstance.interceptors.response.use((response) => {
    const { config } = response
    // 请求完成 移除
    axiosRepeatRequest.handler(config, null, true)

    config.debug
    // config.debug && console.log('%c Response', 'color:red', `[${config.method}]`, `${config.url}`, '成功')

    return response;
}, (error) => {
    const { config = {} } = error
    if (Axios.isCancel(error)) {
        console.warn(error.message)
        // 请求完成 移除
        axiosRepeatRequest.handler(config, null, true);

        // Break Promise Chain
        // return new Promise(() => { })
        return Promise.reject(error)
    }

    if (!config.retry) {
        // 请求完成 移除
        axiosRepeatRequest.handler(config, null, true);

        return Promise.reject(error);
    }


    // 默认超时重试
    if (config.retry && config.shouldRetry(error)) {
        config.retryCount = config.retryCount || 0
        if (config.retryCount >= config.retry) {
            // 请求完成 移除
            axiosRepeatRequest.handler(config, null, true);

            return Promise.reject(error)
        }
        config.retryCount += 1

        // console.info('%c Retry request', 'color:red', `[${config.method}]`, ` [${config.url}] times [${config.retryCount}]`);

        const retryRequest = new Promise((resolve) => {
            setTimeout(() => resolve(), config.retryDelay);
        });

        return retryRequest.then(() => {
            // baseURL 设置为空，防止重试机制重复设置 baseURL
            const retryConfig = { ...config, baseURL: '' }
            return axiosInstance.request(retryConfig)
        });
    }
    // 请求完成 移除
    axiosRepeatRequest.handler(config, null, true);

    return Promise.reject(error);
});
axiosInstance.json = (...args) => {
    const url = args[0] || ''
    const data = args[1] || {}
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (args.length >= 3) {
        const headers = args[3].headers || {}
        config.headers = { ...headers, ...config.headers }
        config = { ...args[3], ...config }
    }
    return axiosInstance.post(url, data, config)
}
export default axiosInstance;
export { isRequestTimeout, isNotFound }
