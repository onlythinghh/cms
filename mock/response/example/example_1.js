import Mock from 'mockjs'
export default {
    url: '/example',
    type: 'post',
    response: req => {
        const { param } = req.body

        return {
            success: true,
            code: 0,
            errMsg: '请求成功',
            data: {
                param,
                token: 'admin-token',
                key: Mock.mock('@integer(300, 5000)')
            }
        }
    }
}
