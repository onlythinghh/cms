import pathRegexp from 'path-to-regexp'
import { getRouteNoQuery } from '../../utils/BaseUtil'
const getters = {
    hasPermission(state, getters, rootState, rootGetters) {
        const permissions = rootState.authen.permissions
        return function (route) {
            route = getRouteNoQuery(route)
            const hasPermisssion = permissions.some(perm => !!pathRegexp(perm).test(route))
            return hasPermisssion
        }

    }
}
export default {
    namespaced: true,
    getters
}
