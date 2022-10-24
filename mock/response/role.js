const roleListData = {
    data: [
        {
            id: 1,
            prems: [],
            code: 'Micro',
            name: '超级管理员',
            createTime: +new Date()
        },
        {
            id: 2,
            prems: [],
            code: 'Test',
            name: '测试',
            createTime: +new Date()
        }
    ]
}
import ResponseBody from '../responseBody'
export default [
    {
        url: '/role/page',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(roleListData.data)
            return responseBody.response(req)
        }
    }
]
