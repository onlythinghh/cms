<template>
    <el-dialog
        title="预览"
        :visible.sync="mobldShow"
        :width="mediaType == 'mobile'? '500px': '950px'"
        :before-close="checkClose"
        class="proviws"
    >
        <section v-if="mediaType == 'mobile'">
            <iframe
                class="preview-content"
                :src="url"
                width="375" height="667"
                frameborder="0"
            />
        </section>
        <section v-else-if="mediaType == 'pad'" class="pad">
            <iframe
                class="preview-content"
                :src="url"
                width="768" height="1024"
                frameborder="0"
            />
        </section>
    </el-dialog>
</template>
<script>
export default {
    props:{
        url:{
            type: String,
            default: ''
        },
        mobileVisible: {
            type: Boolean,
            default: false
        },
        mediaType: {
            type: String,
            default: 'mobile'
        }
    },
    data() {
        return{
            mobldShow: false
        }
    },
    watch:{
        mobileVisible(nextVisible) {
            this.mobldShow = nextVisible
        }
    },
    methods:{
        checkClose(){
            this.$emit('closed')
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body{
    display: flex;
    justify-content: center;
}
.pad{
    height: 1194px;
    background: url('../../../../../assets/images/pad_bg.png') no-repeat;
    padding: 45px 51px;
    background-size: contain;
}
</style>