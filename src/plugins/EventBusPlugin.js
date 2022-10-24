/**
 * 事件总线eventBus的实质就是创建一个vue实例
 * 通过一个空的vue实例作为桥梁实现vue组件间的通信。它是实现非父子组件通信的一种解决方案
 *
 * 实现：
 * 每个Vue实例有自己的 _uid作为唯一标识，因此我们让 EventBus和_uid`关联起来
 * 详见 vue/src/core/instance/init.js
 * Vue.prototype._init
 *
 * 使用：
 * 1、在main.js中
 * import EventBus from './EventBus.js'
 * Vue.use(EventBus)
 *
 * 2、在 example1 组件中监听 事件
 * ...
 * created(){
 *      // 注意第三个参数需要传当前组件的 this，如果不传则需要手动销毁
 *      this.$eventBus.on('showUpdateData', (...args)=>{
 *          // TODO 处理 args
 *      }, this)
 * }
 * beforeDestroy(){
 *      // 不需要手动 off 订阅的事件
 * }
 * ...
 *
 * 3、在 example2 中触发事件
 * ...
 * methods:{
 *      updateData(){
 *          this.$eventBus.emit('showUpdateData', this.data)
 *      }
 * }
 * ...
 *
 * 注意：
 * 1、example1 组件和 example2 并不需要特别的关系
 * 2、无法跨路由通信
 */

class EventBus {
    constructor(Vue) {
        if (!this.handlers) {
            Object.defineProperties(this, {
                handlers: {
                    value: {},
                    enumerable: false
                },
                uidEvent: { // _uid 和event的映射
                    value: {},
                    enumerable: false
                }
            })
        }
        this.Vue = Vue
    }
    setUidEvent(uid, eventName) {
        if (!this.uidEvent[uid]) this.uidEvent[uid] = []
        // 把每个_uid 订阅的事件名字push到各自uid所属的数组里
        this.uidEvent[uid].push(eventName)
    }
    on(eventName, callback, vm) {
        // vm是在组件内部使用时组件当前的this用于取_uid
        if (!this.handlers[eventName]) this.handlers[eventName] = []
        this.handlers[eventName].push(callback)
        if (vm instanceof this.Vue) this.setUidEvent(vm._uid, eventName)
    }
    emit(eventName, ...rest) {
        // 触发事件
        if (this.handlers[eventName]) {
            const callbacks = this.handlers[eventName] || []
            callbacks.forEach(callback => {
                callback.apply(null, rest)
            })
        }
    }
    offEvent(eventName) {
        delete this.handlers[eventName]
    }
    off(uid) {
        const events = this.uidEvent[uid] || []
        events.forEach(event => {
            this.offEvent(event)
        })
    }
}

// 写成 vue插件形式 直接引入然后Vue.use($EventBus)进行使用
const $EventBus = {
    name: 'EventBus'
}
$EventBus.install = (Vue, options) => {
    Vue.prototype.$eventBus = new EventBus(Vue, options)
    Vue.mixin({
        beforeDestroy() {
            // 拦截beforeDestroy钩子自动销毁自身所有订阅的事件
            // 防止占用内存
            this.$eventBus.off(this._uid)
        }
    })
}
export default $EventBus
