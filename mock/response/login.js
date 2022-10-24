// import Mock from 'mockjs'

import { BASE64Helper } from '../../src/utils/CryptUtil'
import ResponseBody from '../responseBody'
import fs from 'fs'
import path from 'path'

const responseData = require('./data/LoginData.json')
class Login extends ResponseBody {
    getData(req) {
        const { account, password } = req.body
        const pwds = BASE64Helper.decode(password)
        if (account !== 'Micro') {
            this.setSuccess(false)
            this.setErrMsg('用户不存在, 请输入模拟用户: Micro')
        } else if (pwds !== '123456') {
            this.setSuccess(false)
            this.setErrMsg('密码错误, 请输入模拟密码：123456')
        } else {
            responseData.token = "wxdEr32322IOIS909SD999xxsiusdus"
            return responseData
        }
    }
}
export default [
    {
        url: '/login',
        type: 'post',
        response: (req) => {
            return new Login().response(req)
        }
    },
    {
        url: '/capt',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData('/api/capt?token=1234567')
            return responseBody.response(req)
        }
    },
    {
        url: '/capt',
        type: 'get',
        response: (req, res) => {
            const vscodePath = path.resolve(__dirname, 'images/vscode.jpg')
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            var stream = fs.createReadStream(vscodePath)
            stream.pipe(res)
        }
    }
]
export { responseData }


