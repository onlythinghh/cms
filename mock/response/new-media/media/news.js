import ResponseBody from '../../../responseBody'
import Mock from 'mockjs'

let newsList = Mock.mock({
    'list|15': [
        {
            'id|+1': 1,
            title: '@cword(15)',
            coverPicPath: 'https://assets.xuanmo.xin/images/T1-150.jpg',
            digest: '@cword(30)',
            themeCodes: 'test1,test2',
            description: '@cword(100)',
            remarks: '备注内容',
            updateTime: +Mock.Random.date('T')
        }
    ]
})

let list = newsList.list

export default [
    {
        url: '/nms/media/richMedia/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let result = []
            const currentPage = +req.body.page
            const limit = +req.body.limit
            const endIndex = currentPage * limit
            for (let i = endIndex - limit, j = 0; i < endIndex; i++) {
                if (list[i]) {
                    result[j] = list[i]
                    j++
                }
            }
            result.map(item => {
                item.updateTime = +item.updateTime
            })
            responseBody.setData(result)
            responseBody.setCount(list.length)
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/richMedia/save',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            if (!req.body.id) {
                list.unshift({
                    ...req.body,
                    id: parseInt(Math.random() * 1000),
                    updateTime: +new Date()
                })
            } else {
                list.map((item, index) => {
                    if (+item.id === +req.body.id) list.splice(index, 1, req.body)
                })
            }
            responseBody.setData('成功！')
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/richMedia/del',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let ids = req.body.id.split(',')
            ids.map(item => {
                list.splice(list.findIndex(v => +v.id === +item), 1)
            })
            responseBody.setData('成功！')
            return responseBody.response()
        }
    }
]
