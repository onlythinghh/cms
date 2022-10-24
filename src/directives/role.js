/**
 * 判断是否有角色的指令
 * v-hasRole="'admin'"
 */
import store from '../store'
class Role {
    name = 'hasRole'
    inserted(el, { value }, vnode) {
        const roles = (store.state.authen.roles || []).map(role => role.code)
        if (!roles || roles.length === 0 || roles.indexOf(value) === -1) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}

export default new Role()
