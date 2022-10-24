const templateListData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "id": 1,
            "name": "公共模板",
            "type": 2,
            "createTime": 1540512734000,
            "createBy": "彭于晏",
            "desc":"1",
        },
        {
            "id": 2,
            "name": "概览模板",
            "type": 3,
            "createTime": 1540512734000,
            "createBy": "胡歌",
            "desc":"2",

        },
        {
            "id": 3,
            "name": "细览模板",
            "type": 4,
            "createTime": 1540512734000,
            "createBy": "权志龙",
            "desc":"3",
        },
        {
            "id": 4,
            "name": "列表模板1",
            "type": 5,
            "createTime": 1540512734000,
            "createBy": "权志龙",
            "desc":"4",
        },
        {
            "id": 5,
            "name": "列表模板2",
            "type": 5,
            "createTime": 1540512734000,
            "createBy": "权志龙",
            "desc":"5",
        }, {
            "id": 6,
            "name": "细览模板2",
            "type": 4,
            "createTime": 1540512734000,
            "createBy": "权志龙",
            "desc":"6",
        }, {
            "id": 7,
            "name": "概览模板2",
            "type": 3,
            "createTime": 1540512734000,
            "createBy": "权志龙",
            "desc":"7",
        }, {
            "id": 8,
            "name": "公共模板2",
            "type": 2,
            "createTime": 1540512734000,
            "createBy": "权志龙",
            "desc":"8",
        }
    ]
}
const templateDetailData = {
    "success": true,
    "errMsg": null,
    "code": "0",
    "data":
        {
            "id": 1,
            "name": "公共模板",
            "type": 2,
            "createTime": 1540512734000,
            "createBy": "彭于晏",
            "desc": "1",
            "content": '哈哈',
            "path":'/22/preview/tpl/201906171943050440',
            "fileName":'aaa'
        }
}

/* eslint-disable */
const templatetags ={
    "success": true,
    "errMsg": null,
    "code": "0",
    "data": [
        {
            "name": "CSS特殊对象",
            "instructions": [
                {
                    "name": "BASEURL",
                    "code": "background: url(\"{BASEURL}/static/image/logo.png\");",
                    "type": "String",
                    "descript": "路径前缀"
                }
            ],
            "descript": "CSS文档中对象"
        },
        {
            "name": "站点对象APP",
            "instructions": [
                {
                    "name": "id",
                    "code": "<span th:text=\"${id}\"></span>",
                    "type": "Long",
                    "descript": "站点ID"
                },
                {
                    "name": "title",
                    "code": "<span th:text=\"${title}\"></span>",
                    "type": "String",
                    "descript": "站点标题"
                },
                {
                    "name": "keyword",
                    "code": "<span th:text=\"${keyword}\"></span>",
                    "type": "String",
                    "descript": "站点关键字"
                },
                {
                    "name": "description",
                    "code": "<span th:text=\"${description}\"></span>",
                    "type": "String",
                    "descript": "站点描述"
                },
                {
                    "name": "copyright",
                    "code": "<span th:text=\"${copyright}\"></span>",
                    "type": "String",
                    "descript": "站点版权"
                },
                {
                    "name": "logo",
                    "code": "<span th:text=\"${logo}\"></span>",
                    "type": "String",
                    "descript": "站点LOGO"
                },
                {
                    "name": "chartset",
                    "code": "<span th:text=\"${chartset}\"></span>",
                    "type": "String",
                    "descript": "站点编码"
                },
                {
                    "name": "currentMenuId",
                    "code": "<span th:text=\"${currentMenuId}\"></span>",
                    "type": "Long",
                    "descript": "当前菜单ID"
                },
                {
                    "name": "currentArticleId",
                    "code": "<span th:text=\"${currentArticleId}\"></span>",
                    "type": "Long",
                    "descript": "当前文章ID"
                },
                {
                    "name": "menus",
                    "code": "<div th:unless=\"${#lists.isEmpty(menus)}\" >\n<ul th:each=\"m : ${menus}\" >\n        <li th:id=\"${m.id}\" >\n   <a th:href=\"${m.url}\" th:text=\"${m.title}\"></a>\n    <span>children is null: [[${m.children} != null]] </span>\n        </li>\n    </ul>\n</div>",
                    "type": "List<Menu>",
                    "descript": "站点菜单"
                },
                {
                    "name": "breadcrumb",
                    "code": "<div th:unless=\"${#lists.isEmpty(breadcrumb)}\" >\n    <ul th:each=\"b,bState : ${breadcrumb}\" >\n    <li th:id=\"${b.id}\" >\n    <i th:text=\"${bState.count}\"></i>\n            <a th:href=\"${b.url}\" th:text=\"${b.title}\"></a>\n        </li>\n    </ul>\n</div>",
                    "type": "List<Breadcrumb>",
                    "descript": "面包屑"
                },
                {
                    "name": "bak01",
                    "code": "<span th:text=\"${bak01}\"></span>",
                    "type": "String",
                    "descript": "站点备用字段01"
                },
                {
                    "name": "bak02",
                    "code": "<span th:text=\"${bak02}\"></span>",
                    "type": "String",
                    "descript": "站点备用字段02"
                },
                {
                    "name": "bak03",
                    "code": "<span th:text=\"${bak03}\"></span>",
                    "type": "String",
                    "descript": "站点备用字段03"
                },
                {
                    "name": "bak04",
                    "code": "<span th:text=\"${bak04}\"></span>",
                    "type": "String",
                    "descript": "站点备用字段04"
                },
                {
                    "name": "bak05",
                    "code": "<span th:text=\"${bak05}\"></span>",
                    "type": "String",
                    "descript": "站点备用字段05"
                }
            ],
            "descript": "模板页面对象"
        },
        {
            "name": "菜单对象Menu",
            "instructions": [
                {
                    "name": "id",
                    "code": "${id}",
                    "type": "Long",
                    "descript": "菜单ID"
                },
                {
                    "name": "title",
                    "code": "${title}",
                    "type": "String",
                    "descript": "菜单标题"
                },
                {
                    "name": "url",
                    "code": "${url}",
                    "type": "String",
                    "descript": "菜单链接"
                },
                {
                    "name": "icon",
                    "code": "${icon}",
                    "type": "String",
                    "descript": "菜单图标"
                },
                {
                    "name": "open",
                    "code": "${open}",
                    "type": "String",
                    "descript": "菜单打开方式"
                },
                {
                    "name": "type",
                    "code": "${type}",
                    "type": "Integer",
                    "descript": "菜单类型"
                },
                {
                    "name": "children",
                    "code": "${children}",
                    "type": "List<Menu>",
                    "descript": "子菜单"
                }
            ],
            "descript": "模板页面对象"
        },
        {
            "name": "面包屑对象Menu",
            "instructions": null,
            "descript": "模板页面对象"
        },
        {
            "name": "频道对象Channel",
            "instructions": null,
            "descript": "模板页面对象"
        },
        {
            "name": "文章对象Article",
            "instructions": null,
            "descript": "模板页面对象"
        },
        {
            "name": "文章来源对象Source",
            "instructions": null,
            "descript": "模板页面对象"
        },
        {
            "name": "简单文章对象Article",
            "instructions": null,
            "descript": "模板页面对象"
        },
        {
            "name": "分页对象Page",
            "instructions": null,
            "descript": "分页对象"
        },
        {
            "name": "cms:channel",
            "instructions": [
                {
                    "name": "cms:channel",
                    "code": "参数为频道ID, 可以用var指定变量名,不指定的话就是channel.\n<div cms:channel=\"3\" var=\"abc\">\n    <span class=\"id\" th:text=\"${abc.id}\"></span>\n    <span th:text=\"${abc.title}\"></span>\n    <span th:text=\"${abc.url}\"></span>\n    <span th:text=\"${abc.icon}\"></span>\n    <span th:text=\"${abc.keyword}\"></span>\n    <span th:text=\"${abc.description}\"></span>\n    <span th:text=\"${abc.open}\"></span>\n    <span th:text=\"${abc.type}\"></span>\n    <span th:text=\"${abc.bak01}\"></span>\n    <span th:text=\"${abc.bak02}\"></span>\n    <span th:text=\"${abc.bak03}\"></span>\n    <span th:text=\"${abc.bak04}\"></span>\n    <span th:text=\"${abc.bak05}\"></span>\n</div>",
                    "type": "ChannelTag",
                    "descript": "频道标签对象"
                }
            ],
            "descript": "CMS标签"
        },
        {
            "name": "cms:article",
            "instructions": [
                {
                    "name": "cms:article",
                    "code": "参数为文章ID, 可以用var指定变量名,不指定的话就是article.\n<div cms:article=\"3\" var=\"a\">\n<span th:text=\"${a.id}\"></span>\n<span th:text=\"${a.type}\"></span>\n<span th:text=\"${a.title}\"></span>\n<span th:text=\"${a.shortTilte}\"></span>\n<span th:text=\"${a.summary}\"></span>\n<span th:text=\"${a.photo}\"></span>\n<span th:text=\"${a.author}\"></span>\n<span th:text=\"${a.url}\"></span>\n<span th:text=\"${a.subTitle}\"></span>\n<span th:text=\"${a.source}\"></span>\n<span th:text=\"${a.compileTime}\"></span>\n<span th:text=\"${a.keyword}\"></span>\n<span th:text=\"${a.content}\"></span>\n<span th:text=\"${a.bak01}\"></span>\n<span th:text=\"${a.bak02}\"></span>\n<span th:text=\"${a.bak03}\"></span>\n<span th:text=\"${a.bak04}\"></span>\n<span th:text=\"${a.bak05}\"></span>\n<span th:unless=\"${a.lastArticle}==null\">\n    <span th:text=\"${a.lastArticle.id}\"></span>\n    <span th:text=\"${a.lastArticle.type}\"></span>\n    <span th:text=\"${a.lastArticle.title}\"></span>\n    <span th:text=\"${a.lastArticle.shortTilte}\"></span>\n    <span th:text=\"${a.lastArticle.summary}\"></span>\n    <span th:text=\"${a.lastArticle.photo}\"></span>\n    <span th:text=\"${a.lastArticle.author}\"></span>\n    <span th:text=\"${a.lastArticle.url}\"></span>\n</span>\n<span th:if=\"${a.nextArticle}!=null\">\n    <span th:text=\"${a.nextArticle.id}\"></span>\n    <span th:text=\"${a.nextArticle.type}\"></span>\n    <span th:text=\"${a.nextArticle.title}\"></span>\n    <span th:text=\"${a.nextArticle.shortTilte}\"></span>\n    <span th:text=\"${a.nextArticle.summary}\"></span>\n    <span th:text=\"${a.nextArticle.photo}\"></span>\n    <span th:text=\"${a.nextArticle.author}\"></span>\n    <span th:text=\"${a.nextArticle.url}\"></span>\n</span>\n</div>",
                    "type": "ArticleTag",
                    "descript": "文章标签对象"
                }
            ],
            "descript": "CMS标签"
        },
        {
            "name": "cms:articleTop",
            "instructions": [
                {
                    "name": "cms:articleTop",
                    "code": "参数为频道ID,冒号后是前几,不指定前几就是前十;\ntype可以指定文章类型,不指定就是所有类型;\nvar可以指定变量名,不指定的话就是articleTop.\n文章内属性参考文章标签内属性.\n<th:block cms:articleTop=\"12:5\" var=\"art\" type=\"1\" >\n<li th:class=\"${artState.odd}?'odd':'even'\">\n    <a th:id=\"${art.id}\" th:href=\"${art.url}\" th:text=\"${art.title}\">title</a>\n</li>\n</th:block>",
                    "type": "List<ArticleTag>",
                    "descript": "文章标签对象"
                }
            ],
            "descript": "CMS标签"
        },
        {
            "name": "cms:list",
            "instructions": [
                {
                    "name": "cms:list",
                    "code": "参数为频道ID;\ntype可以指定文章类型,不指定就是所有类型;\nvar可以指定变量名,不指定的话就是list.\n列表用法基本与文章前几标签的用法类似.\n<th:block cms:list=\"11\" var=\"art\" type=\"1\" >\n<li th:class=\"${artState.odd}?'odd':'even'\">\n    <a th:id=\"${art.id}\" th:href=\"${art.url}\" th:text=\"${art.title}\">title</a>\n</li>\n</th:block>",
                    "type": "List<ArticleTag>",
                    "descript": "文章列表对象"
                }
            ],
            "descript": "CMS标签"
        },
        {
            "name": "cms:page",
            "instructions": [
                {
                    "name": "cms:page",
                    "code": "参数为频道ID;\ntype可以指定文章类型,不指定就是所有类型;\nvar可以指定变量名,不指定的话就是page.\n属性list用法基本与列表的用法类似.\n属性page是一个分页对象,有first,last,number,size,totalPages,totalElements子属性.\n<div cms:page=\"11\" var=\"my\" type=\"1\" th:pageNo=\"${pageNo}\" >\n    <ul th:each=\"item : ${my.list}\">\n        <li th:text=\"${item.title}\" th:id=\"${item.id}\">内容</li>\n    </ul>\n    <div th:replace=\"layout/page :: page( ${pageNo}, ${my.page.totalPages} )\">\n    </div>\n</div>",
                    "type": "List<ArticleTag>",
                    "descript": "文章列表对象"
                },
                {
                    "name": "cms:page",
                    "code": "<div th:replace=\"layout/page :: page( ${pageNo}, ${my.page.totalPages} )\">\n</div>",
                    "type": "Page",
                    "descript": "文章分页对象"
                }
            ],
            "descript": "CMS标签"
        }
    ],
    "version": {
        "dictionary": "2019.06.13.18.26.20.441",
        "permission": "20190615160824684"
    },
    "count": 0
}
import ResponseBody from '../responseBody'

const getNextId = () => {
    const ids = templateListData.data.map(user => user.id)
    return Math.max.apply(null, ids) + 1
}
export default [
    {
        url: '/cms/template/detail',
        type: 'post',
        response: (req) => {
            // const userinfo = req.body
            // const Detaildata = templateDetailData.data.filter(item => item.id == userinfo.id)
            const responseBody = new ResponseBody()
            responseBody.setData(templateDetailData.data)
            return responseBody.response()
        }
    },
    {
        url: '/cms/template/list',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(templateListData.data)
            return responseBody.response()
        }
    },
    {
        url: '/cms/template/all',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(templateListData.data)
            return responseBody.response()
        }
    },
    {
        url: '/cms/template/save',
        type: 'post',
        response: (req) => {
            const userinfo = req.body
            if (!userinfo.id) {
                userinfo.id = getNextId()
                userinfo.createTime = +new Date()
                templateListData.data.push(userinfo)
            } else {
                templateListData.data.some(user => {
                    if (userinfo.id && user.id == userinfo.id) {
                        Object.assign(user, userinfo)
                        return true
                    }
                    return false
                })
            }
            const responseBody = new ResponseBody()
            responseBody.setData('保存成功')
            return responseBody.response(req)
        }
    }, {
        url: '/cms/template/del',
        type: 'post',
        response: (req) => {
            const userinfo = req.body

            const index = templateListData.data.findIndex(user => user.id == userinfo.id)
            if (index > -1) {
                templateListData.data.splice(index, 1)
            }
            const responseBody = new ResponseBody()
            responseBody.setData('删除成功')
            return responseBody.response(req)
        }
    },{
        url: '/cms/template/import',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData('导入成功')
            return responseBody.response(req)
        }
    },{
        url: '/cms/template/export',
        type: 'post',
        response: (req) => {
            const responseBody = new ResponseBody()
            responseBody.setData('导出成功')
            return responseBody.response(req)
        }
    },{
        url: '/cms/template/tags',
        type: 'post',
        response: () => {
            const responseBody = new ResponseBody()
            responseBody.setData(templatetags.data)
            return responseBody.response()
        }
    }
]
