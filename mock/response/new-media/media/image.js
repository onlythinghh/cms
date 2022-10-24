const imageListData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "id": 1,
            "imgName": "彭于晏",
            "imgSysName": '系统名称',
            "size": '1',
            "imgUrl":'https://upyun.xuanmo.xin/test/20190612101956.png',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注111'
        },
        {
            "id": 2,
            "imgName": "权志龙",
            "imgSysName": '系统名称',
            "size": '2',
            "imgUrl":'https://upyun.xuanmo.xin/test/20190612101956.png',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注222'
        },
        {
            "id": 3,
            "imgName": "陈伟霆",
            "imgSysName": '系统名称',
            "size": '3',
            "imgUrl":'https://upyun.xuanmo.xin/test/20190612101956.png',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注333'
        },
        {
            "id": 4,
            "imgName": "彭于晏",
            "imgSysName": '系统名称',
            "size": '1',
            "imgUrl":'https://upyun.xuanmo.xin/test/20190612101956.png',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注内容444'
        }
    ]
}


import ResponseBody from '../../../responseBody'
const getNextId = () => {
    const ids = imageListData.data.map(user => user.id)
    return Math.max.apply(null, ids) + 1
}
export default [
    {
        url: '/nms/media/image/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(imageListData.data)
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/image/save',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            if (!userinfo.id) {
                userinfo.id = getNextId()
                userinfo.registerTime = +new Date()
                imageListData.data.push(userinfo)
            } else {
                imageListData.data.some(user => {
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
        url: '/nms/media/file/upload/image',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData({
                url: 'https://upyun.xuanmo.xin/test/20190612101956.png',
                filename: '测试图片',
                newName:"测试图片系统名称",
                size:1
            })
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/image/del',
        type: 'post',
        response: (req) => {
            const userinfo = req.body

            const index = imageListData.data.findIndex(user => user.id == userinfo.id)
            if (index > -1) {
                imageListData.data.splice(index, 1)
            }
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    }
]
