import Request from '../../../request'
import { BASE64Helper } from '../../../utils/CryptUtil'
const actions = {
    saveProfile({ commit }, userinfo) {
        const username = userinfo.username
        return Request.post('/my/save', { username }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    savePasswd({ commit }, params) {
        params = {
            pcode: BASE64Helper.encode(params.passwd),
            repasswd: BASE64Helper.encode(params.repasswd),

        }
        return Request.post('/my/passwd', params)
    }
}
export default { actions }
