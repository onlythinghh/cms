const userListData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "id": 2,
            "roles": [],
            "account": "admin",
            "username": "MaxBill",
            "locked": false,
            "enabled": true,
            "admin": false,
            "createTime": 1540512734000
        },
        {
            "id": 1,
            "roles": [
                1,
                2
            ],
            "account": "Micro",
            "username": "西湖畔的许仙",
            "locked": false,
            "enabled": true,
            "admin": true,
            "createTime": 1540533096000
        },
        {
            "id": 3,
            "roles": [],
            "account": "MaxBill",
            "username": "我才是管理员",
            "locked": false,
            "enabled": true,
            "admin": false,
            "createTime": 1557042558000
        },
        {
            "id": 4,
            "roles": [],
            "account": "jack",
            "username": "杰克",
            "locked": true,
            "enabled": true,
            "admin": false,
            "createTime": 1557049125000
        }
    ]
}
import ResponseBody from '../responseBody'

const getNextId = () => {
    const ids = userListData.data.map(user => user.id)
    return Math.max.apply(null, ids) + 1
}
export default [
    {
        url: '/user/page',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(userListData.data)
            responseBody.setCount(10)
            return responseBody.response()
        }
    }, {
        url: '/user/save',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            userinfo.enabled = userinfo.enabled === true || userinfo.enabled === 'true'
            userinfo.locked = userinfo.locked === true || userinfo.locked === 'true'
            if (!userinfo.id) {
                userinfo.id = getNextId()
                userinfo.createTime = +new Date()
                userListData.data.push(userinfo)
            } else {
                userListData.data.some(user => {
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
    }, {
        url: '/user/del',
        type: 'post',
        response: (req) => {
            const userinfo = req.body

            const index = userListData.data.findIndex(user => user.id == userinfo.id)
            if (index > -1) {
                userListData.data.splice(index, 1)
            }
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    }, {
        url: '/user/repwd',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData('密码重置成功')
            return responseBody.response(req)
        }
    }, {
        url: '/user/role',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData('角色设置成功')
            return responseBody.response(req)
        }
    }
]
