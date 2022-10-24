<template>
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
            </template>
            <template v-slot:header-right>
                <el-button type="primary" icon="el-icon-plus" @click="showAdd">新增</el-button>
                <el-button type="primary" icon="el-icon-top" @click="updateImg">上传</el-button>
                <el-button type="primary" icon="el-icon-bottom" @click="downloadImg">下载</el-button>
                <el-button type="danger" icon="el-icon-close" @click="delImg">删除</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="toPage">回收站</el-button>
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
        <addImg v-bind="addimgData" @close="closeaddImgModal" @loadImgList="initImg(searchInfo)"></addImg>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import addImg from './addImg.vue'
// import imgList from './imgList.vue'
import { downImages } from './downImage'
export default {
    components: {
        addImg,
    },
    data() {
        return {
            searchInfo: {
                name:'',
                keyword: '',
                createTime: '',
                uploadUser: '',
                state: ''
            },
            statusOpt: [
                { value: '0', label: '草稿' },
                { value: '1', label: '已上传' },
                { value: '3', label: '已引用' }
                
            ],
            addimgData: {
                visible: false,
            },
            currList: [],
            currListIds: [],
            dataList: [],
            dataCount: 0,
            page: 1,
            limit: 12,
        }
    },
    created() {
        this.initImg()
    },
    methods:{
        ...mapActions('cms/settings/imgHouse', ['getImgList', 'getImgUpDate']),

        searchImgHouse(){
            // 查询图片库
            this.initImg()
        },

        initImg() {
            let param = {
                page: this.page,
                limit: this.limit,
                mode: 1, // 1图片库查询 ; 2回收站查询; 3编辑器引用查询
                ...this.searchInfo
            }
            this.getImgList(param).then(res => {
                // console.log('获取图片列表', res)
                this.dataCount = res.count
                // this.page = res.page || 1
                // this.limit = res.limit
                // for(let i=0; i< res.data.length; i++){
                //     res.data[i].pathPart = `${process.env.VUE_APP_PROXY_TARGET}${res.data[i].pathPart}`
                // }
                // 2:已回收的 过滤掉
                this.dataList = res.data.filter(item => item.state != '2')
            })
        },
        sizeChange(v){
            // console.log('翻页1： ', v)
            this.limit = v
            this.initImg()
        },
        currentChange(v){
            // console.log('翻页2： ', v)
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
        // 新增图片弹框
        showAdd(){
            this.addimgData.visible = true
        },
        // 关闭新增图片弹框
        closeaddImgModal(){
            this.addimgData.visible = false
        },

        handleChange(list, val) {
            this.currListIds = val
            this.currList = list
            console.log('获取数据：', this.currList)
            // console.log('勾选图片的id',this.currListIds)
        },
        toPage() {
            this.$router.push({name:'imgRecycle'});
        },
        handleImgChange(state, type) {
            let param = {
                ids: this.currListIds,
                state: state // 0:草稿（还原） 1: 上传 2:回收（删除）3:引用
            }
            let types = {
                up: '图片上传成功!',
                del: '图片已删除!',
                // down: '下载'
            }
            console.log('修改接口参数', param)
            this.getImgUpDate(param).then(res => {
                console.log('上传图片11:',res)
                if(res.success) {
                    this.currList = []
                    this.currListIds = []
                    this.$refs.imgChild.clearData()
                    this.initImg()
                    this.$message({
                        type: 'success',
                        message: `${types[type]}`
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: `${types[type]}失败， 请重试!`
                    });
                }
                
            }).catch((error) => {
                this.$message.error(error);
            })
        },
        // 上传
        updateImg(){
            if(this.currListIds.length <= 0) return this.$message.warning('请至少选择一张要上传的图片！');
            let fileimg = this.currList.some((item) => {return item.state != '0'})
            if(fileimg) return this.$message.warning('只能上传草稿状态的图片!')
            this.$confirm('是否确定将已勾选的图片上传至图片资源库中?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleImgChange('1', 'up')
            }).catch(() => {});
        },
        // 下载
        downloadImg(){
            if(this.currList.length <= 0) return this.$message.warning('请至少选择一张要下载的图片！');
            let draft = this.currList.some((item) => {return item.state == '0'})
            if(draft) return this.$message.error('草稿图片不支持下载!')
            this.$confirm('是否确认下载已勾选的图片资源?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.handleImgChange()
                this.currList
                let urlarr = [], namearr = []
                for(let i=0; i< this.currList.length; i++) {
                    let tmp = this.currList[i]
                    let imgName = tmp.name || tmp.newFilename
                    urlarr.push(tmp.pathPart)
                    namearr.push(imgName)
                }
                downImages(urlarr, namearr, ()=> {
                    this.$message.success('图片已下载')
                })
            }).catch(() => {});
        },
        delImg(){
            if(this.currListIds.length <= 0) return this.$message.warning('请至少选择一张要删除的图片！');
            let isquote = this.currList.some((item)=>{return item.state == '3'})
            let tips = isquote ? '删除已引用状态的图片将可能导致网站页面显示异常,请谨慎操作!' : '是否确认删除已勾选的图片资源?'
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除
                this.handleImgChange('2', 'del')
            }).catch(() => {});
        }

    }
}
</script>
<style lang="scss" scoped>
</style>