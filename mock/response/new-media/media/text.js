import ResponseBody from '../../../responseBody'
import Mock from 'mockjs'

let textData = Mock.mock({
    'list|15': [
        {
            'id|+1': 1,
            context: '@cword(100)',
            themeCodes: 'test1,test2,test4,test5,test6',
            remark: '备注内容'
        }
    ]
})
let textList = textData.list

export default [
    {
        url: '/nms/media/text/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let result = []
            const currentPage = +req.body.page
            const limit = +req.body.limit
            const endIndex = currentPage * limit
            for (let i = endIndex - limit, j = 0; i < endIndex; i++) {
                if (textList[i]) {
                    result[j] = textList[i]
                    j++
                }
            }
            responseBody.setData(result)
            responseBody.setCount(textList.length)
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/text/save',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            if (!req.body.id) {
                textList.unshift({
                    ...req.body,
                    id: parseInt(Math.random() * 1000)
                })
            } else {
                textList.map((item, index) => {
                    if (+item.id === +req.body.id) textList.splice(index, 1, req.body)
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
                textList.splice(textList.findIndex(v => +v.id === +item), 1)
            })
            responseBody.setData('删除成功！')
            return responseBody.response()
        }
    }
]
