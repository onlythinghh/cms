<template>
    <div>
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <el-col :span="6">
                            <el-form-item label="模板名称" prop="name">
                                <el-input v-model="searchForm.name" placeholder="模板名称" maxlength="100" clearable/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="模板类型" prop="type">
                                <el-select v-model="searchForm.type" class="w100" placeholder="模板类型" clearable>
                                    <el-option v-for="(text, key) in templateType" :key="key" :label="text"
                                               :value="Number(key)"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="searchTemplateType">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <template v-slot:header-left>
                <el-button v-if="hasPermission('TPL_ADD')"	type="primary" icon="el-icon" @click="_editTemplate('add',{})">新增</el-button>
                <el-button v-if="hasPermission('TPL_IMPORT')" type="primary" icon="el-icon" @click="_importTemplate()">导入</el-button>
                <el-button v-if="hasPermission('TPL_EXPORT')" type="primary" icon="el-icon" @click="_exportTemplate()">批量导出</el-button>
                <el-button v-if="hasPermission('TPL_EXPORT')" type="primary" icon="el-icon" @click="_exportTemplateAll()">全站导出</el-button>
            </template>
            <el-table v-if="hasPermission('TPL_VIEW')" :data="data" border stripe @selection-change="select">
                <el-table-column type="selection" label=" " width="50"></el-table-column>
                <el-table-column prop="name" label="模板名称" >
                    <template v-slot="{row}">
                        <el-link v-if="hasPermission('TPL_VIEW')" type="primary" @click="_editTemplate('view',row)" >
                            <span>{{ row.name }}</span>
                        </el-link>
                        <span v-else>{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fileName" label="文件名"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="type" label="模板类型">
                    <template v-slot="{row}">
                        {{templateType[row.type]}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200px" align="center">
                    <template v-slot="{row}">{{row.createTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column prop="createUser" label="创建人"></el-table-column>
                <el-table-column label="操作" width="400px">
                    <template v-slot="{row}">
                        <el-button
                            v-if="hasPermission('TPL_UPDATE')"
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            @click="_editTemplate('edit', row)"
                        >
                            修改
                        </el-button>
                        <el-button
                            v-if="hasPermission('TPL_DELETE')"
                            size="mini" type="danger"
                            icon="el-icon-delete"
                            @click="_deleteTemplate(row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template v-if="hasPermission('TPL_VIEW')" v-slot:pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :page-size="searchForm.limit"
                    :total="searchForm.total"
                    @current-change="changePagination"
                ></Pagination>
            </template>
        </TableRow>
        <Modal
            :visible="editVisible"
            :destroy-on-close="true"
            top="20px"
            width="80%"
            title="编辑模板"
            @close="_editTemplateModalClose"
        >
            <TemplateAdd
                :type="editType"
                @close="_editTemplateModalClose"
            />
        </Modal>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { showLoading, showError, showMessage, confirm } from '../../../utils'
import { DEFAULT_PAGE_LIMIT } from "@/utils/Const";
import siteMixin from '../../cms/cmsmixins/siteMixin.js'
import TemplateAdd from './templateAdd'
export default {
    components:{
        TemplateAdd
    },
    mixins: [siteMixin],
    data() {
        const searchForm={
            appid:null,
            page:1,
            type:'',
            name:'',
            limit:DEFAULT_PAGE_LIMIT,
            total:0
        }
        return {
            selectIds:[],
            searchForm,
            currentSite: [],
            editVisible: false,
            editType: 'add'
        }
    },
    computed: {
        ...mapState('cms/template', ['data', 'page', 'limit', 'total']),
        ...mapState('authen', ['userinfo']),
        // ...mapState('cms/site', ['site','sites']),
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('cms/site', ['site']),
        templateType() {
            return this.getDictionary('templateType')
        },

    },
    watch: {
        // "hasPermission('TPL_VIEW')" :function(v) {
        //     console.log(v)
        // }
    },
    created() {
        this.loadSites()
        this.loadTemplateList()
        // this.sites.map(item=>{
        //     if(item.id === this.site.id)
        //         this.currentSite = item
        // })
    },
    methods: {
        ...mapActions('cms/site', ['loadSites']),
        // 判断是否有按钮操作权限,并且不是管理员
        hasPermission (permission) {
            return (this.site.authString || []).indexOf(permission) !== -1
        },
        ...mapActions('cms/template', [
            'getTemplateList',
            'deleteTemplate',
            'exportTemplate',
            'exportTemplateAll'

        ]),
        reloadWhenSiteChange(){
            this.loadTemplateList()
        },
        // 查询
        searchTemplateType(){
            this.searchForm.page=1
            this.loadTemplateList()
        },

        // 模板列表页的渲染
        loadTemplateList() {
            if(this.hasPermission('TPL_VIEW')) {
                showLoading(true, '正在加载模板列表')
                this.getTemplateList({ ...this.searchForm })
                    .then(({ count }) => {
                        this.searchForm.total = count
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }

        },

        // 改变当前页
        changePagination(currentPage) {
            this.searchForm.page = currentPage
            this.loadTemplateList()
        },
        // 删除模板
        _deleteTemplate(templateinfo = {}) {
            if (!templateinfo.id) {
                showError('用户信息获取失败, 无法删除')
                return
            }
            confirm(`此操作不可恢复, 确认删除模板 ${templateinfo.name} ?`, '警告', {
                ok: () => {
                    const template = { id: templateinfo.id }
                    showLoading(true, `正在删除模板 ${templateinfo.name}`)
                    this.deleteTemplate(template)
                        .then(() => {
                            showMessage('删除模板成功')
                            this.loadTemplateList()
                            showLoading(false)
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            })
        },

        // 导入模板
        _importTemplate () {
            this.$router.push({ name: 'templateImport'})
        },

        // 修改修改模板
        _editTemplate(type, templateinfo ) {
            this.$store.commit('cms/template/editTemplate', templateinfo)
            this.editVisible = true
            this.editType = type
            // this.$router.push({ name: 'templateAdd',query:{type:type}})
        },
        _editTemplateModalClose(isReload){
            this.editVisible = false
            this.editType = 'add'
            this.$store.commit('cms/template/editTemplate', {})
            if(isReload === true){
                this.loadTemplateList()
            }
        },
        // 手动勾选数据行发生的事件
        select(selection){
            this.selectIds = selection
        },
        // 导出模板
        _exportTemplate(){
            if (this.selectIds.length===0) {
                showMessage({
                    type: 'warning',
                    message: '请至少选择一个要导出的模板'
                })
            }else{
                const newSelectIds = []
                this.selectIds.map(item => newSelectIds.push(item.id))
                const ids = { ids: newSelectIds.join(',') }
                showLoading(true, `正在导出模板`)
                this.exportTemplate(ids)
                    .then(() => {
                        showMessage('导出模板成功')
                        this.loadTemplateList()
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }
        },
        _exportTemplateAll () {
            this.exportTemplateAll()
                .then(() => {
                    showMessage('导出模板成功')
                    this.loadTemplateList()
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        }
    }

}


</script>
<style lang="scss" scoped>
    /deep/ .el-form-item__error{
        position: relative ;
    }
    /deep/ .el-form-item.is-error{
        margin-bottom: 5px;
    }
</style>
