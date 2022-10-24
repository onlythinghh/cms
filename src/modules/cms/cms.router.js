import Cms from './index.vue'
import SiteRouter from './site/.router.js'
import TaskRouter from './task/.router.js'
import ChannelRouter from './channel/.router.js'
import ArticleRouter from './article/.router.js'
import TemplateRouter from './template/.router.js'
import SettingsRouter from './settings/.router.js'
import siteRouteInterceptor from './router/cmsRouterInterceptor'
import ProcessesRouter from './processes/definitions/.router.js'
export default {
    path: '/cms',
    name: 'CMS',
    meta: { title: 'CMS系统' },
    component: Cms,
    beforeEnter(to, from, next) {
        siteRouteInterceptor(to, from, next)
    },
    children: [
        SiteRouter,
        ChannelRouter,
        ...ArticleRouter,
        TemplateRouter,
        SettingsRouter,
        ProcessesRouter,
        TaskRouter
    ]
}
