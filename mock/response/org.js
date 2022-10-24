import ResponseBody from '../responseBody'
import Mockjs from 'mockjs'
const MRandom = Mockjs.Random
const list = [
    {
        'id|+1': 2,
        'fullname|1': [
            MRandom.ctitle(10),
            MRandom.ctitle(10),
            MRandom.ctitle(10),
            MRandom.ctitle(10),
            MRandom.ctitle(10)
        ],
        'shortName|1': [
            MRandom.ctitle(5),
            MRandom.ctitle(5),
            MRandom.ctitle(5),
            MRandom.ctitle(5),
            MRandom.ctitle(5),
        ],
        'descript|1': [
            MRandom.ctitle(5),
            MRandom.ctitle(5)
        ],
        pid: 1
    }
]
const orgRoot = {
    id: 1,
    fullname: '上海慧洲信息技术有限公司',
    shortName: '总公司',
    descript: '',
    pid: null,
    'children|5': list
}

const userList = (startId) => [
    {
        'id|+1': startId,
        'name|1': [
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname(),
            MRandom.cname()
        ],
    }
]
const orgUser = (startId) => ({
    ids: function () {
        const users = this.users || []
        const ids = []
        users.forEach(user => {
            if (Math.random() > 0.5) {
                ids.push(user.id)
            }
        })
        return ids
    },
    'users|10': userList(startId)
})

export default [
    {
        url: '/org/tree',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData([orgRoot])
            return response.response(req)
        }
    }, {
        url: '/org/user',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData(orgUser(Math.floor(Math.random() * 10000)))
            response.setCount(10000)
            return response.response(req)
        }
    }, {
        url: '/org/save',
        type: 'post',
        response: req => {
            let { id, pid, uids, ...org } = req.body
            if (!id) {
                id = Math.floor(Math.random() * 10000) + 1000
            }
            const response = new ResponseBody()
            response.setData({ id: Number(id), pid: pid ? Number(pid) : '', ...org })
            return response.response(req)
        }
    }, {
        url: '/org/del',
        type: 'post',
        response: req => {
            const response = new ResponseBody()
            response.setData('删除成功')
            return response.response(req)
        }
    }
]
