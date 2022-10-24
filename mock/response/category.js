import ResponseBody from '../responseBody'
import mockjs from 'mockjs'
const MRandom = mockjs.Random
const category = mockjs.mock({
    'list|15': [
        {
            'id|+1': 1,
            'name|1': [
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5),
                MRandom.ctitle(1, 5)
            ],
            'type|1': [
                1, 2, 3
            ],
            appid: MRandom.natural(0, 10)
        }
    ]
})
export default [
    {
        url: '/cms/category/list',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData(category.list)
            return response.response(req)
        }
    },
    {
        url: '/cms/category/save',
        type: 'post',
        response: req => {
            const category = req.body
            if (!category.id) {
                category.id = MRandom.integer(1, 5)
            }
            const response = new ResponseBody()
            response.setData(category)
            return response.response(req)
        }
    },
    {
        url: '/cms/category/del',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('成功')
            return response.response(req)
        }
    }
]
