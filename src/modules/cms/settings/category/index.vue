<template>
    <div>
        <TableRow has-form has-header>
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <el-col :span="6">
                            <el-form-item label="类型">
                                <el-select v-model="searchForm.type" placeholder="选择类型" clearable>
                                    <el-option
                                        v-for="(type, key) in wordCategory"
                                        :key="key"
                                        :value="Number(key)"
                                        :label="type"
                                    ></el-option>
                                </el-select>

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
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <template v-slot:header-left>
                <el-button type="primary" @click="_addCategory">新增</el-button>
            </template>
            <el-table :data="list">
                <!-- :data="categories.filter(category => (!searchForm.wordCategory || category.type === searchForm.wordCategory) &&
                    (!searchForm.site || !category.appid || category.appid === searchForm.site))" -->
            
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="type" label="类型">
                    <template v-slot="{row}">
                        <el-tag
                            :type="row.type === 1 ? 'warning':'danger'"
                            effect="dark"
                        >{{getCategoryTypeName(row.type)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{row}">
                        <el-button type="primary" size="mini" @click="_editCAtegory(row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="_deleteCategory(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </TableRow>

        <EditModal v-bind="edit" @close="closeEditModal"></EditModal>
    </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { showLoading, showError, confirm, showMessage } from '../../../../utils'
import EditModal from './edit.vue'
export default {
    name: 'WordCategory',
    components: {
        EditModal
    },
    data() {
        return {
            searchForm: {
                type: null,
                appid: null
            },
            edit: {
                visible: false,
                info: {}
            },
            list:[]
        }
    },
    computed: {
        ...mapState('cms/settings/category', ['categories']),
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
        wordCategory() {
            return this.getDictionary('wordCategory')
        },
        getCategoryTypeName() {
            const category = this.wordCategory
            return type => {
                return category[type] || ''
            }
        }
    },
    created() {
        // this.sites.unshift({ id: 0, name: '公共分类' })
        this.reloadCategories()
    },
    mounted() {
        this.$nextTick(() => {
            this.sites.unshift({ id: 0, name: '公共分类' })
        })
        
    },
    beforeDestroy() {
        this.sites.shift({ id: 0, name: '公共分类' })
    },
    methods: {
        ...mapActions('cms/site', ['loadSites']),
        ...mapActions('cms/settings/category', ['loadCategories', 'deleteCategory']),
        reloadCategories() {
            // const type = this.searchForm.wordCategory
            showLoading(true, '正在加载列表')
            this.loadCategories({ ...this.searchForm}).then((data) => {
                this.list = data
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        search () {
            this.reloadCategories()
        },
        closeEditModal(needReload) {
            this.edit.visible = false
            !needReload && this.reloadCategories()
        },
        _addCategory() {
            this.edit.visible = true
            this.edit.info = {}
        },
        _editCAtegory(category) {
            this.edit.visible = true
            this.edit.info = { ...category }
        },
        _deleteCategory(category) {
            confirm('确认删除该分类吗?', '警告', {
                ok: () => {
                    showLoading(true, '正在删除')
                    this.deleteCategory(category).then(res => {
                        if(res.success){
                            showMessage(res.errMsg)
                            this.reloadCategories()
                        }else{
                            showError('删除失败！')
                        }
                    }).catch(error => {
                        showError(error.message)
                    })
                    showLoading(false)
                }
            })
        }
    }
}
</script>

