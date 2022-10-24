<!--建议反馈--> 
<template>
    <div>
        <div class="header">
            <el-form ref="search">
                <el-row>
                    <el-col :offset="2" :span="7">
                        <el-form-item label="建议日期" label-width="100px">
                            <el-date-picker
                                v-model="searchFormTime"
                                type="daterange"
                                style="width:100%"
                                value-format="timestamp"
                                start-placeholde="开始时间"
                                end-placeholde="结束时间"
                            />
                        </el-form-item>
                        <el-form-item label-width="100px" style="display: none">
                            <el-checkbox v-model="preview">生产数据</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="手机号码" label-width="100px" prop="themeId">
                            <el-input v-model="phone" placeholder="请输入手机号码" />
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="5">
                       <el-form-item class="btn" label-width="100px">
                            <el-button type="primary" size="medium" @click="searchList(1)">查询</el-button>
                            <el-button size="medium" @click="resetForm">重置</el-button>
                        </el-form-item>
                        <el-form-item label-width="100px">
                            <el-button type="danger" @click="feedbackDel(null)">删除</el-button>
                            <el-button type="primary" @click="batchAdoptclick">导出</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <el-dialog title="反馈内容" :visible.sync="addVisible" width="50%" center @close="addVisible = false">
                <div>
                    <el-input v-model="content" type="textarea" rows="10" show-word-limit maxlength="500" cols="100"/>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-table
                ref="Tabledata"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="595"
                row-key="id"
                :data="list"
                :row-style="{ height: '54px' }"
                :cell-style="{ padding: '0' }"
                :header-cell-style="{ 'text-align': 'center' }"
                @selection-change="_handleSelectionChange" 
            >
                <el-table-column type="selection" width="50" />
                <el-table-column label="序号" width="60" type="index" align="center" />
                <el-table-column prop="phone" label="手机号码" align="center" width="200"/>
                <el-table-column label="建议日期" align="center" width="200">
                    <template v-slot="{row}">
                        <span>{{row.time|dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="反馈内容" align="center">
                    <template v-slot="{row}">
                        <span style="color: #1890ff;cursor: pointer;white-space:nowrap" @click="_view(row.content)">{{row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template v-slot="{row}">
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="feedbackDel(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="text-align: right;"
                :current-page="currentPage"
                :page-size="limit"
                :page-sizes="[limit]"
                layout="sizes, prev, pager, next"
                :total="totalPage"
                @current-change="searchList"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { showLoading, showMessage,hideLoading, confirm } from "@/utils";
import { downloadByBlob } from '@/utils/BaseUtil'
import { mapActions } from "vuex";
export default {
    name:'Theme',
    data() {
        return {
            multipleSelected:[],
            searchFormTime:[],
            content:'',
            phone:'',
            addVisible: false,
            currentPage:1,
            limit:10,
            totalPage:null,
            addForm:{
                id:null,
                appId:null,
                themeName:null,
                type:1,
                state:'2',
                file:{},
                enabled:null,
                start:null,
                end:null,
                fileName:'',
                description:'',
            },
            preview:true,
            fileMsg:'只支持.css格式',
            addTrigger:[],
            addFormRules:{
                themeName:[{required: true,message: "名称不能为空",trigger: "blur"}],
            },
            isReadOnly:true,
            list:[],
            SitesAll:[],
            times:[],
        };
    },
    created() {
        this.searchList(1);
    },

    methods: {
        ...mapActions("cms/settings/sugg", ["schedulerList", "thsave","nostop","colldel","publish"]),

        async searchList(v) {
            this.currentPage = v
            showLoading(true);
            if(this.searchFormTime==null){
                this.searchFormTime = []
            }
            let res = await this.schedulerList({
                page:this.currentPage,
                limit:this.limit,
                phone:this.phone,
                preview:this.preview?'0':'1',
                start:this.searchFormTime[0],
                end:this.searchFormTime[1]+(24*60*60*1000-1000),
            });
            this.list = res.data;
            this.totalPage = res.count
            hideLoading();
        },
        feedbackDel(v){
            let ids = ''
            if(v){
                ids= v    
            }else{
                ids = this.multipleSelected.join(',')
            }
            if(!ids){
                return showMessage({ type: 'warning', message: '请至少选择一个需要删除的内容！' })
            }
            confirm("您确认删除吗？", "警告", {
                ok: async () => {
                    showLoading("正在删除...");
                    
                    let res = await this.colldel({ id:ids });
                    if (res.success) {
                        showMessage(res.data || '删除成功')
                    } else {
                        this.$message.error(res.errMsg||"删除失败");
                    }
                    hideLoading();
                    this.searchList(this.currentPage);
                }
            });
        },
        resetForm(){
            this.currentPage = 1
            this.searchFormTime = []
            this.multipleSelected = []
            this.content = '',
            this.phone ='',
            this.searchList(1);
        },

        _view(v){
            this.content = v
            this.addVisible = true 
        },
        _handleSelectionChange(val) {
            val.forEach(el => {
                this.multipleSelected.push(el.id)
            });
        },
        async batchAdoptclick() {
            showLoading("正在导出")
            const data = await this.publish({
                phone:this.phone,
                start:this.searchFormTime[0],
                end:this.searchFormTime[1],
            })
            downloadByBlob(data, {filename:'建议反馈.xlsx'})
            hideLoading()
        },
    }
};
</script>
<style lang="scss" scoped>
.ok::before,
.err::before{
    content: '';
    width:5px;
    height: 5px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    background-color:#67c23a;
}
.err::before{
    background-color: #ff4949;
}
/deep/ .sperr{
    color: #ff4949;
}
/deep/ .spok{
    color:#67c23a;
}
.flex{
    display: flex;
    cursor: default;
    justify-content: space-between;
    align-items: center;
    i:hover::before{
        cursor: pointer;
        color: #ff4949;
    }
}
</style>
