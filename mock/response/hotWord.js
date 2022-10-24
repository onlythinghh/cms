const hotWordData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "id": 1,
            "appid":1,
            "category":1,
            "categoryName": "热词",
            "word": "嘻嘻",
            "url": "www.baidu.com",
            "times":2,
            "createTime": 1540512734000,
            "createBy": "胡歌",

        },
        {
            "id": 2,
            "appid":1,
            "category":1,
            "categoryName": "热词",
            "word": "雨女无瓜",
            "url": "www.baidu.com",
            "times":2,
            "createTime": 1540512734000,
            "createBy": "彭于晏",

        },
        {
            "id": 3,
            "appid":1,
            "category":1,
            "categoryName": "热词",
            "word": "嘻嘻",
            "url": "www.baidu.com",
            "times":2,
            "createTime": 1540512734000,
            "createBy": "权志龙",
        },
        {
            "id": 4,
            "appid":1,
            "category":1,
            "categoryName": "敏感词",
            "word": "神马",
            "url": "www.baidu.com",
            "times":2,
            "createTime": 1540512734000,
            "createBy": "陈伟霆",
        }
    ]
}

import ResponseBody from '../responseBody'
const getNextId = () => {
    const ids = hotWordData.data.map(user => user.id)
    return Math.max.apply(null, ids) + 1
}
export default [
    {
        url: '/cms/hotword/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(hotWordData.data)
            return responseBody.response()
        }
    },
    {
        url: '/cms/hotword/del',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            const index = hotWordData.data.findIndex(user => user.id == userinfo.id)
            if (index > -1) {
                hotWordData.data.splice(index, 1)
            }
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    },
    {
        url: '/cms/hotword/save',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            if (!userinfo.id) {
                userinfo.id = getNextId()
                userinfo.createTime = +new Date()
                hotWordData.data.push(userinfo)
            } else {
                hotWordData.data.some(user => {
                    if (userinfo.id && user.id == userinfo.id) {
                        Object.assign(user, userinfo)
                        return true
                    }
                    return false
                })
            }
            const responseBody = new ResponseBody()
            responseBody.setData('保存成功')
            return responseBody.response(req)
        }
    },
]
