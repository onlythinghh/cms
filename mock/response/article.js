import Mock from 'mockjs'
let list5 = Mock.mock({
    'list|5': [
        {
            'id|+1': 1,
            channelId: 1,
            title: '@csentence',
            channel: '首页',
            status: 2,
            createBy: '管理员',
            createTime: +Mock.Random.date('T'),
            type: 1,
            showTitle: '显示标题',
            subTitle: '副标题',
            shortTitle: '短标题',
            author: '管理员',
            keyword: '关键词1,关键词2',
            summary: '文章摘要',
            photo: 'https://upyun.xuanmo.xin/test/20190612101956.png',
            top: 0,
            content: '@cword(100)',
            attach: '',
            url: 'https://www.baidu.com',
            // shareType: 0-引用 1-自己
            shareType: 0
        }
    ]
})
let list15 = Mock.mock({
    'list|15': [
        {
            'id|+1': 30,
            channelId: 2,
            title: '@csentence',
            channel: '关于我们',
            status: 2,
            createBy: '管理员',
            createTime: +Mock.Random.date('T'),
            type: 1,
            showTitle: '显示标题',
            subTitle: '副标题',
            shortTitle: '短标题',
            author: '管理员',
            keyword: '关键词1,关键词2',
            summary: '文章摘要',
            photo: 'https://upyun.xuanmo.xin/test/20190612101956.png',
            top: 0,
            content: '@cword(100)',
            attach: '',
            url: 'https://www.baidu.com',
            // shareType: 0-引用 1-自己
            shareType: 1
        }
    ]
})
let list25 = Mock.mock({
    'list|25': [
        {
            'id|+1': 60,
            channelId: 5,
            title: '@csentence',
            channel: '热点专题',
            status: 2,
            createBy: '管理员',
            createTime: +Mock.Random.date('T'),
            type: 1,
            showTitle: '显示标题',
            subTitle: '副标题',
            shortTitle: '短标题',
            author: '管理员',
            keyword: '关键词1,关键词2',
            summary: '文章摘要',
            photo: 'https://upyun.xuanmo.xin/test/20190612101956.png',
            top: 0,
            content: '@cword(100)',
            attach: '',
            url: 'https://www.baidu.com',
            // shareType: 0-引用 1-自己
            shareType: 1
        }
    ]
})

let articleList = [...list5.list, ...list15.list, ...list25.list]

let articleRecycleList = []

import ResponseBody from '../responseBody'

export default [
    {
        url: '/cms/article/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let arr = []
            let result = []
            const currentPage = +req.body.page
            const limit = +req.body.limit
            const endIndex = currentPage * limit
            if (req.body.type) {
                articleList.map((item, index) => {
                    item.createTime = +item.createTime
                    if (+req.body.channelId === +item.channelId && +req.body.type === +item.type) arr.push(item)
                })
            } else if (req.body.title) {
                articleList.map((item, index) => {
                    item.createTime = +item.createTime
                    if (+req.body.channelId === +item.channelId && item.title.indexOf(req.body.title) !== -1) arr.push(item)
                })
            } else {
                articleList.map((item, index) => {
                    item.createTime = +item.createTime
                    if (+req.body.channelId === +item.channelId) arr.push(item)
                })
            }
            for (let i = endIndex - limit, j = 0; i < endIndex; i++) {
                if (arr[i]) {
                    result[j] = arr[i]
                    j++
                }
            }
            responseBody.setData(result)
            responseBody.setCount(arr.length)
            return responseBody.response()
        }
    }, {
        url: '/cms/article/save',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            if (+req.body.id) {
                articleList.map((item, index) => {
                    if (+req.body.id === +item.id) articleList.splice(index, 1, req.body)
                })
            } else {
                articleList.unshift({
                    ...req.body,
                    status: 1,
                    createTime: +new Date(),
                    createBy: '管理员',
                    id: parseInt(Math.random() * 100)
                })
            }
            responseBody.setData('发布成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/article/detail',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let result = {}
            articleList.map(item => {
                item.type = +item.type
                item.top = +item.top
                if (+req.body.id === +item.id) result = item
            })
            responseBody.setData(result)
            return responseBody.response()
        }
    }, {
        url: '/cms/attach/upload/image',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData({
                path: 'https://upyun.xuanmo.xin/test/20190612101956.png',
                filename: '测试图片'
            })
            return responseBody.response()
        }
    }, {
        url: '/cms/attach/upload/file',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData({
                path: 'https://upyun.xuanmo.xin/test/20190612101956.png',
                filename: '测试图片'
            })
            return responseBody.response()
        }
    }, {
        url: '/cms/article/remove',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            articleList.map(item => {
                if (+item.id === +req.body.id) item.channelId = +req.body.channelId
            })
            responseBody.setData('移动成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/article/copy',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let result = {}
            let newObj = {}
            result = articleList.find(v => +v.id === +req.body.id)
            for (let [key, value] of Object.entries(result)) {
                newObj[key] = value
            }
            newObj.id = parseInt(Math.random() * 100)
            newObj.channelId = +req.body.channelId
            articleList.push(newObj)
            responseBody.setData('复制成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/article/share',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let result = {}
            result = articleList.find(v => +v.id === +req.body.id)
            result.channelId = +req.body.channelId
            responseBody.setData('引用成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/article/release',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData('发布成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/article/delete',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let ids = req.body.ids.split(',')
            ids.map(item => {
                articleRecycleList.push(articleList.splice(articleList.findIndex(v => +v.id === +item), 1)[0])
            })
            responseBody.setData('删除成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/article/recycle/list',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let arr = []
            let result = []
            const currentPage = +req.body.page
            const limit = +req.body.limit
            const endIndex = currentPage * limit
            articleRecycleList.map((item, index) => {
                item.createTime = +item.createTime
                arr.push(item)
            })
            for (let i = endIndex - limit, j = 0; i < endIndex; i++) {
                if (arr[i]) {
                    result[j] = arr[i]
                    j++
                }
            }
            responseBody.setData(result)
            responseBody.setCount(arr.length)
            return responseBody.response()
        }
    }, {
        url: '/cms/article/recycle/opt',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let ids = req.body.ids.split(',')
            if (req.body.flag === 'delete') {
                ids.map(item => {
                    articleRecycleList.splice(articleRecycleList.findIndex(v => +v.id === item), 1)
                })
            }
            responseBody.setData('删除成功！')
            return responseBody.response()
        }
    }
]
