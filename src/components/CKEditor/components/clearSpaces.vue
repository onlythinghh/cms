<template>
    <div
        id="clear-spaces"
        @click="format()"
    >去除空格</div>
</template>
<script>
import mixin from '../mixins'
export default {
    name: 'ClearSpaces',
    mixins: [mixin],
    methods: {
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            str = str.replace(/([\u2E80-\u9FFF])(\s|(&nbsp;))+([\u2E80-\u9FFF])/g, '$1$4').replace(/([^\s])(\s|(&nbsp;))+([^\s])/g, '$1 $4')
            // .replace(/([\n\r])(\s|(&nbsp;))+([^\s])/, '$1 $4')
            !content && this.$props.editor.setData(str) // this.$emit('on-change', str)
            return str
        }
    }
}
</script>
