import ResponseBody from '../../../responseBody'
import Mock from 'mockjs'

let themeList = [
    {
        code: 'test1',
        name: '测试1'
    }, {
        code: 'test2',
        name: '测试2'
    }, {
        code: 'test3',
        name: '测试3'
    }, {
        code: 'test4',
        name: '测试4'
    }, {
        code: 'test5',
        name: '测试5'
    }, {
        code: 'test6',
        name: '测试6'
    }
]

const sina = Mock.mock({
    'list|100': [
        {
            'id|+1': 10,
            accountName: '@cword(5)'
        }
    ]
})
const wechat = Mock.mock({
    'list|50': [
        {
            'id|+1': 200,
            accountName: '@cword(5)'
        }
    ]
})
let accountList = [
    {
        mediaChannelKey: 1,
        mediaChannelName: '微博',
        AccountDictList: sina.list
    }, {
        mediaChannelKey: 2,
        mediaChannelName: '微信',
        AccountDictList: wechat.list
    }
]

export default [
    {
        url: '/nms/media/theme/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(themeList)
            return responseBody.response()
        }
    },
    {
        url: '/nms/media/account/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(accountList)
            return responseBody.response()
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
    }
]
