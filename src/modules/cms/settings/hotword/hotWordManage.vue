<template>
    <div>
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <el-col :span="6">
                            <el-form-item label="热词">
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
                                    <el-option v-for="(category, index) in hotWordCategories" :key="index" :label="category.name"
                                               :value="category.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="searchHotWord">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <template v-slot:header-left>
                <el-button type="primary" icon="el-icon" @click="_addHotWord">新增</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="_deleteHotWords">批量删除</el-button>
            </template>
            <el-table border stripe :data="data" @selection-change="select">
                <el-table-column type="selection" label=" " width="50"></el-table-column>
                <el-table-column prop="word" label="热词名称" ></el-table-column>
                <el-table-column prop="url" label="来源链接"></el-table-column>
                <el-table-column prop="categoryName" label="分类名称" ></el-table-column>
                <el-table-column prop="times" label="次数">
                    <template v-slot="{row}">
                        <div v-if="row.times === 1">
                            首次
                        </div>
                        <div v-if="row.times === 0">
                            全部
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200px" align="center">
                    <template v-slot="{row}">{{row.createTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作" width="400px">
                    <template v-slot="{row}">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="_editHotWord(row)">修改
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="_deleteHotWord(row)">删除
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
            total:0
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
                hotWordCategoriesChild:[],
                isShowTimes:false
            }
        }
    },
    computed: {
        ...mapState('cms/settings/hotword', ['data', 'page', 'limit', 'total']),
        ...mapState('cms/settings/category', ['categories']),
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
    },
    watch: {

    },
    created() {
        this.getCategoriesByType(1).then(data=>{
            // debugger
            this.hotWordCategories = data
            this.edit.hotWordCategoriesChild=this.hotWordCategories
        })
        this.loadHotWordList()
        
    },
    mounted() {
        this.$nextTick(() => {
            this.sites.unshift({ id: 0, name: '公共热词' })
        })
    },
    beforeDestroy() {
        this.sites.shift({ id: 0, name: '公共热词' })
    },
    methods: {
        ...mapActions('cms/site', ['loadSites']),
        ...mapActions('cms/settings/hotword', [
            'getHotWordList',
            'deleteHotWord'

        ]),
        ...mapActions('cms/settings/category', ['getCategoriesByType']),

        loadHotWordList(){
            showLoading(true, '正在加载热词列表')
            this.getHotWordList({ ...this.searchForm }).then(({count}) => {
                this.searchForm.total=count
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },

        closeEditModal(needReload) {
            this.edit.visible = false
            needReload&& this.loadHotWordList()
        },
        // 新增
        _addHotWord(){
            this.edit.visible=true
            this.edit.info = {}
            this.edit.isShowTimes=false
        },
        // 编辑
        _editHotWord(hotWord){
            this.edit.visible=true
            this.edit.info = { ...hotWord }
            this.edit.isShowTimes=true
        },

        // 改变当前页
        changePagination(currentPage) {
            // this.getHotWordList({ page: currentPage })
            this.searchForm.page = currentPage
            this.loadHotWordList()
        },
        // 查询
        searchHotWord(){
            this.searchForm.page=1
            this.loadHotWordList()
        },
        // 手动勾选数据行发生的事件
        select(selection){
            this.selectIds = selection
        },
        // 删除模板
        _deleteHotWord(templateinfo) {

            confirm('确认删除该热词吗?', '警告', {
                ok: () => {
                    const template = { id: templateinfo.id}
                    showLoading(true, `正在删除`)
                    this.deleteHotWord(template)
                        .then(() => {
                            showMessage('删除热词成功')
                            this.loadHotWordList()
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
        _deleteHotWords(){
            if (!this.selectIds.length) {
                showMessage({
                    type: 'warning',
                    message: '请至少选择一个要删除的热词'
                })
            }else{
                const newSelectIds=[]
                this.selectIds.map(item=>{ newSelectIds.push(item.id)})
                const ids=newSelectIds.join(',')
                confirm('确认删除该热词吗?', '警告', {
                    ok: () => {
                        const template = { id: ids }
                        showLoading(true, `正在删除`)
                        this.deleteHotWord(template)
                            .then(() => {
                                showMessage('删除热词成功')
                                this.loadHotWordList()
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
