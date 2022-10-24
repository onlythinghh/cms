const audioListData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "id": 1,
            "title": "标题1",
            "description": '描述1',
            "size": '1',
            "audioPath":'音频存放路径',
            "audioUrl":'http://music.163.com/song/media/outer/url?id=317151.mp3',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注111'
        },
        {
            "id": 2,
            "title": "标题2",
            "description": '描述2',
            "size": '2',
            "audioPath":'音频存放路径',
            "audioUrl":'http://music.163.com/song/media/outer/url?id=317151.mp3',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注222'
        },
        {
            "id": 3,
            "title": "标题3",
            "description": '描述3',
            "size": '3',
            "audioPath":'音频存放路径',
            "audioUrl":'http://music.163.com/song/media/outer/url?id=317151.mp3',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注333'
        },
        {
            "id": 4,
            "title": "标题4",
            "description": '描述4',
            "size": '1',
            "audioPath":'音频存放路径',
            "audioUrl":'http://music.163.com/song/media/outer/url?id=317151.mp3',
            "themeCodes": 'test1,test2,test3,test4,test5,test6',
            "remark":'备注内容444'
        }
    ]
}


import ResponseBody from '../../../responseBody'
const getNextId = () => {
    const ids = audioListData.data.map(user => user.id)
    return Math.max.apply(null, ids) + 1
}
export default [
    {
        url: '/nms/media/audio/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(audioListData.data)
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/audio/save',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            if (!userinfo.id) {
                userinfo.id = getNextId()
                userinfo.registerTime = +new Date()
                audioListData.data.push(userinfo)
            } else {
                audioListData.data.some(user => {
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
        url: '/nms/media/publish',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData('发布成功！')
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/audio/del',
        type: 'post',
        response: (req) => {
            const userinfo = req.body

            const index = audioListData.data.findIndex(user => user.id == userinfo.id)
            if (index > -1) {
                audioListData.data.splice(index, 1)
            }
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    }
]
