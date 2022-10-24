<template>
    <el-select
        v-model="select.value"
        :multiple="multiple"
        :placeholder="placeholder"
        class="el-tree-select w100"
        clearable
        :disabled="disabled"
        @clear="_clear"
        @visible-change="_selectCollapse"
    >
        <el-option :value="select.value" :label="select.text" class="el-tree-select-option">
            <el-tree
                ref="el-select-tree"
                :node-key="valueProp"
                :data="options"
                :show-checkbox="checkbox"
                :check-on-click-node="checkedOnClick"
                :default-expanded-keys="expandedKeys"
                check-strictly
                class="el-tree-select-dropdown"
                @node-click="_click"
                @check="_check"
            ></el-tree>
        </el-option>
    </el-select>
</template>
<style lang="scss">
.el-tree-select-option {
    height: auto !important;
    line-height: inherit !important;
    padding: 0 !important;
    border-radius: 4px;
    .el-tree-select-dropdown {
        border-radius: 4px;
        padding: 10px;
        .el-tree-node__label {
            font-weight: normal;
        }
    }
}
</style>

<script>
export default {
    name: 'TreeSelect',
    model: {
        prop: 'value',
        event: 'update'
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        multiple: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        valueProp: {
            type: String,
            default: 'value'
        },
        textProp: {
            type: String,
            default: 'text'
        },
        checkbox: {
            type: Boolean,
            default: true
        },
        click: {
            type: Function,
            default: () => { }
        },
        checked: {
            type: Function,
            default: () => { }
        },
        checkedOnClick: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number, Array, undefined],
            default: undefined
        }
    },
    data() {
        // const { multiple } = this.$props
        return {
            select: {
                value: '',
                text: ''
            }
        }
    },
    computed: {
        expandedKeys() {
            const { value } = this.$props
            if (value) {
                if (!Array.isArray(value)) {
                    return [value]
                }

                return value
            }
            return []
        }
    },
    watch: {
        value(nextValue) {
            this._reset(nextValue)
        }
    },
    created() {
        const { value } = this.$props
        this._reset(value)
    },
    methods: {
        _reset(value) {
            this.$nextTick(() => {
                if (value) {
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                            this.select = { value: '', text: '' }
                        }
                        this.$refs['el-select-tree'].setCheckedKeys(value)
                    } else {
                        this.$refs['el-select-tree'].setCheckedKeys([value])
                    }
                    const { valueProp, textProp } = this.$props
                    const nodes = this.$refs['el-select-tree'].getCheckedNodes()
                    if (nodes && nodes.length > 0) {
                        const node = nodes[0]
                        this.select = {
                            value: node[valueProp],
                            text: node[textProp]
                        }
                    }
                } else {
                    // 取消选择的值
                    this.select = { value: '', text: '' }
                    // 去掉选中
                    this.$refs['el-select-tree'].setCheckedKeys([])
                }
            })
        },
        _click(data) {
            const { click } = this.$props
            click && click(data)
        },
        _check(data) {
            const { checked } = this.$props
            this.__selected(data)
            checked && checked(data)
        },
        _selectCollapse() {
            //const { value } = this.$props
            // TODO 滚动条定位问题

        },
        __selected(data) {
            const { valueProp, textProp } = this.$props
            this.$refs['el-select-tree'].setCheckedKeys([data[valueProp]])
            this.select = {
                value: data[valueProp] || '',
                text: data[textProp] || '',
                data: data
            }
            this.$emit('update', this.select.value)
        },
        _clear() {
            this.select = { value: '', text: '' }
            this.$refs['el-select-tree'].setCheckedKeys([])
            this.$emit('update', this.select.value)
        }
    }
}
</script>
