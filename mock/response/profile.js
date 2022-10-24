import ResponseBody from '../responseBody'
import { responseData } from './login'
export default [
    {
        url: '/my/info',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(responseData.data)
            return responseBody.response(req)
        }
    },
    {
        url: '/my/save',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(responseData.data)
            return responseBody.response(req)
        }
    },
    {
        url: '/my/passwd',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(responseData.data)
            return responseBody.response(req)
        }
    }
]
