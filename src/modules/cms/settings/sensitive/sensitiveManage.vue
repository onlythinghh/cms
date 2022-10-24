<template>
    <div>
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <el-col :span="6">
                            <el-form-item label="敏感词">
                                <el-input
                                    v-model="searchForm.word"
                                    placeholder="名称"
                                    clearable
                                    maxlength="150"
                                />

                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="站点" >
                                <el-select v-model="searchForm.appid" placeholder="选择站点" clearable>
                                    <el-option
                                        v-for="(site, index) in sites"
                                        :key="index"
                                        :value="Number(site.id)"
                                        :label="site.name"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="分类">
                                <el-select v-model="searchForm.category" class="w100" placeholder="选择分类" clearable>
                                    <el-option v-for="(category, index) in typeList" :key="index" :label="category.name"
                                               :value="category.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="searchSensitiveWord">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <template v-slot:header-left>
                <el-button type="primary" icon="el-icon" @click="_addSensitiveWord">新增</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="_deleteSensitiveWords">批量删除</el-button>
            </template>
            <el-table border stripe :data="data" @selection-change="select">
                <el-table-column type="selection" label=" " width="50"></el-table-column>
                <el-table-column prop="word" label="敏感词名称" ></el-table-column>
                <el-table-column prop="categoryName" label="分类名称" ></el-table-column>
                <el-table-column prop="swap" label="替换词"></el-table-column>
                <el-table-column prop="createBy" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200px" align="center">
                    <template v-slot="{row}">{{row.createTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作" width="400px">
                    <template v-slot="{row}">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="_editSensitiveWord(row)">修改
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="_deleteSensitiveWord(row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <template v-slot:pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :page-size="searchForm.limit"
                    :total="searchForm.total"
                    @current-change="changePagination"
                ></Pagination>
            </template>
        </TableRow>

        <EditModal v-bind="edit" @close="closeEditModal"></EditModal>
        <!-- v-model="isShow" :type="modelType" -->
    </div>
</template>

<script>
import { showLoading, showError,confirm,showMessage} from '../../../../utils'
import { mapState, mapActions, mapGetters } from 'vuex'
import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
import EditModal from './edit.vue'
export default {
    components: {
        EditModal
    },
    data() {
        const searchForm = {
            appid: '',
            word: '',
            category:null,
            page: 1,
            limit:DEFAULT_PAGE_LIMIT,
            total:0,
            type:2
        }
        return {
            hotWordCategories:[],
            searchForm,
            selectIds:[],
            modelType: '',
            isShow: false,
            edit:{
                visible:false,
                info:{},
                hotWordCategoriesChild:[]
            },
            type:{
                type:2
            }
        }
    },
    computed: {
        ...mapState('cms/settings/sensitive', ['data','typeList']),
        ...mapState('cms/settings/category', ['categories']),
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
    },
    watch: {



    },
    created() {

        this.loadSensitiveWordList()
        this._classify()
        
    },
    methods: {
        ...mapActions('cms/settings/sensitive', [
            'getSensitiveWordList',
            'deleteSensitiveWord',
            'classify'

        ]),
        // ...mapActions('cms/settings/category', ['classify']),

        loadSensitiveWordList(){
            showLoading(true, '正在加载敏感词列表')
            this.getSensitiveWordList({ ...this.searchForm }).then(({count}) => {
                this.searchForm.total=count
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        _classify(){
            this.classify({ ...this.type }).then(({data}) => {
                this.hotWordCategories = data
                this.edit.hotWordCategoriesChild=this.hotWordCategories
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },

        closeEditModal(needReload) {
            this.edit.visible = false
            needReload && this.loadSensitiveWordList()
        },
        // 新增
        _addSensitiveWord(){
            this.edit.visible=true
            this.edit.info = {}
        },
        // 编辑
        _editSensitiveWord(SensitiveWord){
            this.edit.visible=true
            this.edit.info = { ...SensitiveWord }
        },

        // 改变当前页
        changePagination(currentPage) {
            this.searchForm.page = currentPage
            this.loadSensitiveWordList()
        },
        // 查询
        searchSensitiveWord(){
            this.searchForm.page=1
            this.loadSensitiveWordList()
        },
        // 手动勾选数据行发生的事件
        select(selection){
            this.selectIds = selection
        },
        // 删除模板
        _deleteSensitiveWord(templateinfo) {

            confirm('确认删除该敏感词吗?', '警告', {
                ok: () => {
                    const template = { id: templateinfo.id}
                    showLoading(true, `正在删除`)
                    this.deleteSensitiveWord(template)
                        .then(() => {
                            showMessage('删除敏感词成功')
                            this.loadSensitiveWordList()
                            showLoading(false)
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            })
        },
        //  批量删除
        _deleteSensitiveWords(){
            if (!this.selectIds.length) {
                showMessage({
                    type: 'warning',
                    message: '请至少选择一个要删除的敏感词'
                })
            }else{
                const newSelectIds=[]
                this.selectIds.map(item=>{ newSelectIds.push(item.id)})
                const ids=newSelectIds.join(',')
                confirm('确认删除该敏感词吗?', '警告', {
                    ok: () => {
                        const template = { id: ids }
                        showLoading(true, `正在删除`)
                        this.deleteSensitiveWord(template)
                            .then(() => {
                                showMessage('删除敏感词成功')
                                this.loadSensitiveWordList()
                                showLoading(false)
                            })
                            .catch(error => {
                                showLoading(false)
                                showError(error.message)
                            })
                    }
                })
            }
        },
    }
}


</script>
