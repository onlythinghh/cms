import ResponseBody from '../responseBody'
import Mockjs from 'mockjs'
const MRandom = Mockjs.Random

const siteDataGen = (idStart = 1, deep = 1) => {
    if (deep >= 3) return null
    const prefixTitle = '慧洲站点-'
    return [
        {
            'id|+1': idStart,
            'name|1': [
                prefixTitle + MRandom.ctitle(5),
                prefixTitle + MRandom.ctitle(5),
                prefixTitle + MRandom.ctitle(5),
                prefixTitle + MRandom.ctitle(5),
                prefixTitle + MRandom.ctitle(5)
            ],
            'showName|1': [
                prefixTitle + MRandom.ctitle(10),
                prefixTitle + MRandom.ctitle(10),
                prefixTitle + MRandom.ctitle(10),
                prefixTitle + MRandom.ctitle(10),
                prefixTitle + MRandom.ctitle(10)
            ],
            'type|1': [1, 2],
            createAt: new Date(),
            'createBy|1': ['Micro', 'admin', 'test'],
            pid: null,
            path: '/site',
            logo: null,
            descript: '',
            copyright: '',
            'publishType|1': [1, 2],
            cron: '',
            'children|5': siteDataGen(Math.random() * 10000 + 100, deep + 1)
        }
    ]
}
const siteList = Mockjs.mock({
    'data|5': siteDataGen()
})

const site = [
    {
        url: '/cms/app/list',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData(siteList.data)
            return response.response(req)
        }
    },
    {
        url: '/cms/app/save',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('保存成功')
            return response.response(req)
        }
    }, {
        url: '/cms/app/del',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('删除成功')
            return response.response(req)
        }
    },
    {
        url: '/cms/app/copy',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('站点复制成功')
            return response.response(req)
        }
    },
    {
        url: '/cms/app/release',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('站点发布成功')
            return response.response(req)
        }
    },
    {
        url: '/cms/app/review',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('/cms/sites/site-list')
            return response.response(req)
        }
    }
]

export default site
