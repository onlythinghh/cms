import Vue from 'vue';
import moment from 'moment'
import zhCN from 'moment/locale/zh-cn'
moment.updateLocale('zh-cn', zhCN)

import Element from 'element-ui'
import router from './router';
import store from './store';
import i18n from './i18n';
import { cookie } from './utils/WebStore'
import App from './App.vue';
import uploder from 'vue-simple-uploader'

import './plugins'
import './components'
import './directives'
import './filters'

import 'normalize.css'
import "./assets/css/main.scss"
import './assets/icon/font.css'

Vue.use(Element, {
    size: cookie.get('size') || 'medium', // set element-ui default size,
    i18n: (key, value) => i18n.t(key, value)
})

Vue.use(uploder)
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app');
