<template>
    <div
        id="clear-link"
        @click="format()"
    >去除超链接</div>
</template>

<script>
import mixin from '../mixins'
export default {
    name: 'ClearLink',
    mixins: [mixin],
    methods: {
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            str = str.replace(/<a(\s[a-z]+="[^>"]*")*\s?>/gi, '').replace(/<\/a>/, '')
            !content && this.$props.editor.setData(str) // this.$emit('on-change', str)
            return str
        }
    }
}
</script>
