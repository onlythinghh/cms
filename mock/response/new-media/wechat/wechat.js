const wechatListData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "id": 1,
            "accountName": "彭于晏的微信",
            "wechatId": 17665555,
            "wechatType": 2,
            "accountStatus":0,
            "registerTime": 1540522734001,
            'department': '腾讯集团',
            'contactPerson':"彭于晏",
        },
        {
            "id": 2,
            "accountName": "胡歌的微信",
            "wechatId": 17666666,
            "wechatType": 0,
            "accountStatus":1,
            "registerTime": 1540512734000,
            'department': '微软集团',
            'contactPerson':"胡歌",
        },
        {
            "id": 3,
            "accountName": "权志龙的微信",
            "wechatId": 17667777,
            "wechatType": 2,
            "accountStatus":2,
            "registerTime": 1540512734000,
            'department': '娱乐集团',
            'contactPerson':"权志龙",
        },
        {
            "id": 4,
            "accountName": "沈腾的微信",
            "wechatId": 17668888,
            "wechatType": 1,
            "accountStatus":2,
            "registerTime": 1540512734000,
            'department': '开心麻花',
            'contactPerson':"沈腾",
        }
    ]
}
const wechatDetailData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data":
        {
            "id": 1,
            "accountName": "彭于晏的微信",
            "wechatId": 17665555,
            "appId": 1,
            "appSecret": 'secret',
            "imgUrl": 'www.qq.com',
            "wechatType": 2,
            "introduction":'彭于晏专用',
            "accountStatus":0,
            "registerTime": 1540522734001,
            "invalidationTime":1640522734001,
            'department': '腾讯集团',
            'contactPerson': "彭于晏",
            "address": '半岛科技园1',
            'contactNo':18221323191
        }
}


import ResponseBody from '../../../responseBody'
const getNextId = () => {
    const ids = wechatListData.data.map(user => user.id)
    return Math.max.apply(null, ids) + 1
}
export default [
    {
        url: '/nms/account/wechat/detail',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(wechatDetailData.data)
            return responseBody.response()
        }
    },
    {
        url: '/nms/account/wechat/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(wechatListData.data)
            return responseBody.response()
        }
    },
    {
        url: '/nms/account/wechat/save',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            if (!userinfo.id) {
                userinfo.id = getNextId()
                userinfo.registerTime = +new Date()
                wechatListData.data.push(userinfo)
            } else {
                wechatListData.data.some(user => {
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
    {
        url: '/nms/account/wechat/del',
        type: 'post',
        response: (req) => {
            const userinfo = req.body

            const index = wechatListData.data.findIndex(user => user.id == userinfo.id)
            if (index > -1) {
                wechatListData.data.splice(index, 1)
            }
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    }
]
