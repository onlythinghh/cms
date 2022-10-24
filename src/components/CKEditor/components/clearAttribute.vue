<template>
    <div
        id="clear-attribute"
        @click="handler"
    >去除属性</div>
</template>
<script>
import mixin from '../mixins'
import { debounce } from '../utils'
export default {
    name: 'ClearAttribute',
    mixins: [mixin],
    methods: {
        handler() {
            debounce(this.format, 500, 'clearAttributeTimer')()
        },
        format(content = '') {
            let str = content || (this.$props.editor && this.$props.editor.getData()) || this.content
            str = str.replace(/(<[^>]+>)/gi, function(str, preElementStr) {
                if (/^<[^/][a-z]+\s?\/?>$/i.test(preElementStr)) {
                    // 空标签
                    return str
                }
                return str.replace(
                    preElementStr,
                    preElementStr.replace(/^<[a-z]+\s([\s\S]+[^/])\/?>$/i, function(elementStr, attributes) {
                        let attrStr = ''
                        // 排除 style src alt href target 属性
                        const regexp = new RegExp('(src|alt|href|style|target)=["\'][^"\']+["\']', 'gi')
                        let arr
                        while ((arr = regexp.exec(attributes)) != null) {
                            attrStr += arr[0] + ' '
                        }
                        return elementStr.replace(attributes, attrStr)
                    })
                )
            })
            // str = str.replace(/\s(?!(src|alt|href|style|target))[-_a-z\d]+="[^>]+"/gi, '')
            !content && this.$props.editor.setData(str) // this.$emit('on-change', str)
            return str
        }
    }
}
</script>
