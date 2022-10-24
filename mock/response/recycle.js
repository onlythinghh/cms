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
            cron: ''
        }
    ]
}
const siteList = Mockjs.mock({
    'data|5': siteDataGen()
})
export default [
    {
        url: '/cms/app/recycle/list',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData(siteList.data)
            return response.response(req)
        }
    },
    {
        url: '/cms/app/recycle/opt',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('成功')
            return response.response(req)
        }
    }
]
