<!--流程管理-->
<template>
    <div>
        <div class="header">
            <el-form label-width="80px" class="from">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="名称">
                            <el-input v-model="name" placeholder="请输入查询名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item class="btn">
                            <el-button type="primary" icon="el-icon-search" @click="seaList">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btnAdd">
            <el-button type="primary" size="mini" @click="addVisible = true">新增</el-button>
            <div class="right">
                <el-button type="primary" size="mini" @click="examineShow = true">审批日志</el-button>
                <el-button type="primary" size="mini" @click="downloadShow = true">导出</el-button>
            </div>
        </div>
        <div class="pop">
            <el-dialog :visible.sync="addVisible" width="70%">
                <el-form ref="rulepros" label-width="100px" :rules="prossnameRules" :model="proSave">
                    <el-form-item label="流程名称" prop="name">
                        <el-input v-model="proSave.name" placeholder="请输入流程名称" style="width: 70%" clearable />
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="proSave.type" multiple placeholder="请选择">
                            <el-option
                            v-for="item in protypeList"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary" size="mini" @click="plusnode">添加步骤</el-button>
                <el-dialog :visible.sync="nodeVisible" title="设置流程步骤" append-to-body width="80%">
                    <el-form ref="rulenode" label-width="100px" :model="node" :rules="nodeRules">
                        <el-form-item label="步骤" prop="name">
                            <el-input v-model="node.name" placeholder="请输入步骤" style="width: 80%" clearable />
                        </el-form-item>
                        <el-form-item label="类型" required>
                            <el-radio-group v-model="node.type">
                                <el-radio :label="1">人员</el-radio>
                                <el-radio :label="2">组织</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="审核">
                            <el-radio-group v-model="node.shtype">
                                <el-radio disabled :label="0">主审</el-radio>
                                <el-radio disabled :label="1">候审</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-row>
                            <el-col :span="8">
                                <!-- @node-click="orgClick" -->
                                <el-tree
                                    ref="orgTree"
                                    node-key="id"
                                    label="shortName"
                                    :default-expand-all="true"
                                    :highlight-current="true"
                                    :check-on-click-node="true"
                                    :data="trees"
                                    accordion
                                    check-strictly
                                    show-checkbox
                                    class="orgtree"
                                    @check-change="checkclick"
                                >
                                    <template v-slot="{ data }">
                                        <div slot="reference">{{ data.shortName }}</div>
                                    </template>
                                </el-tree>
                            </el-col>
                            <el-col :span="16">
                                <el-input v-model="userKey" placeholder="请输入账号或姓名查询" style="width: 70%;margin-right: 5px" clearable/>
                                <el-button type="primary" @click="gitusers">查询</el-button>
                                <el-table
                                    ref="TableUser"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    max-height="595"
                                    row-key="id"
                                    :data="userListdata"
                                    :row-style="{ height: '54px' }"
                                    :cell-style="{ padding: '0' }"
                                    :header-cell-style="{ 'text-align': 'center' }"
                                    @select="userSelect"
                                    @select-all="selectALL"
                                    @selection-change="handleSelectionChange"
                                >
                                    >
                                    <el-table-column type="selection" width="55" align="center" />
                                    <el-table-column prop="account" label="账号" align="center" />
                                    <el-table-column prop="name" label="姓名" align="center" />
                                    <el-table-column prop="orgName" label="组织" align="center" />
                                    <el-table-column prop="role" label="角色" align="center" />
                                </el-table>
                                <div class="paganition">
                                    <el-pagination
                                        :total="usertotal"
                                        :current-page="pageuser"
                                        layout="total, prev, pager, next, jumper"
                                        @current-change="handleCurrentChangeuser"
                                    ></el-pagination>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="btncebter">
                        <el-button type="primary" size="mini" @click="nodeadd">保存步骤</el-button>
                        <el-button size="mini" @click="nodeVisible = false">关闭</el-button>
                    </div>
                </el-dialog>
                <div class="addTable">
                    <el-table :data="proSave.nodeList" class="" height="500" :header-cell-style="{ 'text-align': 'center' }">
                        <el-table-column label="步骤" prop="name" align="center">
                            <template v-slot="{ row }">
                                <div class="top_column">主审{{row.name}}</div>
                                <div v-if="JSON.stringify(row.slave) != '{}'">
                                    <div class="botm_column">候审{{row.name}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" align="center">
                            <template v-slot="{ row }">
                                <div class="top_column">{{row.master.type == 1 ? "人员" : "组织"}}</div>
                                <div v-if="JSON.stringify(row.slave) != '{}'">
                                    <div class="botm_column">{{row.slave.type == 1 ? "人员" : "组织"}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="组织" prop="reviewerOrgName" align="center">
                            <template v-slot="{ row }">
                                <div class="top_column">{{row.master.reviewerOrgName}}</div>
                                <div v-if="JSON.stringify(row.slave) != '{}'">
                                    <div class="botm_column">{{row.slave.reviewerOrgName}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="审核人" prop="reviewer" align="center">
                            <template v-slot="{ row }">
                                <div class="top_column">{{row.master.reviewer}}</div>
                                <div v-if="JSON.stringify(row.slave) != '{}'">
                                    <div class="botm_column">{{row.slave.reviewer}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200px" align="center">
                            <template slot-scope="scope">
                                <div class="top_column">
                                    <el-button type="primary" size="mini" style="margin-right:5px"
                                        @click="modifynode(scope, 0)"
                                    >主审修改</el-button>
                                    <el-popconfirm title="确定删除这一节点吗？" @confirm="romenode(scope, 0)">
                                        <el-button slot="reference" type="danger" size="mini">删除</el-button>
                                    </el-popconfirm>
                                </div>
                                <div v-if="JSON.stringify(scope.row.slave) != '{}'">
                                    <div class="botm_column">
                                        <el-button type="primary" size="mini" style="margin-right:5px"
                                            @click="modifynode(scope, 1)"
                                        >候审修改</el-button>
                                        <el-popconfirm title="确定删除这一节点吗？" @confirm="romenode(scope, 1)">
                                            <el-button slot="reference" type="danger" size="mini">删除</el-button>
                                        </el-popconfirm>
                                    </div>
                                    
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="btncebter">
                    <el-button type="primary" @click="addclick()">保存</el-button>
                    <el-button @click="addVisible = false">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="nodeaddVisible">
                <el-row>
                    <el-col :span="8">
                        <el-table
                            :data="siteData.stte"
                            height="480"
                            :header-cell-style="{ 'text-align': 'center' }"
                            row-key="id"
                            @cell-click="appchange"
                        >
                            <el-table-column label="站点列表" prop="name" />
                        </el-table>
                    </el-col>
                    <el-col :span="16">
                        <p>当前站点：{{ siteData.appname }}</p>
                        <el-tree
                            :data="siteData.channelList"
                            default-expand-all
                            show-checkbox
                            check-strictly
                            :default-checked-keys="siteData.channel"
                            node-key="id"
                            :props="siteData.defaultProps"
                            class="video_tree"
                            @check="Cchange"
                        />
                    </el-col>
                </el-row>
                <div class="btncebter">
                    <el-button type="primary" @click="siteadd">保存</el-button>
                    <el-button @click="nodeaddVisible = false">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="examineShow" title="审批日志" :before-close="examineDialogClose" width="90%">
                <el-table
                    style="width: 100%"
                    :data="examineData"
                >
                    <el-table-column label="序列" width="55" type="index" align="center" />
                    <el-table-column prop="deptName" label="部门" align="center" />
                    <el-table-column prop="channelName" label="栏目名称" align="center" />
                    <el-table-column prop="url" label="页面地址" align="center" />
                    <el-table-column prop="publishContent" label="发布内容" align="center" />
                    <el-table-column prop="publishReason" label="发布原因" align="center" />
                    <el-table-column prop="operationDate" label="操作时间" align="center" />
                    <el-table-column label="附件内容" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.attachList.length>0" type="text" size="mini" @click="lookUP(scope)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditRemark" label="审批备注" align="center" />
                    <el-table-column prop="auditStatus" label="审批状态" align="center" />
                    <el-table-column prop="executor" label="执行人" align="center" />
                    <el-table-column prop="operationType" label="操作类型" align="center" />
                </el-table>
                <el-pagination
                    v-if="pageInfo.total > 10"
                    class="pages"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.limit"
                    :total="pageInfo.total"
                    layout="total, sizes, prev, pager, next"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                ></el-pagination>
            </el-dialog>
            <el-dialog :visible.sync="lookUpShow" title="查看" :before-close="lookUpDialogClose">
                <div>
                    <p v-for="obj in lookUpData" :key="obj.id">{{obj.origin}}</p>
                </div>
                <div class="btncebter">
                    <el-button type="primary" @click="annexDownload">下载</el-button>
                    <el-button @click="lookUpDialogClose">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="downloadShow" title="导出" :before-close="downloadDialogClose">
                <el-form ref="rulepros" label-width="60px" :model="downloadForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="部门" prop="dept">
                                <TreeSelect
                                    ref="testSelect"
                                    v-model="downloadForm.dept"
                                    placeholder="请选择"
                                    :options="deptdatas"
                                    :default-expand-all="true"
                                    :checked-on-click="true"
                                    text-prop="label"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时间" prop="time">
                                <el-date-picker
                                    v-model="downloadForm.time"
                                    type="daterange"
                                    value-format="timestamp"
                                    style="width: 230px"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="栏目" prop="channel">
                                <TreeSelect
                                    ref="testSelect"
                                    v-model="downloadForm.channel"
                                    placeholder="请选择"
                                    :options="channerDatas"
                                    :default-expand-all="true"
                                    :checked-on-click="true"
                                    text-prop="label"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="status">
                                <el-select v-model="downloadForm.status" placeholder="请选择">
                                    <el-option
                                        v-for="item in optionsTst"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" @click="downloadRecord">导出</el-button>
                    <el-button size="mini" @click="downloadDialogClose">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <div class="Table">
            <el-table
                ref="Tabledata"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="595"
                row-key="id"
                :data="datas"
                :row-style="{ height: '54px' }"
                :cell-style="{ padding: '0' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <el-table-column label="序列" width="60" type="index" align="center" />
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column prop="reviewer" label="审核人员" align="center" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="modifyAdd(scope.row.id, 1)">修改</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-document-copy" @click="modifyAdd(scope.row.id, 0)">复制</el-button>
                        <el-button type="info" size="mini" icon="el-icon-setting" @click="noneAdd(scope.row)">设置</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="noneDel(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="paganition">
            <el-pagination
                :total="total"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                :pager-count="5"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import { showLoading, showError, hideLoading, confirm, showMessage } from "@/utils";
import { mapActions, mapGetters, mapState } from "vuex";
import { deepCopy } from "@/utils/BaseUtil";
import { downLoadFile } from '@/utils/FileDonwload'
export default {
    data() {
        return {
            name: "",
            currentPage: 1,
            total: 0,
            limit: 10,
            page: 1,
            datas: [],
            addVisible: false,
            proSave: {
                id: 0,
                name: "",
                nodeList: [],
                type: []
            },
            protypeList:[
                {label: '发布', id: 'PUBLISH'},
                {label: '撤稿', id: 'REVOKE'},
                {label: '删除', id: 'RECYCLE'}
            ],
            prossnameRules: {
                name: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
                type: [{ required: true, message: "请选择类型", trigger: "change" }]
            },
            nodeVisible: false,
            changeType: null, // 0修改主审  1修改候审
            node: {
                // flow: 0,
                // id: 0,
                name: "",
                reviewer: "",
                type: 1, // "1人员  2组织",
                reviewerName: "",
                reviewerOrg: "",
                reviewerOrgName: ""
            },
            nodeRules: {
                name: [
                    {
                        required: true,
                        message: "请输入节点名称",
                        trigger: "blur"
                    }
                ],
                reviewer: [
                    {
                        required: true,
                        message: "请输入节点审核人",
                        trigger: "blur"
                    }
                ]
            },
            nodeList: [],
            userData: [],
            nodeaddVisible: false,
            siteData: {
                flow: 0,
                appid: 1,
                appname: "",
                stte: [],
                channelList: [],
                appList: [],
                channel: [],
                defaultProps: {
                    children: "children",
                    label: "name"
                }
            },
            modIndex:null,
            contextmenu: {},
            userKey: "",
            userListdata: {},
            usertotal: 0,
            setOrgid: 0,
            pageuser: 1,
            org_tree: {},
            examineShow: false,
            examineData: [],
            pageInfo: {
                limit: 10,
                page: 1,
                total: 0
            },
            downloadShow: false, // 导出
            downloadForm: {
                dept: '',
                channel: '',
                time: '',
                status: ''
            },
            optionsTst:[
                { value: '1', label: '通过', },
                { value: '2', label: '未通过', },
            ],
            channerDatas: [],
            deptdatas: [],
            lookUpShow: false, // 查看附件
            lookUpData: []
        };
    },
    computed: {
        ...mapState("system/user/org", ["trees"])
    },
    watch: {
        nodeVisible(v) {
            if (!v) {
                // this.node.id = 0;
                // this.node.flow = 0;
                this.node.name = "";
                this.node.reviewer = "";
                this.node.type =  1// "1人员  2组织";
                this.pageuser = 1;
                this.setOrgid = 0;
                this.userKey = "";
            }
        },
        addVisible(v) {
            if (!v) {
                this.proSave.id = 0;
                this.proSave.nodeList = [];
                this.proSave.name = "";
                this.seaList();
            }
        },
        downloadShow(v) {
            if(v) {
                this.siteChange()
                this.getDept()
            }
        }
    },
    created() {
        this.seaList();
        this.queryExamineList()
    },

    methods: {
        ...mapActions("system/user/org", ["loadOrgTree"]),
        ...mapGetters("cms/site", ["site"]),
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("cms/pross", [
            "prossSeve1",
            "getlist",
            "getlist",
            "prossSeve",
            "prossDetail",
            "prossDel",
            "getSetting",
            "pressSettingSave",
            "getUser",
            "getreviewLogs",
            "getlogsExport",
        ]),
        async seaList() {
            showLoading(true);
            let res = await this.getlist({
                name: this.name,
                page: this.page,
                limit: this.limit
            });
            this.total = res.count;
            this.datas = res.data;
            let _site = JSON.parse(sessionStorage.getItem("SITE"));
            this.siteData.appid = _site.id;
            this.siteData.appname = _site.name;
            hideLoading();
        },
        queryExamineList(){
            // 获取审批日志列表
            let { page, limit } = this.pageInfo
            let params = {
                page,
                limit
            }
            this.getreviewLogs(params).then(res => {
                console.log('res审批日志',res)
                if(res.success) {
                    this.examineData = res.data,
                    this.pageInfo.total = res.count
                }
            })
        },
        // 修改,复制流程
        async modifyAdd(id, v) {
            showLoading(true);
            let res = await this.prossDetail({
                id,
            });
            console.log('流程数据:', res)
            if(res.data.nodeList.length > 0) {
                res.data.nodeList.forEach(ele => {
                    ele.master.name = ele.name
                    ele.slave.name = ele.name
                })
            }
            this.proSave.name = res.data.name;
            this.proSave.nodeList = res.data.nodeList; // testjson.nodeList
            this.proSave.id = res.data.id;
            this.proSave.type = res.data.type||[]
            this.addVisible = true;
            if (!v) {
                this.proSave.id = 0;
            }
            hideLoading();
        },
        // 设置流程
        async noneAdd(row) {
            let res = await this.loadSites();
            this.siteData.stte = res.tree;
            this.siteData.flow = row.id;
            this.nodeaddVisible = true;
            this.siteChange();
        },
        appchange(row) {
            this.siteData.appid = row.id;
            this.siteData.appname = row.name;
            this.siteChange();
        },
        Cchange(i, v) {
            let out = 0;
            this.siteData.appList.forEach(ele => {
                if (ele.app == this.siteData.appid) {
                    out = 1;
                    ele.channel = v.checkedKeys;
                }
            });
            if (!out) {
                this.siteData.appList.push({
                    app: this.siteData.appid,
                    channel: v.checkedKeys
                });
            }
            this.siteData.channel = v.checkedKeys;
        },
        async siteadd() {
            let res = await this.pressSettingSave({
                flow: this.siteData.flow,
                appList: this.siteData.appList
            });
            if (res.success) {
                this.$message({
                    type: "success",
                    message: res.data
                });
                this.nodeaddVisible = false;
            } else {
                this.$message.error("保存失败");
            }
        },
        async siteChange() {
            this.siteData.appList = [];
            this.siteData.channel = [];
            let res = await this.getChannelList({
                appid: this.siteData.appid
            });
            this.siteData.channelList = res;
            const treeResources = deepCopy(res || [])
            this.channerDatas = this.toOptions(treeResources)
            let res2 = await this.getSetting({
                id: this.siteData.flow
            });
            this.siteData.appList = res2.data.appList;
            this.siteData.appList.forEach(ele => {
                if (ele.app == this.siteData.appid) {
                    this.siteData.channel = ele.channel;
                }
            });
        },
        toOptions(resources, type = 0) {
            if(type == 0) {
                return resources.map(({ name: label, id: value, children }) => {
                    const opt = { label, value}
                    if (children && children.length > 0) {
                        opt.children = this.toOptions(children, 0)
                    }
                    return opt
                })
            } else {
                return resources.map(({ fullName: label, id: value, children }) => {
                    const opt = { label, value}
                    if (children && children.length > 0) {
                        opt.children = this.toOptions(children, 1)
                    }
                    return opt
                })
            }
        },
        getDept(){
            this.loadOrgTree().then(res => {
                const data = deepCopy(this.trees || [])
                this.deptdatas = this.toOptions(data, 1)
            }).catch(error => {
                showLoading(false);
                showError(error.message);
            });
        },
        // 删除流程
        noneDel(id) {
            confirm("您确认删除吗？", "警告", {
                ok: async () => {
                    showLoading(true, "正在删除...");
                    let res = await this.prossDel({
                        id
                    });
                    hideLoading();
                    if (res.success) {
                        this.$message({
                            type: "success",
                            message: res.data
                        });
                        this.seaList();
                    } else {
                        this.$message.error("删除失败");
                    }
                }
            });
        },
        // 新增节点
        plusnode() {
            this.$refs.rulepros.validate(async valid => {
                if (!valid) {
                    return false;
                }
                if (this.proSave.nodeList.length >= 5) {
                    return this.$message.error("步骤最多5步");
                }
                // this.gitusers();
                let obj = {
                    id: 0,
                    flow: 0,
                    name: "",
                    step: "0",
                    master: {
                        type: 1,
                        name: "step",
                        reviewerOrg: 0,
                        reviewerOrgName: null,
                        reviewer: null,
                        reviewerName: null
                    },
                    slave: {
                        type: 1,
                        name: "step",
                        reviewerOrg: 0,
                        reviewerOrgName: null,
                        reviewer: null,
                        reviewerName: null
                    }
                }
                this.proSave.nodeList.push(obj)
                console.log('this.proSave.nodeList',this.proSave.nodeList)
            });
        },
        async getUserName() {
            showLoading(true, "正在加载..");
            let res = await this.getUser({
                org: this.setOrgid,
                keyword: this.userKey,
                page: this.pageuser,
                limit: 50
            });
            this.usertotal = res.count;
            this.userListdata = res.data;
            hideLoading();
            this.nodeVisible = true;
            if(this.node.reviewerOrg){
                this.$refs.orgTree.setCheckedKeys([this.node.reviewerOrg])
            }
        },
        // 获取部门
        async gitusers() {
            showLoading(true, "正在加载机构");
            this.loadOrgTree().catch(error => {
                showLoading(false);
                showError(error.message);
            });
            this.getUserName();
        },
        // 保存流程
        addclick() {
            this.$refs.rulepros.validate(async valid => {
                if (!valid) {
                    return false;
                }
                if (this.proSave.nodeList.length == 0 || this.proSave.nodeList.length > 5) {
                    return this.$message.error("节点最少1条,最多5条");
                }
                // showLoading(true);
                if (!this.proSave.id) {
                    this.proSave.nodeList.forEach(ele => {
                        ele.flow = 0;
                        ele.id = 0;
                    });
                }
                // this.proSave.nodeList.forEach(ele => {
                //     if (ele.type == "人员" || ele.type == 1) {
                //         ele.type = 1;
                //     } else {
                //         ele.type = 2;
                //     }
                // });

                // 临时
                // let isLoad = this.proSave.nodeList.some(ele => {
                //     if(ele.id == 0) {
                //         if(
                //             ele.master.type == 1 &&ele.master.reviewer == null ||
                //             ele.slave.type ==1 &&ele.slave.reviewer  == null
                //         ) {
                //             return this.$message.error("新建数据的审核人不能为空!1");
                //         }
                        
                //         if(
                //            ele.master.type == 2 && ele.master.reviewerOrgName  == null ||
                //            ele.master.type == 2 && ele.slave.reviewerOrgName  == null
                //         ) {
                //             return this.$message.error("新建数据的组织不能为空!3");
                //         }
                //     }
                // })
                // if(isLoad) return false
                console.log('this.proSave',this.proSave)
                let res = await this.prossSeve({
                    ...this.proSave
                });
                if (res.success) {
                    this.$message({
                        message: res.errMsg,
                        type: "success"
                    });
                } else {
                    this.$message.error("保存失败");
                }
                this.addVisible = false;
                hideLoading();
                this.seaList();
            });
        },
        // 审批日志 关闭
        examineDialogClose() {
            this.examineShow = false
        },
        lookUP(row){
            this.lookUpData = row.row.attachList
            this.lookUpShow = true
        },
        lookUpDialogClose(){
            this.lookUpData = []
            this.lookUpShow = false
        },
        // 附件下载
        annexDownload(){
            let arr = []
            this.lookUpData.map(item => {
                arr.push(item.url)
            })
            downLoadFile(arr).then(() => {
                this.lookUpDialogClose()
                this.$message({
                    message: '操作成功!',
                    type: "success"
                });
            })
        },
        sizeChange(v){
            // 每页条数
            this.pageInfo.limit = v
            this.queryExamineList()
        },
        currentChange(v){
            this.pageInfo.page = v
            // console.log('翻页2： ', v)
            this.queryExamineList()
        },
        // 导出
        downloadRecord(){
            let { dept, channel, status , time } = this.downloadForm
            let param = {
                dept, channel, status,
                start: time.length > 0 ? time[0]: '',
                end: time.length > 0 ? time[1]: '',
            }
            this.getlogsExport(param).then(res => {
                if(res.success) {
                    showMessage('导出模板成功')
                }
            })
        },
        downloadDialogClose(){// 导出弹框关闭
            this.downloadShow = false, 
            this.downloadForm = this.$options.data().downloadForm
        },
        // 保存步骤
        async nodeadd() {
            this.$refs.rulenode.validate(async valid => {
                if (!valid) {
                    return false;
                }
                // console.log('this.$refs.TableUser.selection',this.$refs.TableUser.selection)
                let _i = this.$refs.TableUser.selection
                let _org = this.$refs.orgTree.getCheckedNodes()[0];
                let _node = this.node;
                let _nodes = {
                    // id:_node.id,
                    // flow:_node.flow,
                    name:_node.name,
                    reviewerName:null,
                    reviewer:null,
                    reviewerOrgName:null,
                    reviewerOrg: _node.reviewerOrg,
                    type:1
                }
                if (_node.type == 1 || _node.type == "人员") {
                    if (!_i.length) {
                        return this.$message.error("请选择右侧审核人");
                    } else {
                        let  names = [], accounts = [];
                        _i.forEach(item => {
                            names.push(item.name)
                            accounts.push(item.account)
                        })
                        console.log('accounts:', accounts)
                        console.log('names:', names)
                        _nodes.reviewerName = names.join(',');
                        _nodes.reviewer = accounts.join(',');
                        _nodes.type = 1;
                    }
                } else {
                    if (_org) {
                        _nodes.reviewerOrgName = _org.shortName;
                        _nodes.reviewerOrg = _org.id;
                        _nodes.type = 2;
                    } else {
                        return this.$message.error("请选择左侧组织");
                    }
                }
                // if(this.modIndex == null){
                //     // 新增
                //     this.proSave.nodeList.push(_nodes)
                // }else{
                //     // 修改
                //     this.proSave.nodeList.splice(this.modIndex,1,_nodes)
                // }
                
                this.proSave.nodeList[this.modIndex].name =_node.name
                if(this.changeType == 0) { // 主审修改
                    this.proSave.nodeList[this.modIndex].master = _nodes
                } else {  // 候审修改
                    this.proSave.nodeList[this.modIndex].slave = _nodes
                } 
                this.nodeVisible = false;
                this.modIndex = null
                this.changeType = null
            });
        },
        // 修改节点
        modifynode(row, type) {
            // console.log('row111',row)
            this.changeType = type
            this.modIndex = row.$index
            let data1 = row.row.master
            let data2 = row.row.slave
            if(type== 0){ // 0:主审修改 1候审修改
                this.node = { ...data1, shtype: 0 };
                // this.node.type = data1.type == 1 ? '人员' : '组织'
            }else {
                this.node = { ...data2, shtype: 1 };
                // this.node.type = data2.type == 1 ? '人员' : '组织'
            }
            this.gitusers();
            // this.modIndex = row.$index
            // this.node = { ...row.row };
            // if (row.row.type === 1) {
            //     this.node.type = "人员";
            // } else {
            //     this.node.type = "组织";

            // }
            // this.gitusers();
        },
        // 删除节点
        romenode(item,type) {
            if(type == 0) {
                this.proSave.nodeList.splice(item.$index, 1);
            }
            if(type == 1) {
                this.proSave.nodeList[item.$index].slave = {}
            }
            console.log('删除1',this.proSave.nodeList)
            // let i = 0;
            // this.proSave.nodeList.forEach(ele => {
            //     if (
            //         ele.flow == v.flow &&
            //         ele.id == v.id &&
            //         ele.name == v.name &&
            //         ele.reviewer == v.reviewer &&
            //         ele.reviewerName == v.reviewerName &&
            //         ele.reviewerOrg == v.reviewerOrg &&
            //         ele.reviewerOrgName == v.reviewerOrgName &&
            //         ele.type == v.type
            //     ) {
            //         this.proSave.nodeList.splice(i, 1);
            //         return;
            //     }
            //     i++;
            // });
        },
        // 分页limit改变
        handleSizeChange(val) {
            this.limit = val;
            this.seaList();
        },
        // 分页跳转
        handleCurrentChangeuser(val) {
            this.pageuser = val;
            this.getUserName();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.seaList();
        },
        orgClick(data) { // 树节点被点击时的回调
            this.setOrgid = data.id;
            this.getUserName();
        },
        checkclick(data, checked) {
            // let i = this.$refs.orgTree.getCheckedNodes().length;
            // if(i == 2)
            if (checked) {
                console.log(data.id)
                this.setOrgid = data.id;
                this.getUserName();
                this.$refs.orgTree.setCheckedKeys([data.id]);
            }
        },
        handleSelectionChange(val) {
            if (val.length > 0) {
                let revStr = [], revName = [];
                val.forEach(item => {
                    revStr.push(item.account)
                    revName.push(item.name)
                })
                this.node.reviewer = revStr.join(',');
                this.node.reviewerName = revName.join(',')
            }
        },
        userSelect(selection) {
            // if (selection.length > 1) {
            //     let _row = selection.shift();
            //     this.$refs.TableUser.toggleRowSelection(_row, false);
            // }
        },
        selectALL() {
            this.$refs.TableUser.clearSelection();
        }
    }
};
</script>
<style  scoped lang="scss">
.from {
    border-bottom: 1px solid #dfe6ec;
}
.btnAdd {
    margin: 10px;
    display: flex;
    justify-content: space-between;
}
.paganition {
    margin: 20px 50px;
    text-align: right;
}
.btncebter {
    text-align: center;
}
.addTable {
    margin-top: 10px;
    .top_column{
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
    }
    .botm_column{
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
        border-top: 1px solid #ccc;
    }
    /deep/ .el-table .cell {
        padding: 0;
    }
}
.card {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgb(0, 0, 0 / 10%);
}
.card span {
    user-select: none;
    cursor: pointer;
}
.video_tree {
    height: 450px;
    overflow: auto;
}
.orgtree {
    height: 400px;
    overflow: auto;
    user-select: none;
}
</style>
