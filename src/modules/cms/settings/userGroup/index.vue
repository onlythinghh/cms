<template>
    <div class="user_group">
        <!-- 用户分群 -->
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="80px" :model="searchInfo">
                    <el-row :gutter="10">
                        <el-col :span="16">
                            <el-form-item>
                                <el-radio-group v-model="searchInfo.type" @change="searchList">
                                    <el-radio-button :label="0">全部</el-radio-button>
                                    <el-radio-button :label="1">我创建的</el-radio-button>
                                </el-radio-group>
                                <el-input
                                    v-model="searchInfo.keyword"
                                    placeholder="请输入分群名称，创建人"
                                    style="width: 250px; margin-left: 10px"
                                    clearable
                                    maxlength="30"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetSearch">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="creatGroup">创建分群</el-button>
            </template>
            <el-table id="infoTabs" :data="tableData">
                <el-table-column label="分群名称" prop="name"></el-table-column>
                <el-table-column label="人数" prop="count"></el-table-column>
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime|dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" prop="createUser"></el-table-column>
                <el-table-column label="更新方式" prop="updateType"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="mini" @click="disposeItem(scope.row)">配置</el-button> -->
                        <el-button type="text" size="mini" @click="itemEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="itemDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-if="total > 10"
                class="pages"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="tablePage.size"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
        </TableRow>
        <el-dialog
            title=""
            :visible.sync="creatGroupDialog"
            width="70%"
            :before-close="creatGroupDialogClose"
            :close-on-click-modal="false"
        >
            <div class="creat_steps">
                <el-steps :active="stepsActive" align-center finish-status="success" process-status="finish">
                    <el-step title="设置基本信息"></el-step>
                    <el-step title="设置分群规则"></el-step>
                </el-steps>
                <el-form label-width="100px" :rules="FormRules" :model="creatForm">
                    <div v-show="stepsActive == 0" class="creat_one">
                            <el-form-item label="分群显示名" prop="name">
                                <el-input
                                    v-model="creatForm.name"
                                    placeholder="请输入显示名称"
                                    clearable
                                    maxlength="30"
                                />
                            </el-form-item>
                            <el-form-item label="分群名称" prop="group">
                                <el-input
                                    v-model="creatForm.group"
                                    placeholder="请输入分群名称"
                                    clearable
                                    maxlength="30"
                                ><template slot="prepend">user_group_</template></el-input>
                            </el-form-item>
                            <el-form-item label="更新方式" prop="updateType">
                                <el-radio-group v-model="updateradio" @change="checkUpdataway">
                                    <el-radio label="day">例行</el-radio>
                                    <el-radio label="manual">手动</el-radio>
                                </el-radio-group>
                                <span class="tips">{{creatForm.updateType == 'manual' ? '生成分群后可以手动点击【更新】来更新数据':'分每日凌晨更新'}}</span>
                                <section v-if="creatForm.updateType != 'manual'" >按
                                    <el-select v-model="creatForm.updateType" placeholder="请选择" style="width: 80px">
                                        <el-option
                                            v-for="item in modeOpt"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select> 计算
                                </section>
                                
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input
                                    v-model="creatForm.description"
                                    type="textarea"
                                    placeholder="请输入实验名称"
                                    clearable
                                />
                            </el-form-item>
                    </div>
                    <div v-show="stepsActive == 1" class="creat_two">
                        <div class="title">在全部用户中,将满足一下条件的用户保存为用户分群</div>
                        <div class="creat_rule_container">
                            <div class="rule_relation"><span class="factor" @click="changeFactor">{{ruleFactor ?'且': '或'}}</span></div>
                            <div class="rule_container">
                                <div class="creat_menu">
                                    <div class="top_txt">
                                        <span class="top_icons" @click="togglemenu(1)">
                                            客户属性满足<i v-show="!showMenus1" class="el-icon-plus"></i><i v-show="showMenus1" class="el-icon-minus"></i>
                                        </span>
                                        <span class="top_adds" @click="addUsrAttr">添加</span>
                                    </div>
                                    <div v-show="showMenus1" class="creat_item">
                                        <div v-for="(obj, index) in creatForm.properties" :key="index" class="cond_const creat_item_cont">
                                            <div class="creat_item_cont">
                                                
                                                <el-select v-model="obj.propertyId" class="wd_12" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in userProperty"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id"
                                                    ></el-option>
                                                </el-select>
                                                <el-select v-model="obj.operator" class="wd_12" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in userOperator"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                    ></el-option>
                                                </el-select>
                                                <el-input
                                                    v-model="obj.content"
                                                    placeholder="请输入"
                                                    clearable
                                                    maxlength="30"
                                                    class="wd_12"
                                                />
                                                <el-button v-if="index >= 1" size="mini" type="primary" plain @click="delUsrAttr(index)">
                                                    删除
                                                </el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="creat_menu">
                                    <div class="top_txt">
                                        <span class="top_icons" @click="togglemenu(2)">用户行为满足
                                            <i v-show="!showMenus2" class="el-icon-plus"></i><i v-show="showMenus2" class="el-icon-minus"></i>
                                        </span>
                                        <span class="top_adds" @click="addUbehaviorAttr">添加</span>
                                    </div>
                                    <!--<div class="creat_rule_container">
                                         <div class="rule_relation">
                                            <span class="factor">且</span>
                                        </div> -->
                                        <div v-show="showMenus2" class="rule_container">
                                            <div class="creat_item">
                                                <div v-for="(obj, index) in creatForm.actions" :key="index+2" class="cond_const creat_item_cont">
                                                    <el-date-picker
                                                        v-model="obj.times"
                                                        type="daterange"
                                                        style="width:240px"
                                                        range-separator="-"
                                                        format="yyyy-MM-dd hh:mm:ss"
                                                        value-format="yyyy-MM-ddThh:mm:ss"
                                                        start-placeholder="开始日期"
                                                        end-placeholder="结束日期"
                                                    ></el-date-picker>
                                                    <!-- hadDone: '', //  是否做过 
                                                    actionId: '', // 用户行为id
                                                    propertyId:'', // 行为属性
                                                    condition: '', // 行为操作x -->
                                                    <!-- <el-button type="info" plain disabled style="margin: 0 10px">做过</el-button> -->
                                                    <el-select v-model="obj.hadDone" placeholder="请选择" style="width:100px; margin-left: 10px">
                                                        <el-option :value="true" label="做过"></el-option>
                                                        <el-option :value="false" label="没做过"></el-option>
                                                    </el-select>
                                                    <!-- 用户行为id -->
                                                    <div class="item_tram">
                                                        <el-select v-model="obj.actionId" class="wd_12" placeholder="请选择">
                                                            <el-option
                                                                v-for="item in indicatorAction"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                        <!-- 用户行为属性id -->
                                                        <el-select v-model="obj.propertyId" class="wd_12" placeholder="请选择">
                                                            <el-option
                                                                v-for="item in indicatorProperty"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                        <!-- 行为操作 -->
                                                        <el-select v-model="obj.condition" class="wd_11" placeholder="请选择">
                                                            <el-option
                                                                v-for="item in userCondition"
                                                                :key="item.value"
                                                                :label="item.label"
                                                                :value="item.value"
                                                            ></el-option>
                                                        </el-select>
                                                        <el-input
                                                            v-model="obj.content"
                                                            placeholder="请输入"
                                                            clearable
                                                            maxlength="30"
                                                            class="wd_12"
                                                        />
                                                    </div>
                                                    <!-- <el-button type="text" @click="addCondItem(index)">添加筛选</el-button> -->
                                                    <el-button v-if="index >= 1" type="text" class="delpos"
                                                        @click="delUbehaviorAttr(index)"
                                                    >删除</el-button>
                                                </div>
                                            </div>
                                        </div>
                                    <!-- </div> -->
                                </div>
                                <div class="creat_menu mg">
                                    <div class="top_txt">
                                        <span class="top_icons" @click="togglemenu(3)">行为序列
                                            <i v-show="!showMenus3" class="el-icon-plus"></i><i v-show="showMenus3" class="el-icon-minus"></i>
                                        </span>
                                        <span class="top_adds" @click="addSequenceAttr">添加</span>
                                    </div>
                                    <!-- <div class="creat_rule_container">
                                        <div class="rule_relation">
                                            <span class="factor">且</span>
                                        </div>
                                        <div class="rule_container"> -->
                                            <div v-show="showMenus3" class="creat_item">
                                                <div v-for="(obj, index) in creatForm.sequences" :key="index" class="creat_item_cont cond_const">
                                                    <el-date-picker
                                                        v-model="obj.times"
                                                        type="daterange"
                                                        range-separator="-"
                                                        format="yyyy-MM-dd hh:mm:ss"
                                                        value-format="yyyy-MM-ddThh:mm:ss"
                                                        start-placeholder="开始日期"
                                                        end-placeholder="结束日期"
                                                    ></el-date-picker><span class="item_tip">依次做过</span>
                                                    <el-button type="text" @click="addActionItem(index)">添加筛选</el-button>
                                                    <el-button v-if="index >= 1" type="text" class="delpos"
                                                        @click="delSequencerAttr(index)"
                                                    >删除</el-button>
                                                    <div v-for="(act, idx) in obj.actions" :key="idx" class="cond_list">
                                                        <el-select v-model="act.actionId" class="wd_12" placeholder="请选择" >
                                                            <el-option
                                                                v-for="item in indicatorAction"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                        <!-- 用户行为属性id -->
                                                        <el-select v-model="act.propertyId" class="wd_12" placeholder="请选择">
                                                            <el-option
                                                                v-for="item in indicatorProperty"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                        <!-- 行为操作 -->
                                                        <el-select v-model="act.condition" class="wd_11" placeholder="请选择">
                                                            <el-option
                                                                v-for="item in userCondition"
                                                                :key="item.value"
                                                                :label="item.label"
                                                                :value="item.value"
                                                            ></el-option>
                                                        </el-select>
                                                        <el-input
                                                            v-model="act.content"
                                                            placeholder="请输入"
                                                            clearable
                                                            maxlength="30"
                                                            class="wd_12"
                                                        />
                                                        <i class="el-icon-close cursor" @click="delActionItem(index, idx)"></i>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        <!-- </div>
                                    </div> -->
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="creatGroupDialogClose">取 消</el-button>
                <el-button v-show="stepsActive == 0" type="primary" @click="nextStep">下一步</el-button>
                <el-button v-show="stepsActive == 1" type="primary" @click="prevStep">上一步</el-button>
                <el-button v-show="stepsActive == 1" type="primary" @click="confirmSeave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="disposeDialog"
            width="40%"
            :before-close="disposeDialogClose"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <el-form ref="disposeref" :model="disposeForm" :rules="disposeRules" label-width="80px">
                <el-form-item label="分群名称">
                    <el-input v-model="disposeForm.name" disabled />
                </el-form-item>
                <el-form-item label="选择频道" prop="channel">
                    <TreeSelect
                        ref="testSelect"
                        v-model="disposeForm.channel"
                        placeholder="请选择父级资源"
                        :options="channerDatas"
                        :default-expand-all="true"
                        :checked-on-click="true"
                        text-prop="label"
                    />
                </el-form-item>
                <el-form-item label="选择页面" prop="porductId">
                    <el-select v-model="disposeForm.porductId" style="width: 392px" clearable placeholder="请选择">
                        <el-option
                            v-for="item in porductOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="disposeDialogClose">取 消</el-button>
                <el-button type="primary" @click="disposeConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { deepCopy } from '@/utils/BaseUtil'
import { showLoading } from "@/utils"
import { matchCode } from "@/utils/RegExpUtil"
export default {
    data() {
        return {
            searchInfo: {
                type: 0, // 0:全部  1:创建的
                searchInfo: ''
            },
            tablePage: {
                page: 0,
                size: 10
            },
            total: 0, // 数据列表总数
            tableData: [],
            creatGroupDialog: false,
            stepsActive: 0,
            updateradio: 'day',
            creatForm: {
                group: '', // 分群名称
                name: '', // 分群显示名称
                updateType: 'day', //更新周期 取值：day,week,month,manual
                description: '', // 备注
                properties: [ // 用户属性
                    {
                        propertyId: '',
                        operator: '',
                        content: '',
                    }
                ],
                actions: [ // 行为属性
                    {
                        times: '',
                        hadDone: '', //  是否做过 
                        actionId: '', // 用户行为id
                        propertyId:'', // 行为属性
                        condition: '', // 行为操作
                        content: '',
                        startTime: '',
                        endTime: ''
                    },
                ],
                sequences: [ // 行为序列
                    {
                        times: [],
                        strTime: '',
                        endTime: '',
                        actions: [
                            {
                                actionId: '',
                                propertyId: '',
                                condition: '',
                                content: ''
                            }
                        ]
                    }
                ],
            },
            ruleFactor: true, // 规则条件 true:且 false: 或
            
            showMenus1: true,
            showMenus2: false,
            showMenus3: false,
            modeOpt: [
                {value: 'day', label: '天'},
                {value: 'week', label: '周'},
                {value: 'month', label: '月'},
                
            ],
            userProperty: [], // 用户属性
            userOperator: [], // 属性操作
            // userAction: [], // 用户操作

            indicatorAction: [], //  用户行为
            indicatorProperty: [], // 行为属性
            userCondition: [], // 行为操作

            porductOpt: [
                {value: '1', label: '养老年金'},
                {value: '2', label: '教育年金'},
                {value: '3', label: '大病保险'},
            ],
            FormRules:{
                showName: [{ required: true, message: "显示名称为必填项" }],
                name: [
                    { required: true, message: "名称为必填项" },
                    {
                        validator: function(rule, value, callback) {
                            if(!matchCode(value)) {
                                callback("表单名称只能输入数字、字母、下划线");
                            } else {
                                callback();
                            }
                        }
                    }
                ],
            },
            // 配置弹框
            channerDatas: [],
            disposeDialog: false,
            disposeRow: null,
            disposeForm: {
                name: '',
                channel: '',
                porductId: ''
            },
            disposeRules:{
                channel:[
                    { required: true, message: "渠道不能为空", trigger: "blur" }
                ]
            },
        }
    },
    mounted() {
        this.getchannel()
        this.queryGroupList()
        this.queryUserProperty()
        this.queryUserOperator()
        // this.queryUserAction()

        this.queryIndicatorAction()
        this.queryIndicatorProperty()
        this.queryGroupCondition()
    },
    methods:{
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        ...mapActions("cms/settings/userGroup", [
            "getUserGroupList",
            "getUserGroupSave",
            // "getUserGroupAction",
            "getUserGroupProperty",
            "getUserGroupOperator",
            "getUserGroupDelete",
            "getUserGroupCondition"
        ]),
        ...mapActions("cms/settings/abtest", ["getIndicatorAction", "getIndicatorProperty"]),
        // 获取频道
        async getchannel(){
            showLoading(true, "正在加载站频道");
            let _site = JSON.parse(sessionStorage.getItem("SITE"));
            // this.appid = _site.id
            let data = await this.getChannelList({ appid: _site.id });
            console.log('频道信息',data)
            const treeResources = deepCopy(data || [])
            this.channerDatas = this.toOptions(treeResources)
            showLoading(false);
        },
        // 父级资源
        toOptions(resources) {
            return resources.map(({ name: label, id: value, children }) => {
                const opt = { label, value}
                if (children && children.length > 0) {
                    opt.children = this.toOptions(children)
                }
                return opt
            })
        },
        queryGroupList(){
            let params = {
                ...this.searchInfo,
                ...this.tablePage
            }
            showLoading(true, "加载中...");
            // this.tableData = [{id:"1", name: '分群名称', count: '123', createTime: '2022-05-23', createUser: 'micro', updateType: '日更'}]
            this.getUserGroupList(params).then(res => {
                showLoading(false);
                console.log('用户分群列表:', res)
                if(res.success) {
                    this.tableData = res.data.content || []
                    this.total = res.count
                } else {
                    this.$message.error(res.errMsg);
                }
            }).catch(err => {
                showLoading(false);
            })
        },
        queryUserProperty() {
            // 用户属性查询
            this.getUserGroupProperty().then(res => {
                console.log('resres',res)
                if(res.success){
                    let data = JSON.parse(JSON.stringify(res.data))
                    this.userProperty = data // this.handleObjert(data)
                }
            })
        },
        queryUserOperator() {
            // 属性操作查询
            this.getUserGroupOperator().then(res => {
                if(res.success){
                    let data = JSON.parse(JSON.stringify(res.data))
                    this.userOperator = this.handleObjert(data)
                }
            })
        },
        // queryUserAction() {
        //     // 用户操作查询
        //     this.getUserGroupAction().then(res => {
        //         if(res.success){
        //             // this.userAction = res.data
        //             let data = JSON.parse(JSON.stringify(res.data))
        //             this.userAction = this.handleObjert(data)
        //         }
        //     })
        // },

        queryIndicatorAction(){
            // 基础事件查询
            this.getIndicatorAction().then(res => {
                console.log('基础事件查询res',res)
                if(res.success) {
                    this.indicatorAction = res.data
                } else {
                    // this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        queryIndicatorProperty(){
            // 基础事件属性查询
            this.getIndicatorProperty().then(res => {
                console.log('基础事件属性查询res',res)
                if(res.success) {
                    this.indicatorProperty = res.data
                }
            })
        },
        queryGroupCondition(){ 
            this.getUserGroupCondition().then(res => {
                console.log('Condition事件属性查询res',res)
                if(res.success) {
                    this.userCondition = this.handleObjert(res.data)
                }
            })
        },

        handleObjert(data) {
            if(data&&JSON.stringify(tmp) == '{}') return []
            let tmp = []
            for(let key in data) {
                let v = key
                let item = {
                    [v]: data[key],
                    label: data[key],
                    value: key
                }
                tmp.push(item)
            }
            return tmp
        },

        // 搜索查询
        searchList(){
            console.log('搜索查询', this.searchInfo)
            this.queryGroupList()
        },
        // 重置查询
        resetSearch(){
            this.searchInfo = this.$options.data().searchInfo
            this.queryGroupList()
        },

        // 创建分群
        creatGroup(){
            console.log('创建分群')
            this.creatGroupDialog = true
        },
        checkUpdataway(val){
            console.log('选中更新类型', val)
            this.creatForm.updateType = val
        },

        // 表格编辑
        itemEdit(row) {
            console.log('编辑', row)
            this.creatForm = row
            this.creatGroupDialog = true
        },
        itemDelete(row) {
            this.getUserGroupDelete({id: row.id}).then(res => {
                if(res.success) {
                    this.queryGroupList()
                    this.$message.success(res.data || "操作成功!");
                } else {
                    this.$message.error(res.errMsg);
                }
            })
        },
        // 下一步
        nextStep(){
            // console.log('this.creatForm',this.creatForm)
            const { name, showName } = this.creatForm
            if(name == '' || showName == ''){
                return this.$message.error('分群显示名和分群名称不能为空')
            }
            if (this.stepsActive++ > 1) this.stepsActive = 1;
        },
        // 上一步
        prevStep(){
            if (this.stepsActive-- > 0) this.stepsActive = 0;
        },
        // 保存新增
        confirmSeave(){
            console.log('保存新增', this.creatForm)
            showLoading(true, "加载中...");
            this.getUserGroupSave({...this.creatForm}).then(res => {
                showLoading(false);
                console.log('保存res', res)
                if(res.success) {
                    this.$message.success(res.data|| '操作成功!')
                    this.queryGroupList()
                    this.creatGroupDialogClose()
                } else {
                    this.$message.error(res.errMsg)
                }
            }).catch(err => {
                showLoading(false);
                this.$message.error("服务器异常，请稍后再试!")
            })
        },

        togglemenu(type){
            console.log('类型', type)
            switch(type){
            case 1:
                this.showMenus1 = !this.showMenus1
                break
            case 2:
                this.showMenus2 = !this.showMenus2
                break
            case 3:
                this.showMenus3 = !this.showMenus3
                break
            }
        },
        changeFactor(type){
            this.ruleFactor = !this.ruleFactor
        },
        // ------用户属性----------
        // 用户属性新增
        addUsrAttr(){
            this.creatForm.properties.push({
                propertyId: '',
                operator: '',
                content: '',
            })
        },
        // 用户属性删除
        delUsrAttr(index){
            this.creatForm.properties.splice(index, 1)
        },
        // ------用户属性 end------
        
        // -----用户行为------
        // 新增用户行为大类
        addUbehaviorAttr(){
            let item = {
                times: '',
                hadDone: '', //  是否做过 
                actionId: '', // 用户行为id
                propertyId:'', // 行为属性
                condition: '', // 行为操作
                content: '',
                startTime: '',
                endTime: ''
            }
            this.creatForm.actions.push(item)
        },
        // 删除用户行为大类
        delUbehaviorAttr(index) {
            this.creatForm.actions.splice(index, 1)
        },
        // addCondItem(index) {// 行为过滤条件添加
        //     this.creatForm.actions[index].condlist.push({
        //         option1: '',
        //         option2: '',
        //         vals: ''
        //     })
        // },
        // delCondItem(index, idx) { // 行为过滤条件删除
        //     this.creatForm.actions[index].condlist.splice(idx, 1)
        // },
        // -----用户行为 end------
        // -----行为序列 ------
        addSequenceAttr(){ // 新增行为序列
            this.creatForm.sequences.push({
                times: [],
                strTime: '',
                endTime: '',
                actions: [
                    {
                        actionId: '',
                        propertyId: '',
                        condition: '',
                        content: ''
                    }
                ]
            })
        },
        // 删除行为序列
        delSequencerAttr(index){
            this.creatForm.sequences.splice(index, 1)
        },
        // 添加过滤条件
        addActionItem(index){
            this.creatForm.sequences[index].actions.push({
                actionId: '',
                propertyId: '',
                condition: '',
                content: ''
            })
        },
        // 删除过滤条件
        delActionItem(index, idx){
            this.creatForm.sequences[index].actions.splice(idx, 1)
        },
        // -----行为序列 end---
        // 新建取消 关闭
        creatGroupDialogClose(){
            this.creatGroupDialog = false
            this.stepsActive = 0
            this.creatForm = this.$options.data().creatForm
        },
        // 配置弹框
        disposeItem(row){
            this.disposeDialog = true
            this.disposeRow = row
            this.disposeForm.name = row.name
        },
        disposeConfirm() {
            console.log('this.disposeForm',this.disposeForm)
        },
        disposeDialogClose(){
            this.disposeDialog = false
            this.disposeForm = this.$options.data().disposeForm
            this.disposeRow = null
        },

        sizeChange(v){
            this.tablePage.size = v
            this.queryGroupList()
        },
        currentChange(v){
            this.tablePage.page = v - 1
            this.queryGroupList()
        },
    }
}
</script>
<style lang="scss" scoped>
.cursor{
    cursor: pointer;
}
.creat_steps{
    .creat_one{
        .tips{
            font-size: 12px;
            color: #c8c7c7;
        }
    }
    .creat_two{
        .title{
            margin: 10px 0;
        }
        .creat_rule_container{
            position: relative;
            display: flex;
            margin-top: 10px;
            .rule_relation{
                left: 0;
                top: 0;
                bottom: 0;
                position: relative;
                margin-right: 8px;
                &::before{
                    content: " ";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 2px;
                    height: 100%;
                    overflow: hidden;
                    background: #add6ff;
                }
                .factor{
                    position: relative;
                    display: block;
                    top: 50%;
                    left: 0;
                    right: 0;
                    width: auto;
                    min-width: 25px;
                    height: 25px;
                    transform: translateY(-50%);
                    border-radius: 3px;
                    background: #add6ff;
                    color: #ffffff;
                    font-size: 14px;
                    line-height: 25px;
                    text-align: center;
                    cursor: pointer;
                    user-select: none;
                }
            }
            .rule_container{
                flex: 1;
            }
        
        }
        .creat_menu{
            padding: 10px;
            border: 1px solid #ccc;
            margin-bottom: 15px;
            position: relative;
            &.mg{
                margin-bottom: 0;
            }
            .top_txt{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .top_icons, .top_adds{
                    cursor: pointer;
                }
            }
            .wd_12{
                width: 120px;
                margin-right: 10px;
            }
            .wd_11{
                width: 110px;
                margin-right: 10px;
            }
            .creat_item{
                position: relative;
                .item_adds{
                    position: absolute;
                    top: 5px;
                    right: 40px;
                    z-index: 1;
                    // transform: translateY(-50%);
                    cursor: pointer;
                }
                .item_tram{
                    margin: 10px 0;
                }
                .creat_item_cont{
                    // margin-top: 10px;
                    position: relative;
                    &.cond_const{
                        margin-bottom: 20px;
                        &:last-child{
                            margin-bottom: 0;
                        }
                    }
                    .item_tip{
                        margin: 0 10px;
                        color: #c8c7c7;
                    }
                    .delpos{
                        position: absolute;
                        right: 30px;
                        top: 5px;
                    }
                    .cond_list{
                        margin-top: 15px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .cond_l{
                            width: 70px;
                            text-align: center;
                        }
                        .cond_r{
                            border-left:  1px solid #c8c7c7;
                            padding-left: 10px;
                            .cond_item{
                                margin:  5px 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>