<template>
    <el-dialog
        class="el-modal"
        :width="width"
        :close-on-click-modal="closeOnClickModal"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot></slot>
    </el-dialog>
</template>
<style lang="scss">
</style>

<script>
export default {
    name: 'Modal',
    props: {
        width: {
            type: String || Number,
            default: '600px'
        },
        closeOnClickModal: {
            type: Boolean,
            default: false
        }
    }
}
</script>
