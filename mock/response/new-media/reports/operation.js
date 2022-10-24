import ResponseBody from '../../../responseBody'
import Mockjs from 'mockjs'
const MRandom = Mockjs.Random
const data = {
    'list|10': [
        {
            'mediaChannelCode|1': [
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
            ],
            'mediaChannelName|1': [
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
            ],
            'accountId|1': [
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
            ],
            'accountName|1': [
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
            ],
            'viewCount|1': [
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
            ],
            'commentCount|1': [
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
            ],
            'repostCount|1': [
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
            ],
        }
    ]
}
export default {
    url: '/nms/reports/operationCount',
    type: 'post',
    response: req => {
        const responseBody = new ResponseBody()
        responseBody.setData(Mockjs.mock(data).list)
        responseBody.setCount(45)
        return responseBody.response(req)
    }
}
