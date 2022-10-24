<template>
    <div
        id="punctuation-wrapper"
        @click="translate"
    >标点：{{ btnText }}</div>
</template>
<script>
import mixin from '../mixins'
export default {
    name: 'Punctuation',
    mixins: [mixin],
    data() {
        return {
            punctuation: {
                '.': '。',
                ',': '，',
                ';': '；',
                ':': '：'
            },
            flag: true
        }
    },
    computed: {
        btnText() {
            return this.flag ? '中->英' : '英->中'
        }
    },
    methods: {
        translate() {
            let str = (this.$props.editor && this.$props.editor.getData()) || this.content
            var result = ''
            for (var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i)
                //  “65248”是转换码距
                // 46 => .  44=>, 59=>; 58=>:
                if (this.flag) {
                    // 中 -> 英
                    if (code === 12290) {
                        result += String.fromCharCode(46)
                    } else if (code === 65292 || code === 65306 || code === 65307) {
                        result += String.fromCharCode(str.charCodeAt(i) - 65248)
                    } else {
                        result += str.charAt(i)
                    }
                } else {
                    // 英 =》 中
                    if (code === 46) {
                        result += String.fromCharCode(12290)
                    } else if (code === 44 || code === 58 || code === 59) {
                        result += String.fromCharCode(str.charCodeAt(i) + 65248)
                    } else {
                        result += str.charAt(i)
                    }
                }
            }
            this.flag = !this.flag
            // this.$props.editor.setData(str)
            this.$props.editor.setData(result) //this.$emit('on-change', str)
        }
    }
}
</script>
