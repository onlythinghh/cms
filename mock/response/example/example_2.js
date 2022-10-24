// import Mock from 'mockjs'
export default [
    {
        url: '/example/list',
        type: 'post',
        response: req => {
            const { param } = req.body

            return {
                success: true,
                code: 0,
                errMsg: '请求成功',
                data: {
                    param,
                    pvData: [
                        { key: 'PC', pv: 1024 },
                        { key: 'mobile', pv: 1024 },
                        { key: 'ios', pv: 1024 },
                        { key: 'android', pv: 1024 }
                    ]
                }
            }
        }
    },
    {
        url: '/example/update',
        type: 'post',
        response: () => {
            return {
                success: true,
                code: 0,
                errMsg: '请求成功',
                data: ''
            }
        }
    }
]
