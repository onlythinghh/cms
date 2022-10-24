<template>
    <div class="test_list">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="80px" :model="searchData">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="名称">
                                <el-input
                                    v-model="searchData.keyword"
                                    placeholder="请输入测试名称，创建人"
                                    clearable
                                    maxlength="30"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态">
                                <el-select v-model="searchData.status" placeholder="请选择">
                                    <el-option
                                        v-for="item in statusOpt"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="newlyTrial">新建</el-button>
            </template>
        </TableRow>
        <el-table ref="tableList" :data="tableData" class="tableList">
            <el-table-column label="测试名称" prop="name"></el-table-column>
            <el-table-column label="试验层">
                <template v-slot="{row}">{{row.layer.name}}</template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime">
                <template v-slot="{ row }">{{row.createTime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="创建人" prop="createUser"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template v-slot="{ row }">
                    <span v-if="row.status == 'running'">进行中</span>
                    <span v-else-if="row.status == 'finished'">已下线</span>
                    <span v-else-if="row.status == 'pause'">运行中(暂停)</span>
                    <span v-else-if="row.status == 'fail'">上线失败</span>
                    <span v-else-if="row.status == 'new'">未开始</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                    <el-button v-if="btntype.info.includes(scope.row.status)" type="primary"
                        plain size="mini" @click="formDetaill(scope.row)"
                    >查看报告</el-button>
                    <el-button v-if="btntype.edit.includes(scope.row.status)" plain size="mini" @click="formTrial(scope, 0)">编辑</el-button>
                    <el-dropdown size="mini" style="margin-left: 10px">
                        <el-button type="primary" size="mini">
                            更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-show="btntype.stop.includes(scope.row.status)">
                                <div style="width: 70px;text-align: center" @click="setSuspend(scope, 'stop')">暂停</div>
                            </el-dropdown-item>
                            <el-dropdown-item v-show="btntype.going.includes(scope.row.status)">
                                <div style="width: 70px;text-align: center" @click="setSuspend(scope, 'conte')">继续</div>
                            </el-dropdown-item>
                            <el-dropdown-item v-show="btntype.relse.includes(scope.row.status)">
                                <div style="width: 70px; text-align: center" @click="setSuspend(scope, 'conte')">发布</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div
                                    style="width: 70px; text-align: center"
                                    @click="formTrial(scope, 1)"
                                >复制</div>
                            </el-dropdown-item>
                            <el-dropdown-item v-show="btntype.off.includes(scope.row.status)">
                                <div style="width: 70px; text-align: center" @click="setOffline(scope)">下线</div>
                            </el-dropdown-item>
                             <el-dropdown-item v-show="btntype.del.includes(scope.row.status)">
                                <div style="width: 70px; text-align: center" @click="delListItem(scope)">删除</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="pages"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageInfo.size"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
        <el-dialog
            title="新建"
            :visible.sync="addDialog"
            width="70%"
            :before-close="addDialogClose"
        >
            <div class="add_dialog_box">
                <el-form ref="addDialogref" :model="formData" :rules="addRules" label-width="80px">
                    <div class="title">基本信息</div>
                    <el-form-item label="实验名称" prop="name">
                        <el-input
                            v-model="formData.name"
                            placeholder="请输入实验名称"
                            clearable
                            maxlength="30"
                        />
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                            v-model="formData.description"
                            type="textarea"
                            placeholder="请输入备注"
                            clearable
                            maxlength="150"
                            show-word-limit
                        />
                    </el-form-item>
                    
                    <el-form-item label="选择页面" prop="pageId">
                        
                        <TreeSelect
                            ref="testSelect"
                            v-model="formData.pageId"
                            placeholder="请选择"
                            :options="channerDatas"
                            :default-expand-all="true"
                            :checked-on-click="true"
                            text-prop="label"
                        />
                    </el-form-item>
                    <div class="title">配置关注指标</div>
                    <el-form-item>
                        <div class="set_quota">
                            <div v-for="(item, idx) in formData.indicators" :key="idx" class="quota_item">
                                <div class="item_tit"><el-input v-model="item.name" class="ipt" />
                                    <span v-if="idx > 0" @click="handleformDataLen('cut', idx)">
                                        <i class="close_icon el-icon-close"></i>
                                    </span>
                                </div>
                                <el-select v-model="item.action" placeholder="请选择">
                                    <el-option
                                        v-for="obj in actionsOpt"
                                        :key="obj.id"
                                        :label="obj.name"
                                        :value="obj.id"
                                    ></el-option>
                                </el-select><span class="sept">的</span>
                                <el-select v-model="item.property" placeholder="请选择">
                                    <el-option
                                        v-for="obj in actionsAttrOpt"
                                        :key="obj.id"
                                        :label="obj.name"
                                        :value="obj.id"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="increase" @click="handleformDataLen('add')">
                                <i class="el-icon-plus"></i>指标
                            </div>
                        </div>
                    </el-form-item>
                    
                    <div class="title">配置实验分组</div>
                    <el-form-item>
                        <div class="set_dama">
                            <div class="left_tit">
                                <ul class="tit_item">
                                    <li>分组名称</li>
                                    <li>流量比例</li>
                                    <li>分配规则</li>
                                    <li>备注信息</li>
                                </ul>
                            </div>
                            <div class="right">
                                <div v-for="(item, idx) in formData.groups" :key="idx" class="right_ocnt">
                                    <i v-if="idx > 1" class="el-icon-circle-close del_icon" @click="DelgroupItem(idx)"></i>
                                    <ul class="item_list" >
                                        <li class="item">{{item.name}}</li>
                                        <li class="item">
                                            <el-input v-model="item.percent" />
                                            <template slot="append">%</template>
                                        </li>
                                        <li class="item">{{item.rule}}</li>
                                        <li class="item upload">
                                            <el-input v-model="item.comment" type="textarea" class="ipt" :rows="2" placeholder="请输入内容"> </el-input>
                                            <el-upload
                                                class="avatar_uploader"
                                                :show-file-list="false"
                                                action="#"
                                                accept=".jpg, .jpeg, .JPEG, .JPG .png, .PNG"
                                                :http-request="(file) => _uploadimg(file, idx)"
                                            >
                                                <div class="upload_box">
                                                    <img v-if="item.image" :src="item.image" class="avatar">
                                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </div>
                                            </el-upload>
                                        </li>
                                    </ul>
                                </div>
                                <div class="right_ocnt add" @click="creatLayer">
                                    <i class="el-icon-plus"></i>
                                    <p>新增</p>
                                </div>
                            </div>
                            
                        </div>
                    </el-form-item>
                    <div class="title">配置实验分组</div>
                    <el-form-item label="时间">
                        <el-time-picker
                            v-model="formData.layer.time"
                            is-range
                            arrow-control
                            :default-time="formData.layer.time"
                            placeholder="选择时间范围"
                            value-format="hh:mm:ss"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            @change="selectTimes"
                        ></el-time-picker>
                    </el-form-item>
                    <el-form-item label="试验层">
                        <el-select v-model="formData.layer.id" placeholder="请选择">
                            <el-option
                                v-for="item in layerList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="占用比例">
                        <el-slider v-model="formData.layer.percent" style="width: 400px"></el-slider>
                    </el-form-item>
                    <el-form-item label="受众用户">
                        <el-radio-group v-model="customertype">
                            <el-radio :label="0">随机流量</el-radio>
                            <el-radio :label="1">定向流量</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="customertype == 1" label="用户分群">
                        <el-select v-model="formData.layer.consumer" placeholder="请选择">
                            <el-option
                                v-for="item in groupOpt"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogClose">取 消</el-button>
            <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { showLoading } from "@/utils"
import { deepCopy } from '@/utils/BaseUtil'
export default {
    data() {
        return {
            valsis:'',
            searchData: {
                keyword: '',
                status: '',
            },
            statusOpt: [
                {label: '进行中', value: 'running'},
                {label: '已下线', value: 'finished'},
                {label: '已暂停', value: 'pause'},
                {label: '上线失败', value: 'fail'},
                {label: '未开始', value: 'new'},
            ],
            pageInfo:{
                page: 0,
                size: 10,
            },
            total: 0,
            tableData: [], // 列表数据
            btntype: {
                // new:新增/未开始，running:运行中，finished:已下线/已完成，pause:暂停，fail:上线失败
                info: ['running', 'finished', 'pause'],
                edit:['new','running', 'fail', 'pause'],
                stop:['running'],
                going:['pause'],
                copy:['new','running', 'finished', 'fail', 'pause'],
                relse:['fail', 'new'],
                off:['running', 'pause'],
                del: ['finished', 'new', 'fail'],
            },
            addDialog: false,
            TrialType: 1, // 1新建 0编辑
            formData:{
                name: '', // 实验名称
                description: '', // 备注
                // pageId: '', // 选择页面
                indicators: [ // 关注指标
                    {name: '', action:'', property:''},
                ],
                groups: [{
                    name: '对照组',
                    percent: 50,
                    rule: '交替分配',
                    comment: '',
                    image: ''
                },
                {
                    name: '实验组',
                    percent: 50,
                    rule: '交替分配',
                    comment: '',
                    image: ''
                }
                ],
                layer: {
                    startTime: '',
                    endTime: '',
                    percent: 1,
                    consumer: 0,
                    time: ''
                },
            },
            addRules:{
                name: [{ required: true, message: "请输入实验名称", trigger: "blur" }],
            },
            channerDatas: [],
            actionsOpt: [], // 测试指标事件选项
            actionsAttrOpt: [], // 测试指标事件属性选项
            groupOpt: [], // 用户分群信息
            customertype: 0
        }
    },
    computed:{
        ...mapGetters('cms/settings/abtest', ['layerList'])
    },
    watch:{
        addDialog(nval) {
            if(nval) {
                this.getchannel()
                this.queryUserGroup()
            }
        },
        customertype: {
            handler: function(val) {
                this.formData.layer.consumer = val == 0 ? val : ''
            }
        }
    },
    mounted() {
        this.queryTableList()
        this.queryabtestLayer()
    },
    methods:{
        ...mapActions('cms/settings/abtest', [
            'getABtestList',
            'getABtestListSave',
            'getABtestListStart',
            'getABtestListPause',
            'getABtestListFinish',
            'getabtestLayer',
            'getIndicatorAction',
            'getIndicatorProperty',
            'getlImageSave',
            'getABtestListDelete',
        ]),
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        ...mapActions("cms/settings/userGroup", ["getUserGroupList"]),
        // 获取列表数据
        queryTableList(){
            console.log('获取列表数据', this.searchData)
            showLoading(true, "加载中...");
            let param = {
                ...this.searchData,
                ...this.pageInfo
            }
            this.getABtestList(param).then(res => {
                showLoading(false);
                console.log('测试列表数据res', res)
                let { success, data, count } = res
                this.total = count
                if(success) {
                    this.tableData = data.content
                }
            }).catch(err => {
                showLoading(false);
                this.$message.error('服务器繁忙，请稍后再试！')
            })
        },
        // 加载新增和编辑弹框的 相关选项数据
        queryabtestLayer(){
            // 获取测试层数据
            this.getabtestLayer({}).then(res => {
                console.log('获取测试层数据', res)
            })
            // 测试指标事件
            this.getIndicatorAction().then(res => {
                console.log('获取测试指标事件', res)
                if(res.success) {
                    this.actionsOpt = res.data
                    let arrs = JSON.parse(JSON.stringify(res.data))
                    arrs.forEach(item => {
                        item.id = item.id.toString()
                    })
                    this.actionsOpt = arrs
                } else {
                    this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
            // 测试指标事件属性
            this.getIndicatorProperty().then(res => {
                console.log('测试指标事件属性', res)
                if(res.success) {
                    // this.actionsAttrOpt = res.data
                    let arrs = JSON.parse(JSON.stringify(res.data))
                    arrs.forEach(item => {
                        item.id = item.id.toString()
                    })
                    this.actionsAttrOpt = arrs
                } else {
                    this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
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
       
        // 创建实验层
        creatLayer(){
            let obj = { name: '', percent: 0, rule: '交替分配', comment: '', image: ''}
            this.formData.groups.push(obj)
            let damalen = this.formData.groups.length
            let val = 100 / damalen
            this.formData.groups.forEach((item, idx) => {
                item.percent = parseInt(val)
                if(idx != 0) {
                    item.name = `实验组${idx}`
                }
                
            })
        },
        queryUserGroup() {
            let params = {
                type: 0, // 0:全部  1:创建的
                searchInfo: '',
                page: 0,
                size: 1000
            }
            this.getUserGroupList(params).then(res => {
                console.log('获取用户分群列表', res)
                if(res.success) {
                    this.groupOpt = res.data.content || []
                }
            })
        },
        // 删除实验层
        DelgroupItem(index) {
            this.formData.groups.splice(index, 1)
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
        },
        // 上传图片
        _uploadimg({ file, onError, onSuccess }, idx){
            console.log('file', file)
            let formData = new FormData();//通过formdata上传
            formData.append('image', file);
            this.getlImageSave(formData).then(res => {
                if(res.success) {
                    this.$message.success('上传成功')
                    this.formData.groups[idx].image = res.data.imgUrl
                } else {
                    this.$message({
                        type: 'error',
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
            })
        },
        // 查询
        searchList(){
            console.log('查询')
            this.queryTableList()
        },
        // 重置查询
        resetForm() {
            this.searchData = this.$options.data().searchData
            this.queryTableList()
        },

        // 新建测试
        newlyTrial() {
            console.log('新建')
            this.TrialType = 1
            this.addDialog = true
        },
        // 修改 复制
        formTrial(row, type){
            console.log('0修改_1复制:',row, type)
            let obj = deepCopy(row.row || [])
            obj.id = type == 1 ? '': obj.id
            obj.layer.time = [obj.layer.startTime, obj.layer.endTime]
            this.formData = obj
            this.TrialType = type
            this.addDialog = true
        },

        // 暂停 / 继续
        setSuspend(scope, type){
            console.log('暂停', scope, type)
            // type:conte继续  stop暂停
            let row = scope.row
            if(type == 'stop') {
                this.getABtestListPause({id: row.id}).then(res => {
                    if(res.success){
                        this.$message.success(res.data)
                        this.queryTableList()
                    } else {
                        this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                    }
                })
            } else {
                this.getABtestListStart({id: row.id}).then(res => {
                    if(res.success){
                        this.$message.success(res.data)
                        this.queryTableList()
                    } else {
                        this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                    }
                })
            }
        },
        // 下线
        setOffline(scope){
            console.log('scope',scope)
            showLoading(true, "加载中...");
            let row = scope.row
            let params = {  
                testId: row.id,
                id: JSON.stringify(row.layer) == '{}' || row.layer == null ? '' : row.layer.id
            }
            this.getABtestListFinish(params).then(res => {
                showLoading(false);
                console.log('下线res:',res)
                if(res.success){
                    this.$message.success(res.data)
                    this.queryTableList()
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            }).catch(err => {
                showLoading(false);
            })
        },
        // 删除
        delListItem(scope){
            let row = scope.row
            this.getABtestListDelete({id: row.id}).then(res => {
                console.log('删除：', res)
                if(res.success){
                    this.$message.success(res.data)
                    this.queryTableList()
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },

        formDetaill(row){
            this.$router.push({path: '/cms/cms-settings/abtest/viewreport', query:{testId: row.id, indicator: 5}})
        },

        // 加减指标
        handleformDataLen(val, idx) {
            if(val == 'add') {
                let obj = {name: '', action:'', property:''}
                this.formData.indicators.push(obj)
            } else {
                this.formData.indicators.splice(idx, 1)
            }
        },
        // 选择时间段
        selectTimes(val) {
            this.formData.layer.time = val
            this.formData.layer.startTime = val[0]
            this.formData.layer.endTime = val[1]
            console.log('this.formData.layer',this.formData.layer)
        },
        // 保存新建 / 编辑
        addDialogConfirm() {
            this.$refs.addDialogref.validate(async valid => {
                if (!valid) {
                    return false;
                }
                let { layer } = this.formData
                if(this.customertype == 1) {
                    if(layer.consumer == '' ||layer.consumer == 0) {
                        return this.$message.warning('定向流量时用户分群为必填')
                    }
                }
                showLoading(true, "加载中...")
                let param = {
                    ...this.formData,
                }
                console.log('param',param)
                this.getABtestListSave(param).then(res => {
                    showLoading(false);
                    console.log('保存新建res',res)
                    if(res.success){
                        this.$message.success(res.data)
                        this.queryTableList()
                        this.addDialog= false
                    } else {
                        this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                    }
                }).catch(err => {
                    showLoading(false)
                })
            })
        },
        // 新建弹框关闭 
        addDialogClose(){
            this.addDialog = false
            this.formData = this.$options.data().formData
        },

        sizeChange(v){
            this.pageInfo.size = v
            // console.log('翻页1： ', v)
            this.queryTableList()
        },
        currentChange(v){
            this.pageInfo.page = v - 1
            // console.log('翻页2： ', v)
            this.queryTableList()
        },
    }
}
</script>
<style lang="scss" scoped>
.test_list{
   font-size: 14px;
    .add_dialog_box{
        .title{
            color: #333333;
            font-size: 15px;
            margin: 15px 0;
        }
        /deep/ .el-form-item{
            margin-left: 50px;
        }
        .channe_name{
            .cl_name{
                padding: 5px 8px;
                font-size: 14px;
                border: 1px solid #46a6ff;
                border-radius: 14px;
                margin: 4px 6px;
            }
        }
        .quota_item{
            margin-bottom: 25px;
            .item_tit{
                margin-bottom:20px;
                .ipt{
                    width: 67%;
                }
                .close_icon{
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 16px;
                }
            }
            .sept{
                margin: 0 10px;
            }
        }
        .increase{
            color: #46a6ff;
            cursor: pointer;
        }
        .set_dama{
            display: flex;
            width: 100%;
            padding-bottom: 10px;
            overflow-x: auto;
            .left_tit{
                flex-basis: 80px;
                flex-shrink: 0;
                white-space: nowrap;
                border: 1px solid #ccc;
                padding: 10px;
                margin:0 5px;
                .tit_item{
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    li{
                        height: 40px;
                    }
                }
            }
            .right{
                display: flex;
                .right_ocnt{
                    height: 225px;
                    width: 200px;
                    flex-basis: 200px;
                    flex-shrink: 0;
                    white-space: nowrap;
                    margin: 0 5px;
                    border: 1px solid #ccc;
                    position: relative;
                    &.add{
                        width: 170px;
                        flex-basis: 170px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        cursor: pointer;
                        .el-icon-plus{
                            font-size: 28px;
                            color: #8c939d;
                            text-align: center;
                        }
                    }
                    .del_icon{
                        font-size: 24px;
                        position: absolute;
                        right: 5px;
                        top: 10px;
                        cursor: pointer;
                        &:hover{
                            color: #46a6ff;
                        }
                    }
                    .item_list{
                        margin: 0;
                        padding: 10px;
                        list-style: none;
                        li{
                            min-height: 40px;
                            &.upload{
                                display: flex;
                                align-items: center;
                            }
                            .avatar_uploader{
                                margin-left: 10px;
                                .upload_box{
                                    box-sizing: border-box;
                                    width: 60px;
                                    height: 60px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    position: relative;
                                    overflow: hidden;
                                    border-radius: 5px;
                                    border: 1px solid #C0C4CC;
                                    .avatar{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                        }
                        
                        
                    }
                }
                
            }
        }
    }
}
</style>