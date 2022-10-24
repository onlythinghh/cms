<template>
    <el-popover
        v-model="contentPopoverVisible"
        placement="bottom-start"
        @show="contentPopoverVisible = true"
        @hide="contentPopoverVisible = false"
    >
        <el-upload
            action
            :show-file-list="false"
            :drag="true"
            :http-request="onNewContent"
            :before-upload="onBeforeUpload"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
                <strong>文件不能大于5MB</strong>
            </div>
            <div v-if="tips" slot="tip" class="el-upload__tip">
                <el-link :underline="false" type="danger">{{tips}}</el-link>
            </div>
        </el-upload>
        <template slot="reference">
            <span>
                <slot>
                    <i class="el-icon-circle-plus-outline task-action-icon"></i>
                </slot>
            </span>
        </template>
    </el-popover>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        upload: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return { tips: '' }
    },
    computed: {
        contentPopoverVisible: {
            get() {
                return this.visible
            },
            set(isVisible) {
                this.$emit('update:visible', isVisible)
            }
        }
    },
    methods: {
        onNewContent(args) {
            this.tips = ''
            this.$emit('upload', args)
        },

        onBeforeUpload(file) {
            if (file.size / 1024 / 1024 > 5) {
                this.tips = "文件大小不能超过5MB"
                return false
            }
            return true
        },
    }
}
</script>
