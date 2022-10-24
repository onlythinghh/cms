/**
 * 判断是否有权限的指令
 * v-hasPermission="user-add"
 */
import store from '../store'
class Permission {
    name='hasPermission'
    inserted(el, { value }, vnode) {
        const buttons = store.state.authen.buttons || []
        if (!buttons || buttons.length === 0 || buttons.indexOf(value) === -1) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}

export default new Permission()
