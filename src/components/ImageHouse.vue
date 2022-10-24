<template>
    <el-dialog 
        title="图片库" 
        :visible="isShowLead"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        width="80%"
        append-to-body
        @close="handelClose"
    >
        <div class="search_box">
            <el-form ref="editSearch" label-width="80px" :model="searchInfo">
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
                            <el-select v-model="searchInfo.state" clearable placeholder="请选择" style="width: 100%">
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
                            <el-button type="primary" @click="searchImgHouse">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <imgList
            ref="imgChild"
            :list="list"
            :limit="limit"
            :dataCount="dataCount"
            @handleChange="handleChange"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
        ></imgList>
        <div slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="comfim">确认</el-button>
            <el-button @click="handelClose">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapActions } from "vuex";
import imgList from './imgList.vue'
export default {
    name: 'ImageHouse',
    data() {
        return {
            isShowLead: false,
            checkList: [],
            searchInfo: {
                name:'',
                keyword: '',
                createTime: '',
                uploadUser: '',
                state: ''
            },
            statusOpt: [
                // { value: '0', label: '草稿' },
                { value: '1', label: '已上传' },
                // { value: '2', label: '已回收' },
                { value: '3', label: '已引用' }
                
            ],
            statusName: ['草稿', '已上传', '已回收', '已引用'],
            list: [],
            page: 1,
            limit: 12,
            dataCount: 0,
            currList: [],
            currlistIds: []
        }
    },
    props:{
        visible: {
            type: Boolean,
            default: false
        },
    },
    components:{
        imgList
    },
    methods:{
        ...mapActions('cms/settings/imgHouse', ['getImgList', 'getImgSign']),
        getImageList(){
            let param = {
                page: this.page,
                limit: this.limit,
                mode: 3, // 1图片库查询 ; 2回收站查询; 3编辑器引用查询
                ...this.searchInfo
            }
            this.getImgList(param).then(res => {
                console.log('获取图片列表', res)
                this.dataCount = res.count
                // this.page = res.page || 1
                // this.limit = res.limit
                this.list = res.data.filter(item => item.state != '2')
            })
        },
        // 查询图片库
        searchImgHouse(){
            this.getImageList()
        },
        // 重置查询表单
        resetForm() {
            this.$refs.editSearch.resetFields()
            this.searchInfo = this.$options.data().searchInfo
            this.limit = 12
            this.page = 1
            this.getImageList()
        },
        handelClose() {
            this.$refs.imgChild.clearData()
            this.$emit('closeImageModal', false)
        },
        handleChange(list, val) {
            this.currListIds = val
            this.currList = list
            console.log('获取数据：', this.currList)
        },
        comfim() {
            // 确认
            console.log('选中的数据', this.currList)
            this.getImgSign({
                channel: '0',
                info: '0',
                image: this.currListIds
            }).then(res => {
                if(res.success) {
                    this.$refs.imgChild.clearData()
                    this.$emit('closeImageModal', false)
                    this.$emit('confirmList', this.currList)
                } else {
                    this.$message.error(res.errMsg||'服务器异常!')
                }
            }).catch(err=> {
                console.log(err)
                this.$message.error(res.errMsg||'服务器异常!')
            })
            
        },
        sizeChange(v) {
            this.limit = v
            this.getImageList()
        },
        currentChange(v) {
            this.page = v
            this.getImageList()
        }
    },
    watch: {
        visible(v) {
            this.isShowLead = v
            this.getImageList()
        },
    },
}
</script>
<style lang="scss" scoped>

</style>