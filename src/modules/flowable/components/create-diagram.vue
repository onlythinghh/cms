<template>
    <div>
        <el-dialog
            :visible="_visible"
            fullscreen
            class="diagram-modal"
            @close="onModalClose"
        >
            <template slot="title">{{title}}</template>
            <Modeler ref="modelerRef" v-bind="$attrs" @save="onSave" />
        </el-dialog>
        <Modal :visible="resourceNameModalVisible" title="确认名称" @close="onResourceNameModalClose">
            <el-form
                ref="resourceNameFormRef"
                :model="resourceForm"
                :rules="resourceFormRules"
                label-width="100px"
            >
                <el-row>
                    <el-form-item label="名称" prop="name">
                        <el-col :span="18">
                            <el-input
                                v-model="resourceForm.name"
                                placeholder="名称"
                                :maxlength="100"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onConfirmSave">确 认</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </Modal>
    </div>
</template>
<style lang="less">
.diagram-modal {
    .el-dialog__header {
        padding: 10px;
        color: #193f6c;
        background: #eaf1f9;
    }
    .el-dialog__body {
        padding: 0;
        height: calc(100vh - 45px);
    }
    .el-dialog__headerbtn {
        top: 10px;
        .el-dialog__close {
            color: #193f6c;
        }
        &:hover {
            opacity: 0.8;
            color: #193f6c;
            .el-dialog__close {
                color: #193f6c;
            }
        }
    }
    .bpmn-properties-panel {
        border-right: 0px;
    }
    .resource-name {
        max-width: 95%;
    }
}
</style>
<script>
import { Modeler } from '../modeler'
// import BpmnModdle from 'bpmn-moddle'
export default {
    components: {
        Modeler
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '新建流程'
        },
        save: {
            type: Function,
            default: () => { }
        },
        resourceName: {
            type: String,
            default: ''
        }
    },
    data() {
        const resourceFormRules = {
            name: [
                { required: true, message: '名称不能为空' },
                {
                    validator: (rule, value, callback) => {
                        if (!/^[\w\u4e00-\u9fa5](([\w\u4e00-\u9fa5-\s]+)?[\w\u4e00-\u9fa5])?$/.test(value)) {
                            callback('只允许输入中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        const resourceForm = {
            name: ''
        }
        return {
            resourceNameModalVisible: false,
            xml: null,
            resourceForm,
            resourceFormRules
        }
    },
    computed: {
        _visible: {
            get() {
                return this.visible
            },
            set(visible) {
                this.$emit('update:visible', visible)
            }
        },
    },
    watch: {
        resourceName(name) {
            this.resourceForm.name = name
        },
        visible(visible) {
            if (!visible) {
                this.onResourceNameModalClose()
            }
        }
    },
    methods: {
        onModalClose() {
            this._visible = false
        },
        showErrorMessage(errorMessage) {
            this.$refs.modelerRef.showErrorMessage(errorMessage)
        },
        onSave(xml) {
            this.xml = xml
            this.resourceNameModalVisible = true
        },
        onResourceNameModalClose() {
            this.xml = null
            this.resourceNameModalVisible = false
        },
        onConfirmSave() {
            this.$refs.resourceNameFormRef.validate(isValid => {
                if (isValid) {
                    const resourceName = this.resourceForm.name
                    this.$emit('save', { data: this.xml, resourceName })
                }
            })
        }
    }

}
</script>
