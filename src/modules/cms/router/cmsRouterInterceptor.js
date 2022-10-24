import { showError, showLoading } from '../../../utils';
import { hasSites, isMatchCMSSiteRoute, loadSites } from './cmsRoute'


export default (to, from, next) => {
    const fullPath = to.fullPath
    if (isMatchCMSSiteRoute(fullPath)) {
        // 获取站点
        if (!hasSites()) {
            showLoading(true, '正在加载站点信息')
            loadSites().then(() => {
                showLoading(false)
                next()
            }).catch(error => {
                showLoading(false)
                // 跳转到 站点页面
                showError(error.message)
                // next('/cms/sites/site-list')
            })
        } else {
            next()
        }
    } else {
        next()
    }
}
