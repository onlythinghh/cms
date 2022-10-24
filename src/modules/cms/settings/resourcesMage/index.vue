<template>
    <div class="resourcesMage">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
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
                            <el-button type="primary" @click="queryRresourcesList">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="addsucrs">新增</el-button>
                <el-button type="primary" @click="deleteTableData">删除</el-button>
                <el-button type="primary" @click="onDownload">下载</el-button>
            </template>
            <div class="tab_bar">
                <resourcesList
                    ref="resListRef"
                    :search-info="searchInfo"
                    @changeItems="changeItems"
                    @selectionChange="handleSelectionChange"
                ></resourcesList>
                
            </div>
        </TableRow>
        <addFiles
            v-bind="imageData"
            @close="closeaddImgModal"
            @loadInitList="loadInitList"
        />
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import addFiles from './addFiles/index.vue'
import resourcesList from './resourcesList/resourcesList.vue'
import { showMessage } from '@/utils'
import { downLoadFile } from '@/utils/FileDonwload'
export default {
    components:{
        addFiles,
        resourcesList
    },
    data() {
        return {
            imageData:{
                visible: false
            },
            searchInfo: {
                name:'',
                keyword: '',
                status: ''
            },
            statusOpt: [
                { value: '0', label: '待发布' },
                { value: '1', label: '已发布' },
                { value: '2', label: '已下线' }
                
            ],
            tableItemSelected: [], // 表格被勾选的数据
        }
    },
    computed: {
        ...mapGetters('cms/settings/resourcesMage', ['resChangeinfo'])
    },
    mounted(){
    },
    methods:{
        ...mapActions('cms/settings/resourcesMage', ['getCountResources', 'getdDelResources', 'setResChangeinfo']),

        // 获取列表数据
        queryRresourcesList() {
            this.$refs.resListRef.queryRresourcesList()
        },
        addsucrs(){
            this.setResChangeinfo({})
            this.imageData.visible = true
        },
        loadInitList(){
            this.queryRresourcesList()
        },
        // 重置查询条件
        resetForm() {
            this.$refs.searchRef.resetFields()
            this.searchInfo = this.$options.data().searchInfo
            let thit = this
            this.$nextTick(() => {
                thit.queryRresourcesList()
            })
        },
        // 修改表格当前条数据
        changeItems(data, index){
            this.setResChangeinfo(data)
            this.imageData.visible = true
        },
        // 表格多选框
        handleSelectionChange(val){
            // console.log('itemselect', val)
            this.tableItemSelected = val;
        },

        // 下载
        onDownload() {
            if (!this.tableItemSelected.length) {
                showMessage({
                    type: "warning",
                    message: `请选择一条需要下载的资源！`
                });
            } else {
                console.log('要下载的资源', this.tableItemSelected)
                let arr = []
                let ids = []
                this.tableItemSelected.map(item => {
                    arr.push(item.pcResourcesUrl)
                    ids.push(item.id)
                })
                downLoadFile(arr).then(() => {
                    this.getCountResources({ids: ids}).then(res => {
                        // console.log('下载统计res', res)
                    })
                })
            }
        },
        // 删除
        deleteTableData(){
            if (!this.tableItemSelected.length) {
                showMessage({
                    type: "warning",
                    message: `请选择一条需要删除的资源！`
                });
            } else {
                let isLoad = this.tableItemSelected.every(ele => ele.status != 1)
                console.log('sts:',isLoad)
                if(!isLoad) {
                    this.$confirm('删除资源中包含已发布的数据，确认删除吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteResources()
                    }).catch(() => {});
                } else {
                    this.deleteResources()
                }
            }
        },
        deleteResources(){
            console.log('要删除的资源', this.tableItemSelected)
            let ids = []
            this.tableItemSelected.map(item => {
                ids.push(item.id)
            })
            let patams = {ids: ids}
            // console.log('patams',patams)
            this.getdDelResources(patams).then(res => {
                if(res.success) {
                    this.queryRresourcesList()
                    showMessage({
                        type: "success",
                        message: res.errMsg||'操作成功!'
                    });
                } else {
                    showMessage({
                        type: 'error',
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
            })
        },
        closeaddImgModal() {
            this.imageData.visible = false
            this.setResChangeinfo({})
        },
    }
}
</script>
<style lang="scss" scoped>
// .resourcesMage{

// }
</style>