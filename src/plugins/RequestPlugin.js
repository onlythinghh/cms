import Request from '../request'

// axios vue 插件
const $request = {
    name: 'request'
}
$request.install = function (Vue) {
    Vue.prototype.$request = Request
}

export default $request
