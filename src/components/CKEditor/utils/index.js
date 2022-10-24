export const debounce = (fn, wait, timer) => {
    return function () {
        window[timer] && clearTimeout(window[timer])
        window[timer] = setTimeout(fn, wait)
    }
}

export const isPlainObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
