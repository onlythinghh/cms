

/**
 * 正在加载动画
 * 使用 this.$showLoading(true, '正在加载')
 * 关闭 this.$showLoading(false)
 */

import Vue from 'vue'
import store from '../store'

const showLoading = {
    name: 'elementShowLoadingPluing'
}
showLoading.install = () => {
    Vue.prototype.$showLoading = function (isLoading, text) {
        store.commit('showLoading', { isLoading, text })
    }
}
export default showLoading
