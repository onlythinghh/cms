<template>
    <div class="detil_info">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="detailRef" label-width="80px" :model="detailSearch">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="频道">
                                <!-- <el-input v-model="detailSearch.channel" maxlength="30" placeholder="请输入频道名称" clearable /> -->
                                <TreeSelect
                                    ref="testSelect"
                                    v-model="detailSearch.channelId"
                                    placeholder="请选择父级资源"
                                    :options="channerDatas"
                                    :default-expand-all="true"
                                    :checked-on-click="true"
                                    text-prop="label"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="时间">
                                <el-date-picker
                                    v-model="detailSearch.createTime"
                                    type="date"
                                    placeholder="请选择时间"
                                    value-format="yyyy-MM-dd"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" @click="searchDetil">查询</el-button>
                            <el-button @click="resetDetil">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="download">导出</el-button>
                <!-- <el-button type="primary" @click="exportExcel('infoTabs')">导出</el-button> -->
                <el-button type="primary" @click="deleteItem">删除</el-button>
                <el-button @click="goback">返回</el-button>
            </template>

            <el-table id="infoTabs" :data="tableData" @selection-change="selectionChange">
                <!-- 循环列表内容 -->
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column label="序号" width="50">
                    <template slot-scope="scope"> {{scope.$index+1}} </template>
                </el-table-column>
                <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.fieldName" :label="item.displayName"></el-table-column>
                <!-- 操作可以是一个固定的列 -->
                <!-- <el-table-column label="操作">
                    <template>
                        
                    </template>
                </el-table-column> -->

            </el-table>
            <!-- <el-pagination
                v-if="total > 10"
                class="pages"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="listPage.limit"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination> -->
        </TableRow>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showMessage, showLoading } from "@/utils"
import { queryUrlString, deepCopy } from '@/utils/BaseUtil'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
    data() {
        return {
            detailSearch: {
                channelId: '',
                createTime: ''
            },
            formId: '', // 当前id
            tableData: [], // 表身
            columns: [], // 表头
            listPage:{
                page: 1,
                limit: 999
            },
            total: 0,
            multipleSelection: [],
            channerDatas: []
        }
    },
    mounted() {
        this.formId = queryUrlString('id')
        this.queryDetailList()
        this.getchannel()
    },
    methods:{
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        ...mapActions('cms/dataform',[
            'getlzDetailListTit',
            'getlzDetailList',
            'getlzInfoExport',
            'getlzformDetails',
        ]),
        queryDetailList() {
            // 获取表头信息
            showLoading(true, "正在加载站频道");
            const listTitle = new Promise((resolve, reject) => {
                let params = {
                    formId: this.formId
                }
                this.getlzDetailListTit(params).then(res => {
                    console.log('表头', res)
                    if(res.success){
                        this.columns = res.data
                        resolve('success')
                    } else {
                        let err = res.data||res.errMsg||'服务器繁忙，请稍后再试！'
                        resolve(err)
                    }
                })
            })
            // 获取表身信息
            const listTable = new Promise((resolve, reject) => {
                let params = {
                    formId: this.formId,
                    ...this.detailSearch,
                    ...this.listPage
                }
                this.getlzDetailList(params).then(res => {
                    console.log('表身', res)
                    if(res.success){
                        
                        this.tableData = res.data.jsons || []
                        this.total = res.total
                        
                        
                        resolve('success')
                    } else {
                        let err = res.data||res.errMsg||'服务器繁忙，请稍后再试！'
                        resolve(err)
                    }
                })
            })

            Promise.all([listTitle, listTable]).then(res => {
                console.log('统一处理表格res:', res)
            })
            showLoading(false);
        },

        // 获取频道
        async getchannel(){
            showLoading(true, "正在加载站频道");
            let _site = JSON.parse(sessionStorage.getItem("SITE"));
            let data = await this.getChannelList({ appid: _site.id });
            console.log('频道信息',data)
            const treeResources = deepCopy(data || [])
            this.channerDatas = this.toOptions(treeResources)
            showLoading(false);
        },
        // 父级资源
        toOptions(resources) {
            // const restest ={ id: null}
            // const { id: currentId } = restest // this.resourceForm
            return resources.map(({ name: label, id: value, children }) => {
                const opt = { label, value}
                if (children && children.length > 0) {
                    opt.children = this.toOptions(children)
                }
                return opt
            })
            // .filter(res => {
            //     if (res.type === 1) {
            //         // 父级不能选中自己和自己的子级
            //         if (currentId === res.value) {
            //             return false
            //         }
            //         return true
            //     }
            //     return false
            // })
        },

        // 条件查询详情
        searchDetil(){
            this.queryDetailList()
        },
        // 重置详情条件查询
        resetDetil() {
            this.detailSearch = this.$options.data().detailSearch
            this.queryDetailList()
        },

        // 选中表格
        selectionChange(val){
            this.multipleSelection = val;
        },
        // 导出Excel
        // exportExcel (id) {
        //     /* out-table关联导出的dom节点  */
        //     var wb = XLSX.utils.table_to_book(document.querySelector(`#${id}`))
        //     /* get binary string as output */
        //     var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        //     try {
        //         let str = new Date().getTime()
        //         FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${str}_form.xlsx`)
        //     } catch (e) {
        //         showError(e)
        //     }
        //     return wbout
        // },
        download(){ // 调接口的（下载下来的数据不对）
            this.getlzInfoExport({formId: this.formId}).then(res => {
                // console.log('导出res:',res)
                if(res.success){
                    this.$message.success(res.message)
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            }).catch(err => {
                this.$message.error(err||'服务器繁忙，请稍后再试！')
            })
        },
        deleteItem() {
            console.log('批量删除',this.multipleSelection)
            if(!this.multipleSelection.length) {
                return showMessage({
                    type: "warning",
                    message: `请选择至少一条数据！`
                });
            }
            let ids = []
            this.multipleSelection.forEach(ele => {
                ids.push(ele.id);
            });
            this.getlzformDetails({ids:ids}).then(res => {
                if(res.success){
                    this.$message.success(res.data)
                    this.queryDetailList()
                } else {
                    this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            }).catch(error => {
                this.$message.error(error||'服务器繁忙，请稍后再试！')
            })
        },
        sizeChange(v){
            this.listPage.limit = v
            this.queryDetailList()
        },
        currentChange(v){
            this.listPage.page = v
            this.queryDetailList()
        },
        goback() {
            this.$router.go(-1);
        }
    }
}
</script>