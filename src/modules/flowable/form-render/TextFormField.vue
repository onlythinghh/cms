<template>
    <el-form-item :label="name" :prop="id" :required="required">
        <el-input
            :placeholder="placeholder"
            :type="type"
            :maxlength="params.maxLength"
            :minlength="params.minLength"
            :readonly="readOnly"
            :value="value"
            v-bind="$attrs"
            @change="onInputChange"
            v-on="$listeners"
        />
    </el-form-item>
</template>
<script>
export default {
    name: 'TextFormField',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        fieldType: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        layout: {
            type: String,
            required: false,
            default: ''
        },
        name: {
            type: String,
            required: true
        },
        overrideId: {
            type: Boolean,
            required: true
        },
        params: {
            type: Object,
            default: () => { }
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        readOnly: {
            type: Boolean,
            required: true
        },
        required: {
            type: Boolean,
            required: true
        },
        type: {
            type: String,
            required: true,
            default: "text"
        },
        value: {
            type: Object,
            required: false,
            default: () => { }
        },
    },
    methods: {
        onInputChange(value) {
            if (this.$listeners['update:value']) {
                this.$emit('update:value', value)
            } else {
                this.$emit('change', value)
            }
        }
    }
}
</script>
