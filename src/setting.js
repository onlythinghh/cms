module.exports = {
    // 是否开启国际化,此处只能控制是否可以选择其他语言
    enableI18n: false,
    // 无需授权的的路由, 支持 path-to-regexp
    authorExcludeRoutes: [
        '/',
        '/profile/(.*)',
        '/flowable/work/processes/startup',
        '/flowable/form/editor',
        '/flowable/modeler',
        '/flowable/viewer(.*)',
    ],
    // 无需版本控制的Api
    excludeVersionApis: [
        '/api/login',
        '/api/my/info',
        '/api/loginWithTicket',
        '/api/capt',
        '/api/dictionaries',
        '/api/(.*)/download',
        '/api/cms/template/export',
        '/api/cms/template/exportAll',
        '(.*)/flowable(.*)',
        '/api/modeler/(.*)/model-json',
        '/api/processes(.*)',
        '/api/cms/qa/export',
        '/api/cms/vote/export',
        '/api/cms/feedback/export',
        '/api/cms/capital/form/info/export',
        '/api/cms/article/review/logs/export',
        '/api/html/text/export',
    ],
    // 需要添加站点ID的Api
    siteIdApis: [
        '(/api)?/cms/channel/(.*)',
        '(/api)?/cms/article/(.*)',
        '(/api)?/cms/template/(.*)',
        '(/api)?/cms/article/(.*)',
        '(/api)?/processes',
        '(/api)?/processes/assignees',
        '(/api)?/processes/deployment',
    ]
}
