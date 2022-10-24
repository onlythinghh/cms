<template>
    <div
        id="clear-style"
        @click="handler"
    >去除样式</div>
</template>
<script>
import mixin from '../mixins'
import { debounce } from '../utils'
export default {
    name: 'ClearStyle',
    mixins: [mixin],
    methods: {
        handler() {
            debounce(this.format, 500, 'clearStyleTimer')()
        },
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            str = str.replace(/\sstyle="[^"]+"/gi, '').replace(/<\/?((strong)|(em)|u|s|(sub)|(sup))>/gi, '')
            !content && this.$props.editor.setData(str) // this.$emit('on-change', str)
            var arr = str.split('</style>')
            if(arr.length){
                str = ''
                arr.forEach((item)=>{
                    str+= item.slice(0,item.indexOf('<style'))
                })
            }
            return str
        }
    }
}
</script>
