<template>
    <div
        id="blank-line-wrapper"
        @click="format()"
    >清除空行</div>
</template>
<script>
import mixin from '../mixins'
export default {
    name: 'ClearBlankLine',
    mixins: [mixin],
    methods: {
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            // 简单替换
            str = str
                .replace(/&nbsp;/gi, '')
            str = str
                // .replace(/<p[^>]*><\/p>/gi, '')
                // .replace(/<p><\/p>/gi, '')
                // .replace(/<div><\/div>/gi, '')
                .replace(/<br\s*\/>/gi, '')
            // 替换所有空的 div p span
            let regexpArr
            while ((regexpArr = /(<p\s*>\s*<\/p>)|(<div\s*>\s*<\/div>)|(<span\s*>\s*<\/span>)/gi.exec(str)) != null) {
                str = str.replace(regexpArr[0], '')
            }
            !content && this.$props.editor.setData(str) //this.$emit('on-change', str)
            return str
        }
    }
}
</script>
