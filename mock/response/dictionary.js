import ResponseBody from '../responseBody'


const dictData = {
    data: {
        siteType: {
            1: 'Web 网站',
            2: '手机网站'
        },
        publishType: {
            1: '全量',
            2: '增量'
        },
        templateType: {
            // 1: '首页',
            2: '公共',
            3: '概览',
            4: '细览',
            5: '列表'
        },
        articleType: {
            1: 'html',
            2: '文件',
            3: '链接'
        },
        articleStatus: {
            1: '草稿',
            2: '可发布'
        },
        linkTarget: {
            _self: '当前页面',
            _target: '新窗口'
        },
        channelType: {
            1: '信息发布',
            2: '图片新闻',
            3: '导航链接',
            4: '自定义表单'
        },
        resourceType: {
            1: '菜单',
            2: '元素',
            3: '接口',
            4: '页面'
        },
        wordCategory: {
            1: '热词',
            2: '敏感词',
            3: '错别词',
        },
        attachModule: {
            imageAppLogo: {
                // type: 站点编辑 logo 类型 ； limit: 文件大小限制 (单位 MB)
                limit: 1,
                type: 11
            },
            imageArticlePhoto: {
                // type: 文章编辑->标题图片 类型 ； limit: 文件大小限制 (单位 MB)
                limit: 2,
                type: 12
            },
            imageArticleEditor: {
                // type: 文章编辑-> 富文本编辑器 类型；limit:  文件大小限制 （单位 MB）
                limit: 5,
                type: 13
            },
            fileAppExplorer: {
                // type: 站点文件管理 -> 附件 类型；limit:  文件大小限制 （单位 MB）
                limit: 10,
                type: 21
            },
            fileArticle: {
                // type: 文章编辑 -> 附件 类型；limit:  文件大小限制 （单位 MB）
                limit: 10,
                type: 22
            },
            fileArticleEditor: {
                // type: 文章编辑 -> 富文本编辑器 -> 附件 类型；limit:  文件大小限制 （单位 MB）
                limit: 10,
                type: 23
            },
            fileTemplate: {
                // type: 模板上传 类型；limit:  文件大小限制 （单位 MB）
                limit: 5,
                type: 24
            },
            newMediaImageLimit: {
                limit: 5,
                type: 31
            },
            newMediaAudioLimit: {
                limit: 5,
                type: 32
            }
        },
        siteStatus: {
            1: "发布",
            2: "发布中"
        },
        mediaChannel: { 1: "微信", 2: "微博" },
        mediaType: { 1: "文本", 2: "图片", 3: "音频", 4: "视频" },
        // 发布状态
        publishStatus: {
            1: "未发布",
            2: "发布中",
            3: "已发布"
        }
    }
}
export default [
    {
        url: '/dictionaries',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData(dictData.data)
            return responseBody.response(req)
        }
    }
]
