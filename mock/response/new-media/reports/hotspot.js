import ResponseBody from '../../../responseBody'
import Mockjs from 'mockjs'
const MRandom = Mockjs.Random

const data = {
    'list|10': [
        {
            'themeCode|1': [
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
            'themeName|1': [
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
            'count|1': [
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
    url: '/nms/reports/pubHotCount',
    type: 'post',
    response: req => {
        const responseBody = new ResponseBody()
        responseBody.setData(Mockjs.mock(data).list)
        responseBody.setCount(30)
        return responseBody.response(req)
    }
}
