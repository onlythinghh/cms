import Request from '@/request'
import { showLoading, showMessage } from '@/utils'

const request = ({ method = 'post', url, data = {} } = {}) => {
    return Request[method](url, data).then(res => {
        if (res.data.success) {
            return Promise.resolve(res)
        } else {
            const errMsg = res.data.errMsg || '服务器出现异常'
            showLoading(false)
            showMessage({
                type: 'error',
                message: errMsg
            })
            return Promise.reject({ message: errMsg })
        }
    })
}

export default request
