<template>
    <div
        id="clear-image"
        @click="format()"
    >清除图片</div>
</template>

<script>
import mixin from '../mixins'
export default {
    name: 'ClearImage',
    mixins: [mixin],
    methods: {
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            // str = str.replace(/<img(\s[a-z]+="[^>"]*")*\s?\/?>/gi, '')
            str = str.replace(/<img[^>]*>/gi, '')
            !content && this.$props.editor.setData(str) // this.$emit('on-change', str)
            return str
        }
    }
}
</script>
