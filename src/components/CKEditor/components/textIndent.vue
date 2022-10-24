<template>
    <div id="text-indent-wrapper" @click="handler">首行缩进</div>
</template>
<script>
import mixin from '../mixins'
import { debounce } from '../utils'
export default {
    name: 'TextIndent',
    mixins: [mixin],
    methods: {
        async handler() {
            debounce(this.format, 500, 'textIndentTimer')()
        },
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            const div = document.createElement('div')
            div.innerHTML = str
            const childNodes = div.querySelectorAll('p') || []
            for (let i = 0; i < childNodes.length; i++) {
                const node = childNodes[i]
                if (node.nodeName.toLowerCase() === 'p') {
                    if (!node.style.textIndent || parseInt(node.style.textIndent) !== 2) {
                        node.style.textIndent = '2em'
                    }
                }
            }
            str = div.innerHTML
            !content && this.$props.editor.setData(str) //this.$emit('on-change', result)
            return str
        }
    }
}
</script>
