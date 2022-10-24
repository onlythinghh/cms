/**
 * Vue 节流组件 (事件)
 * 实例：
 * <v-throttle :timer="1000" :isEnable="true" events="click">
 *      <button @click="increment1"> 增加 </button>
 * </v-throttle>
 */
import { throttle } from '../utils/BaseUtil'

const Throttle = {
    name: 'v-throttle',
    abstract: true,
    props: {
        timer: Number,
        events: String,
        isEnable: {
            type: Boolean,
            default: true
        }
    },
    created() {
        this.eventKeys = this.events.split(',')
        this.originMap = {}
        this.throttledMap = {}
    },
    render() {
        const VNode = this.$slots.default[0]
        this.eventKeys.forEach(event => {
            const target = VNode.data.on[event]
            if (target === this.originMap[event] && this.throttledMap[event]) {
                VNode.data.on[event] = this.throttledMap[event]
            } else if (target) {
                this.originMap[event] = target
                this.throttledMap[event] = throttle(target, this.timer, this.isEnable, VNode)
                VNode.data.on[event] = this.throttledMap[event]
            }
        })
        return VNode
    }
}

export default Throttle
