import ResponseBody from '../../../../responseBody'
import Mockjs from 'mockjs'
const MRandom = Mockjs.Random
const sources = {
    'list|10': [
        {
            'id|+1': 1,
            'name|1': [
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
                MRandom.ctitle(10),
            ],
            'url|1': [
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com'),
                MRandom.url('http', 'example.com')
            ]
        }
    ]
}
export default [
    {
        url: '/cms/source/list',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData(Mockjs.mock(sources).list)
            responseBody.setCount(100)
            return responseBody.response(req)
        }
    },
    {
        url: '/cms/source/save',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData('保存成功')
            return responseBody.response(req)
        }
    },
    {
        url: '/cms/source/del',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    }
]
