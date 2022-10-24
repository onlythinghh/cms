import i18n from '../../i18n'
import NotFound from './NotFound.vue'
import Forbidden from './Forbidden.vue'
import { notFoundRoute, forbiddenRoute } from '../../utils/ServiceUtil'
export default [
    {
        path: notFoundRoute.path,
        name: notFoundRoute.name,
        component: NotFound,
        meta: { title: i18n.t('404') },
        hidden: true

    }, {
        path: forbiddenRoute.path,
        name: forbiddenRoute.name,
        component: Forbidden,
        meta: { title: i18n.t('forbidden') },
        hidden: true
    }, {
        path: '*',
        redirect: notFoundRoute.path,
        hidden: true
    }
]
