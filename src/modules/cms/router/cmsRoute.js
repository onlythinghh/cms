import pathToRegexp from 'path-to-regexp'
import store from '@/store'
import { getRouteNoQuery } from '@/utils/BaseUtil'

// 头部显示站点下拉选择
const showDropmenuRoutes = [
    // '/cms/sites/(.*)',
    '/cms/channel/(.*)',
    '/cms/template/(.*)',
    '/cms/article/(.*)',
    '/cms/sites/(.*)',
    '/cms/processes'
]
// 需要和站点强关联的路由
const includes = [
    ...showDropmenuRoutes,
    '/cms/cms-settings/category',
    '/cms/cms-settings/article-source',
    '/cms/cms-settings/hotword',
    '/cms/cms-settings/sensitive',
    '/cms/cms-settings/imgHouse',
    '/cms/cms-settings/imgRecycle',
    '/cms/cms-settings/resourcesMage',
]

const isMatched = (route) => {
    if(route === '/'){
        return true
    }
    route = getRouteNoQuery(route)
    return includes.some(_route => pathToRegexp(_route).test(route))
}
const hasSite = () => {
    return store.getters['cms/site/hasSite']
}
const hasSites = () => {
    return store.getters['cms/site/hasSites']
}

const loadSites = () => {
    return store.dispatch('cms/site/loadSites')
}
const showSiteDropmenu = (route) => {
    if(route === '/'){
        return true
    }
    route = getRouteNoQuery(route)
    return showDropmenuRoutes.some(_route => pathToRegexp(_route).test(route))
}
export {
    isMatched as isMatchCMSSiteRoute,
    showSiteDropmenu,
    hasSite,
    hasSites,
    loadSites
}
