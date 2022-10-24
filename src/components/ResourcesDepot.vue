<template>
    <el-dialog 
        title="资源库" 
        :visible="isShowLead"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        width="80%"
        append-to-body
        @close="handelClose"
    >
        <el-form ref="searchRef" label-width="80px" :model="searchInfo">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="标题名称">
                        <el-input
                            v-model="searchInfo.name"
                            placeholder="请输入标题"
                            clearable
                            maxlength="150"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="标签">
                        <el-input
                            v-model="searchInfo.keyword"
                            placeholder="请输入标签名称"
                            clearable
                            maxlength="150"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态">
                        <el-select v-model="searchInfo.status" clearable placeholder="请选择" style="width: 100%">
                            <el-option
                                v-for="item in statusOpt"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="queryList">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
        <resourcesList
            ref="resListRef"
            :search-info="searchInfo"
            :is-load-operation="false"
            :eheight="'500px'"
            @selectionChange="handleSelectionChange"
        ></resourcesList>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="confirmList">确定</el-button>
                <el-button size="small" @click="handelClose">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import resourcesList from '../modules/cms/settings/resourcesMage/resourcesList/resourcesList.vue'
export default {
    name: 'ResourcesDepot',
    components:{
        resourcesList
    },
    props:{
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            isShowLead: false,
            // resourcesDialog: false,
            searchInfo: {
                name:'',
                keyword: '',
                status: ''
            },
            tableItemSelected: [],
            statusOpt: [
                { value: '0', label: '待发布' },
                { value: '1', label: '已发布' },
                { value: '2', label: '已下线' }
            ],
        }
    },
    watch: {
        visible(v) {
            this.isShowLead = v
            if(!v) {
                this.resetForm()
            }
        },
    },
    methods:{
        queryList() {
            this.$refs.resListRef.queryRresourcesList()
        },

        // 重置查询条件
        resetForm() {
            this.$refs.searchRef.resetFields()
            this.searchInfo = this.$options.data().searchInfo
            let thit = this
            this.$nextTick(() => {
                thit.queryList()
            })
        },

        handleSelectionChange(val){
            // console.log('itemselect', val)
            this.tableItemSelected = val;
        },
        // 确定
        confirmList() {
            this.$emit('confirmList', this.tableItemSelected)
        },

        handelClose() {
            this.$emit('closeImageModal', false)
        },
    }
}
</script>