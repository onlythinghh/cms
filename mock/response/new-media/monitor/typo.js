import ResponseBody from '../../../responseBody'
import Mockjs from 'mockjs'
const MRandom = Mockjs.Random

const typoList = {
    'list|10': [
        {
            'id|+1': 1,
            'category|1': [
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
                MRandom.integer(1, 15),
            ],
            'word|1': [
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
            ],
            'swap|1': [
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
                MRandom.cword(1, 5),
            ]
        }
    ]
}


export default [
    {
        url: '/nms/monitor/wrongWord/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(Mockjs.mock(typoList).list)
            responseBody.setCount(100)
            return responseBody.response(req)
        }
    },
    {
        url: '/nms/monitor/wrongWord/save',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData('保存成功')
            return responseBody.response(req)
        }
    },
    {
        url: '/nms/monitor/wrongWord/del',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    }
]
