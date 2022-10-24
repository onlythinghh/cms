<template>
<!-- 图片库回收站 -->
    <div class="img_house">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchInfo" label-width="80px" :model="searchInfo">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="名称">
                                <el-input
                                    v-model="searchInfo.name"
                                    placeholder="请输入名称"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="标签">
                                <el-input
                                    v-model="searchInfo.keyword"
                                    placeholder="请输入图片标签"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="选择时间">
                                <el-date-picker
                                    v-model="searchInfo.createTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择时间"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="上传者">
                                <el-input
                                    v-model="searchInfo.uploadUser"
                                    placeholder="请输入上传者账号"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态">
                                <el-select v-model="searchInfo.state" disabled placeholder="请选择" style="width: 100%">
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
                        <el-col :span="8">
                            <el-form-item class="btn_align">
                                <el-button type="primary" @click="initImg">查询</el-button>
                                <el-button @click="resetForm">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button @click="goBack">返回</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="dataRecovery">还原</el-button>
            </template>
            <imgList
                ref="imgChild"
                :list="dataList"
                :limit="limit"
                :dataCount="dataCount"
                @handleChange="handleChange"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
            ></imgList>
        </TableRow>
    </div>
</template>
<script>
// import imgList from '../imgList.vue'
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            searchInfo: {
                name:'',
                keyword: '',
                createTime: '',
                uploadUser: '',
                state: '2' // 回收页面固定传值
            },
            statusOpt: [
                { value: '0', label: '草稿' },
                { value: '1', label: '已上传' },
                { value: '2', label: '已回收' },
                { value: '3', label: '已引用' }
            ],
            currList: [],
            currListIds: [],
            dataList: [],
            dataCount: 0,
            page: 1,
            limit: 12,
        }
    },
    mounted() {
        this.initImg()
    },
    methods:{
        ...mapActions('cms/settings/imgHouse', ['getImgList', 'getImgUpDate']),
        initImg() {
            let param = {
                page: this.page,
                limit: this.limit,
                mode: 2,
                ...this.searchInfo
            }
            this.getImgList(param).then(res => {
                console.log('获取图片列表', res)
                // pathPart
                this.dataCount = res.count
                // this.page = res.page || 1
                // this.limit = res.limit || 10
                // for(let i=0; i< res.data.length; i++){
                //     res.data[i].pathPart = `${process.env.VUE_APP_PROXY_TARGET}${res.data[i].pathPart}`
                // }
                this.dataList = res.data
            })
        },
        sizeChange(v){
            console.log('翻页1： ', v)
            this.limit = v
            this.initImg()
        },
        currentChange(v){
            console.log('翻页2： ', v)
            this.page = v
            this.initImg()
        },
        // 重置查询表单
        resetForm() {
            this.$refs.searchInfo.resetFields()
            this.searchInfo = this.$options.data().searchInfo
            this.limit = 12
            this.page = 1
            this.initImg()
        },
        handleChange(list, val) {
            this.currListIds = val
            this.currList = list
        },
        // 返回
        goBack(){
            this.$router.go(-1);
        },
        // 还原数据
        dataRecovery() {
            console.log('还原数据：', this.currListIds)
            if(this.currListIds.length <= 0) return this.$message.warning('请至少选择一张要还原的图片！');
            this.$confirm('是否确认还原已勾选的图片资源?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.getImgUpDate({
                    ids: this.currListIds,
                    state: '0' // 0:草稿 1: 上传 2:回收（删除）3:引用
                }).then(res => {
                    console.log('还原图片11:',res)
                    if(res.success) {
                        this.$refs.imgChild.clearData()
                        this.initImg()
                        this.$message({
                            type: 'success',
                            message: `还原成功!`
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: `还原失败， 请重试!`
                        });
                    }
                    
                }).catch((error) => {
                    this.$message.error(error);
                })
            }).catch(() => {});
        }
    }
}
</script>