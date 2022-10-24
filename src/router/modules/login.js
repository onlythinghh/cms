import i18n from '../../i18n'
import Login from '../../views/login/login.vue'
import store from '../../store'
import { loginRoute, logoutRoute, simpleLoginRout } from '../../utils/ServiceUtil'
import simpleLogin from '../../views/simpleLogin/simpleLogin.vue'
export default [
    {
        ...loginRoute,
        component: Login,
        meta: { title: i18n.t('login') }
    },
    {
        ...logoutRoute,
        beforeEnter: (to, from, redirect) => {
            store.commit('authen/logout')
            redirect(loginRoute)
        }
    },
    {
        ...simpleLoginRout,
        component: simpleLogin,
        meta: { title: i18n.t('官网内容管理系统')}
    }
]
