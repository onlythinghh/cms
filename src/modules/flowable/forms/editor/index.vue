<template>
    <div>
        <el-button type="primary">保存</el-button>
    </div>
</template>
<script>
// import viewer from './components/viewer'
export default {
    components: {
        // viewer
    },
    data() {
        return {
            fields: [
                // eslint-disable-next-line
                { "fieldType": "FormField", "id": "label", "name": "Label", "type": "text", "value": null, "required": false, "readOnly": false, "overrideId": false, "placeholder": null, "params": { "passwordunmask": true, "minLength": "12", "maxLength": "213" }, "layout": null }
            ],
            outcomes: [
                {
                    id: 'resolve',
                    name: '同意'
                },
                {
                    id: 'reject',
                    name: '拒绝'
                }
            ]
        }
    }
}
</script>

