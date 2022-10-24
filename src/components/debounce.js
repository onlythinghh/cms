/**
 * Vue 防抖组件
 * 实例：
 * <v-debounce :timer="1000" :isEnable="true" events="click">
 *      <button @click="increment1"> 增加 </button>
 * </v-debounce>
 */
import { debounce } from '../utils/BaseUtil'

const Debounce = {
    name: 'v-debounce',
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
                this.throttledMap[event] = debounce(target, this.timer, this.isEnable, VNode)
                VNode.data.on[event] = this.throttledMap[event]
            }
        })
        return VNode
    }
}

export default Debounce
