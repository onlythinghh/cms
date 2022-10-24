import ResponseBody from '../../../responseBody'

import Mockjs from 'mockjs'

const MRandom = Mockjs.Random

const countData = {
    'list|10': [
        {
            'mediaChannelCode|1': [
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
                MRandom.string({
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                }, 5),
            ],
            'mediaChannelName|1': [
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
            ],
            'accountId|+1': 1,
            'accountName|1': [
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7),
                MRandom.cword(2, 7)
            ],
            'count|1': [
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
                MRandom.integer(1, 200),
            ]

        }
    ]
}

export default [
    {
        url: '/nms/reports/pubCountList',
        type: 'post',
        response: req => {
            const responseBody = new ResponseBody()
            responseBody.setData(Mockjs.mock(countData).list)
            responseBody.setCount(50)
            return responseBody.response(req)
        }
    }
]
