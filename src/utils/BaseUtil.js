import moment from 'moment'
export const dateFormat = function (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(fmt)
}
export function fromNow(date = 0) {
    return moment(date).fromNow()
}
export const dateDuration = (time = 0) => {
    if (time <= 0) {
        return 0
    }
    let str = []
    // 计算相差的天数
    const days = Math.floor(time / (24 * 3600 * 1000))

    let diff = time % (24 * 3600 * 1000)
    // 计算相差的小时
    const hours = Math.floor(diff / (3600 * 1000))

    diff = diff % (3600 * 1000)
    // 计算相差的分钟
    const minutes = Math.floor(diff / (60 * 10000))

    diff = diff % (60 * 1000)
    // 计算相差的秒
    const seconds = Math.round(diff / 1000)

    if (days > 0) {
        str.push(days + '天')
    }
    if (hours > 0) {
        str.push(hours + '小时')
    }
    if (minutes > 0) {
        str.push(minutes + '分钟')
    }
    if (seconds > 0) {
        str.push(seconds + '秒')
    }
    return str.join(' ')


}
export function pathNormalize(path) {
    if (!path) return '/'
    if (!isString(path)) {
        throw new Error('path must be string')
    }
    return '/' + path.split(/\.+\//).filter(p => !!p).join('/').split('/').filter(p => !!p).join('/')

}
/**
 * 首字母大写
 * @param {*} str
 */
export function capitalize(str) {
    if (!str) return ''
    str = str.toString()
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 首字母小写
 * @param {*} str
 */
export function uppercaseFirst(str) {
    if (!str) return ''
    str = str.toString()
    return str.charAt(0).toLowerCase() + str.slice(1)
}


/**
 * 深度拷贝
 */
export function deepCopy(obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    /* const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    } */

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    /* cache.push({
        // original: obj,
        copy,
    }) */

    Object.keys(obj).forEach((key) => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy
}

/**
 * 节流
 */
export const throttle = function (fn, delay = 50, isThrottle = true, _this) {
    let lastime = 0
    let timer
    return function () {
        const now = +new Date()
        const args = arguments
        if (!isThrottle) {
            fn.apply(_this, args)
            return
        }
        if (lastime && lastime < now + delay) {
            !timer && (timer = setTimeout(() => {
                clearTimeout(timer)
                lastime = now
                timer = null
                fn.apply(_this, args)
            }, delay))
        } else {
            clearTimeout(timer)
            lastime = now
            fn.apply(_this, args)
        }
    }
}

/**
 * 防抖
 */
export const debounce = (fn, delay = 50, isDebounce = false, _this) => {
    // [delay]毫秒之后执行异步，若[delay]毫秒内多次触发重新计时
    let timer
    return function () {
        const args = arguments
        if (isDebounce) {
            timer && clearTimeout(timer)

            timer = setTimeout(() => {
                fn.apply(_this, args)
            }, delay)
        } else {
            fn.apply(_this, args)
        }
    }
}

/**
 * 是否是数组
 */
export const isArray = array => Array.isArray(array)

/**
 * 是否是字符串
 */
export const isString = (obj) => typeof obj === 'string'

/**
 * 是否是对象
 */
export const isPlainObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
export const isBoolean = (obj) => {
    return typeof obj === 'boolean'
}
/**
 * 是否为空判断
 */
export const isEmpty = (obj) => {
    if (!obj) {
        return true
    }
    if (isString(obj) && obj.length === 0) {
        return true
    }

    if (isArray(obj) && obj.length === 0) {
        return true
    }
    if (isPlainObject(obj)) {
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                return false
            }
        }
        return true
    }
    return false

}

/**
 * 判断是否是Date 日期类型
 */
export const isDate = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Date]'
}

export const isNumber = (obj) => {
    return typeof obj === 'number'
}

/**
 * 下载文件
 * @param {*} data  Blob二进制数据
 * @param {*} param1  文件名
 */
export const downloadByBlob = (data, { filename }) => {
    const blob = new Blob([data])
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
    } else {
        // 非IE 下载
        const url = URL.createObjectURL(blob);
        downloadByURL(url, { filename })
    }
}
/**
 * 文件下载
 * @param {*} url 下载连接
 * @param {*} param1  文件命
 */
export const downloadByURL = (url, { filename }) => {
    const link = document.createElement('a')
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', false, false)
    link.href = `${url}`
    link.target = '_blank'
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    // 释放URL 对象
    window.URL.revokeObjectURL(link.href)
}

/**
 * 去掉路由中的参数 ? 参数
 * @param {*} route
 */
export const getRouteNoQuery = (route = '') => {
    if (route.indexOf('?') > -1) {
        route = route.substr(0, route.indexOf('?'))
    }
    return route
}

/**
 * 模拟a标签打开网站
 * @param {*} url 同 a 标签href
 * @param {*} target  同 a 标签 target 默认 _blank
 */
export const openLink = (url, target = '_blank') => {
    const link = document.createElement('a')
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', false, false)
    link.href = `${url}`
    link.target = target
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    // 释放URL 对象
    window.URL.revokeObjectURL(link.href)
}

/**
 * 获取链接上指定的参数 ?id=123
 * @param {*} name 要获取的参数名
 * @returns queryUrlString('id') > 123
 */
export const queryUrlString = (name) => {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  }

export const formatDecimal = (str, num=20) => {//str当前输入值，num是想要保留的小数位数
    str = String(str)
    if (!str.trim()) {
        return str
    }
    let len1 = str.substr(0, 1)
    let len2 = str.substr(1, 1)
    // 如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && len1 === 0 && len2 !== '.') {
        str = str.substr(1, 1)
    }
    // 第一位不能是.
    if (len1 === '.') {
        str = ''
    }
    // 限制只能输入一个小数点
    if (str.indexOf('.') !== -1) {
        let str_ = str.substr(str.indexOf('.') + 1)
        if (str_.indexOf('.') !== -1) {
        str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
        }
    }
    // 正则替换
    str = str.replace(/[^\d^.]+/g, '') // 保留数字和小数点
    if (num || num === 0) {
        let rest = str.split('.')[1]
        if (rest && rest.length > num) {
            rest = rest.substr(0, num)
            str = str.split('.')[0] + '.' + rest
        }
    }
    return str
}