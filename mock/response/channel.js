import Mock from 'mockjs'
let home = Mock.mock({
    id: 1,
    pid: 0,
    appid: 1,
    code: 'home',
    name: 'home',
    viewName: '首页',
    generalTemplate: 2,
    detailTemplate: 6,
    children: [],
    type: 1,
    allow: 1,
    open: '_self',
    releaseType: 1,
    orderBy: ',bak04 asc'
})

let about = Mock.mock({
    id: 2,
    pid: 0,
    appid: 1,
    code: 'about-us',
    name: 'about-us',
    viewName: '关于我们',
    generalTemplate: 2,
    detailTemplate: 6,
    type: 1,
    allow: 1,
    open: '_self',
    releaseType: 1,
    orderBy: ',bak04 asc',
    children: [
        {
            id: 6,
            pid: 2,
            appid: 1,
            code: 'information',
            name: 'information',
            viewName: '公司介绍',
            generalTemplate: 2,
            detailTemplate: 6,
            children: [],
            type: 1,
            allow: 1,
            open: '_self',
            releaseType: 1,
            orderBy: ',bak04 asc'
        }
    ]
})

let news = Mock.mock({
    id: 3,
    pid: 0,
    appid: 1,
    code: 'news',
    name: 'news',
    viewName: '新闻中心',
    generalTemplate: 2,
    detailTemplate: 6,
    type: 1,
    allow: 1,
    open: '_self',
    releaseType: 1,
    orderBy: ',bak04 asc',
    children: [
        {
            id: 4,
            pid: 3,
            appid: 1,
            code: 'company-news',
            name: 'company-news',
            viewName: '公司新闻',
            generalTemplate: 2,
            detailTemplate: 6,
            children: [],
            type: 1,
            allow: 1,
            open: '_self',
            releaseType: 1,
            orderBy: ',bak04 asc'
        }, {
            id: 5,
            pid: 3,
            appid: 1,
            code: 'hot-news',
            name: 'hot-news',
            viewName: '热点专题',
            generalTemplate: 2,
            detailTemplate: 6,
            children: [],
            type: 1,
            allow: 1,
            open: '_self',
            releaseType: 1,
            orderBy: ',bak04 asc'
        }
    ]
})

let channelTreeList = [home, about, news]

let channelRecycleList = []

const findCurrentObj = (arr, { data, cb, filter }) => {
    if (!Array.isArray(arr)) return arr
    arr.map((item, index, arr) => {
        if (Array.isArray(item.children)) findCurrentObj(item.children, { data, cb, filter })
        if (+item[filter[0]] === +data[filter[1]]) cb && cb(item, index, arr)
    })
}

const replaceObject = (target, source, filter) => {
    for (let [key, value] of Object.entries(source)) {
        if (filter !== key) target[key] = value
    }
    return target
}

import ResponseBody from '../responseBody'

export default [
    {
        url: '/cms/channel/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(channelTreeList)
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/save',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            req.body.pid = +req.body.pid
            let request = req.body
            if (!request.id) {
                const id = parseInt(Math.random() * 1000) + ''
                request = {
                    ...req.body,
                    id,
                    viewName: req.body.viewName ? req.body.viewName : req.body.name,
                    code: req.body.code ? req.body.code : id,
                    children: []
                }
                if (req.body.pid === 0) {
                    channelTreeList.push(request)
                } else {
                    findCurrentObj(channelTreeList, {
                        data: request,
                        filter: ['id', 'pid'],
                        cb (item) {
                            item.children.push(request)
                        }
                    })
                }
            } else {
                findCurrentObj(channelTreeList, {
                    data: request,
                    filter: ['id', 'id'],
                    cb (item) {
                        replaceObject(item, request)
                    }
                })
            }
            responseBody.setData(channelTreeList)
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/release',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData('发布成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/del',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            findCurrentObj(channelTreeList, {
                data: req.body,
                filter: ['id', 'id'],
                cb (item, index, arr) {
                    let res = arr.splice(index, 1)
                    channelRecycleList = [...channelRecycleList, ...res]
                }
            })
            responseBody.setData('删除成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/copy',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let newObj = {}
            findCurrentObj(channelTreeList, {
                data: req.body,
                filter: ['id', 'id'],
                cb (currentChannel) {
                    for (let [key, value] of Object.entries(currentChannel)) {
                        newObj[key] = value
                    }
                    newObj.id = parseInt(Math.random() * 100)
                    findCurrentObj(channelTreeList, {
                        data: req.body,
                        filter: ['id', 'pid'],
                        cb (item) {
                            item.children.push(newObj)
                        }
                    })
                }
            })
            responseBody.setData('复制成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/remove',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData('移动成功！')
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/recycle/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(channelRecycleList)
            return responseBody.response()
        }
    }, {
        url: '/cms/channel/recycle/opt',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            let ids = req.body.ids.split(',')
            if (req.body.flag === 'delete') {
                ids.map(item => {
                    channelRecycleList.splice(channelRecycleList.findIndex(v => +v.id === item), 1)
                })
            }
            responseBody.setData('删除成功！')
            return responseBody.response()
        }
    }
]
