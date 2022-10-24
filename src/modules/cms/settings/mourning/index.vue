<template>
    <div class="mourning">
        <div class="header">
            <span style="margin-right: 20px;">打开灰白功能:</span>
            <el-switch
            v-model="status"
            @change="change"
            >
            </el-switch>
        </div>
        <p>说明：灰白功能打开后,整个网站（预览、静态化）的页面会全部置灰</p>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { showLoading, hideLoading } from "@/utils";
export default {
    data() {
        return {
            status: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        ...mapActions('cms/settings/mourning',['search','set']),
        async init() {
            showLoading('加载中...')
            const {data} = await this.search()
            hideLoading()
            this.status = data.open
        },
        async change() {
            showLoading('切换中...')
            const data = await this.set({
                open: this.status
            })
            hideLoading()
            if(data.success) {
                this.$message({
                    type: 'success',
                    message: '设置成功'
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.mourning {
    width: 100%;
}
</style>