<template>
    <div class="container">
        <div class="channel-wrapper">
            <plain-channel-list @node-click="_getCurrentNode" />
        </div>
        <div class="channel-detail">
            <div class="btn-group">
                <div>
                    <el-button
                    v-if="site.authString.indexOf('ALL_CHANNEL_ADD')!==-1"
                    :disabled="isShowAdd"
                    size="mini"
                    @click="_operationContextmenu('add')"
                    >
                    新增频道
                    </el-button>
                    <el-button
                    v-if="site.authString.indexOf('ALL_CHANNEL_RECYCLE')!==-1"
                    :disabled="isShowAdd"
                    type="danger"
                    size="mini"
                    @click="_operationContextmenu('recycle')"
                    >
                    频道回收站
                    </el-button>
                </div>
                <div v-if="channelForm.id">
                    <el-button v-if="hasPermission('CHANNEL_UPDATE')" :disabled="isShowMenu" size="mini" @click="_operationContextmenu('edit')">
                    修改频道
                    </el-button>
                    <el-button v-if="hasPermission('CHANNEL_MOVE')" :disabled="isShowHome" size="mini" @click="_operationContextmenu('move')">
                        移动频道
                    </el-button>
                    <el-button v-if="hasPermission('CHANNEL_CLONE')" :disabled="isShowHome" size="mini" @click="_operationContextmenu('copy')">
                        复制频道
                    </el-button>
                    <el-button
                        v-if="hasPermission('CHANNEL_PUBLISH')"
                        :disabled="isShowMenu"
                        size="mini"
                        @click="_operationContextmenu('totalRelease')"
                    >
                        发布
                    </el-button>
                    <!-- <div style="display: inline-block;margin: 0 10px"> -->
                        <el-button 
                            v-if="hasPermission('CHANNEL_PREVIEW')&&VIEW_SHOW" 
                            :disabled="isShowMenu" 
                            size="mini" 
                            @click="_operationContextmenu('preview')"
>
                            预览频道
                        </el-button>
                    <!-- </div> -->
                    <el-button
                        v-if="hasPermission('CHANNEL_DELETE')"
                        :disabled="isShowHome"
                        type="danger"
                        size="mini"
                        @click="_operationContextmenu('delete')"
                    >
                        删除频道
                    </el-button>
                </div>
            </div>
            <el-form v-show="showGet" ref="channelForm" :model="channelForm" :rules="channelFormRules" label-width="120px" :disabled="isShowMenuInfo">
                <el-row>
                    <div style="color:#606266;margin-left: 3%;margin-bottom: 20px; font-size: 16px">
                        基础属性:
                        <el-tag v-if="channelForm.id" size="small">{{ channelForm.id }}</el-tag>
                    </div>
                    <el-col :span="12">
                        <el-form-item label="频道名称" prop="name">
                            <div v-if="!disabled">
                                <el-input v-model="channelForm.name" :disabled="disabled" maxlength="50" show-word-limit clearable></el-input>
                            </div>
                            <div v-else class="show-word-limit">
                                <el-input v-model="channelForm.name" :disabled="disabled" clearable></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="显示名称" prop="viewName">
                            <div v-if="!disabled">
                                <el-input v-model="channelForm.viewName" :disabled="disabled" maxlength="50" show-word-limit clearable></el-input>
                            </div>
                            <div v-else class="show-word-limit">
                                <el-input v-model="channelForm.viewName" :disabled="disabled" clearable></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="code" class="channel-code">
                            <template #label>英文编码 <CodeTips /></template>
                            <div>
                                <el-input v-model="channelForm.code" :disabled="CodeDisabled" maxlength="50" show-word-limit clearable></el-input>
                            </div>
                        </el-form-item>
                        <!-- <el-form-item label="父频道" prop="pName">
                            <el-input v-model="channelForm.pName" disabled clearable></el-input>
                        </el-form-item> -->
                        <el-form-item label="频道路径" prop="urlPart">
                            <el-input v-model="channelForm.urlPart" :disabled="disabled" maxlength="30" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="完整路径" prop="urlMain">
                            <el-input v-model="channelForm.urlMain" :disabled="disabled" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="频道类型" prop="type">
                            <el-select v-model="channelForm.type" placeholder="请选择" class="w100" :disabled="disabled" clearable>
                                <el-option v-for="(item, index) in dictionary.channelType" :key="index" :label="item" :value="+index"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否主页面" prop="pageFlag">
                            <el-select v-model="channelForm.pageFlag" placeholder="请选择" :disabled="disabled" class="w100">   
                                <el-option label="非主页面" :value="0"></el-option>
                                <el-option label="主页面" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="channelForm.type === 3" label="链接类型" prop="linkType">
                            <el-radio-group v-model="channelForm.linkType" :disabled="disabled" clearable>
                                <el-radio :label="1">外链</el-radio>
                                <el-radio :label="2">内链</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="channelForm.type === 3 && channelForm.linkType === 1" label="外部链接" prop="url">
                            <el-input v-model="channelForm.url" :disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item v-if="channelForm.type === 3 && channelForm.linkType === 2" label="内部频道" prop="linkChannelId">
                            <TreeSelect
                                v-model="channelForm.linkChannelId"
                                :disabled="disabled"
                                value-prop="value"
                                text-prop="label"
                                :options="channelOptions"
                            ></TreeSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="概览模版" prop="generalTemplate">
                            <el-select v-model="channelForm.generalTemplate" filterable placeholder="请选择" class="w100" clearable :disabled="disabled">
                                <el-option v-for="item in generalTemplate" :key="item.id" :label="item.name" :value="+item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键词" prop="keyword">
                            <el-input v-model="channelForm.keyword" :disabled="disabled" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="icon图标" prop="icon">
                            <div v-if="!disabled">
                                <el-input v-model="channelForm.icon" :disabled="disabled" maxlength="50" show-word-limit></el-input>
                            </div>
                            <div v-else class="show-word-limit">
                                <el-input v-model="channelForm.icon" :disabled="disabled"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="父频道" prop="pName">
                            <el-input v-model="channelForm.pName" disabled clearable></el-input>
                        </el-form-item>
                        <el-form-item label="允许发布" prop="allow">
                            <el-radio-group v-model="channelForm.allow" :disabled="disabled">
                                <el-radio :label="1">允许</el-radio>
                                <el-radio :label="0">不允许</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="主菜单" prop="menu">
                            <el-radio-group v-model="channelForm.menu" :disabled="disabled">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序位置">
                            <el-radio v-model="radio" :disabled="disabled" label="null" @change="_selectRadio('null')">原始位置</el-radio>
                            <el-radio v-if="originalPosition" v-model="radio" :disabled="disabled" label="top" @change="_selectRadio('top')">置顶
                            </el-radio>
                            <el-radio v-if="originalPosition" v-model="radio" :disabled="disabled" label="bottom" @change="_selectRadio('bottom')">置底
                            </el-radio>
                            <div v-if="isShowOther">
                                <el-radio v-if="originalPosition" v-model="radio" :disabled="disabled" label="other" @change="_selectRadio('other')">
                                    某一频道之前
                                </el-radio>
                                <el-select v-if="isShowOver" v-model="channelForm.sortId" :disabled="disabled" clearable prop="sortId">
                                    <el-option v-for="(text, key) in clickNodeData" :key="key" :label="text" :value="Number(key)"> </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <div style="color:#606266;margin-left: 3%;margin-bottom: 20px; font-size: 16px">文章设置:</div>
                        <el-col :span="12">
                            <el-form-item label="细览模版" prop="detailTemplate">
                                <el-select v-model="channelForm.detailTemplate" placeholder="请选择" class="w100" clearable :disabled="disabled">
                                    <el-option v-for="item in detailTemplate" :key="item.id" :label="item.name" :value="+item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="文章打开方式" prop="open">
                                <el-radio-group v-model="channelForm.open" :disabled="disabled">
                                    <el-radio v-for="(item, key) in dictionary.linkTarget" :key="key" :label="key">{{ item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="articlePage">
                                <template #label>文章分页量
                                    <el-tooltip class="item" effect="dark" content="分页量：最小1，最大10000，默认10。" placement="top-start">
                                        <i class="el-icon-warning"></i>
                                    </el-tooltip>
                                </template>
                                <div>
                                    <el-input-number v-model="channelForm.articlePage" :min="1" :max="10000" :disabled="disabled"></el-input-number>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="默认分享频道" prop="orderBy">
                                <el-row>
                                    <el-col>
                                        <div class="shareTreeBox">
                                            <div v-for="(item, index) in shareArr" :key="index" class="shareList">
                                                <span v-if="item.appName" style="color: #606266;">{{ item.appName + "-" + item.name }}</span>
                                                <span v-else style="color: #606266;">{{ item.name }}</span>
                                                <img v-if="!disabled" src="../images/close.png" class="removeIcon" @click="removeShare(index)" />
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-button type="mini" :disabled="disabled" @click="openshareDialog">编辑</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="channelForm.orderByLabel" :span="12">
                            <el-form-item label="文章排序" prop="orderByLabel">
                                <!-- 去掉原本的文章排序设置功能，移到文章管理页面 -->
                                <el-tag type="info" effect="plain"> {{ channelForm.orderByLabel }} </el-tag>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col class="FormSettings">
                        <div style="color:#606266;margin-left: 3%;margin-bottom: 20px; font-size: 16px">表单设置:</div>
                        <el-button style="margin:0 0 5px 120px" type="mini" :disabled="disabled" @click="FormSettingsAdd">新增</el-button>
                        <el-table :data="formListData" border style="width:90%;margin-left:120px;">
                            <el-table-column type="index" label="序号" width="100" />
                            <el-table-column prop="name" label="表单">
                                <template slot-scope="scope">
                                    <span v-show="scope.row.show" class="portant">*</span>
                                    <el-select v-show="scope.row.show" v-model="scope.row.formName" :disabled="!scope.row.select" @change="selectOpt">
                                        <el-option
                                            v-for="item in FromListOption"
                                            :key="item.formId"
                                            :disabled="item.option"
                                            :value="item.alias"
                                        ></el-option>
                                    </el-select>
                                    <span v-show="!scope.row.show">{{ scope.row.formName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="新名称">
                                <template slot-scope="scope">
                                    <span v-show="scope.row.show" class="portant">*</span>
                                    <el-input
                                        v-show="scope.row.show"
                                        v-model="scope.row.showName"
                                        placeholder="请输入新名称"
                                        maxlength="10"
                                    ></el-input>
                                    <span v-show="!scope.row.show">{{ scope.row.showName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="标签名称">
                                <template slot-scope="scope">
                                    <span v-show="scope.row.show" class="portant">*</span>
                                    <el-input
                                        v-show="scope.row.show"
                                        v-model="scope.row.mark"
                                        :disabled="!scope.row.select"
                                        placeholder="请输入标签名称"
                                        maxlength="10"
                                    ></el-input>
                                    <span v-show="!scope.row.show">{{ scope.row.mark }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="标签限制">
                                <template slot-scope="scope">
                                    <el-input
                                        v-show="scope.row.show"
                                        v-model="scope.row.keyword"
                                        placeholder="请输入标签限制(, 分割)"
                                        maxlength="200"
                                    ></el-input>
                                    <span v-show="!scope.row.show">{{ scope.row.keyword }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="主表单">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.master"
                                        :disabled="disabled" @change="_master(scope.$index,scope.row.master)"
                                    ></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button v-if="!scope.row.show" :disabled="disabled" size="mini" @click="scope.row.show = true">修改</el-button>
                                    <el-button v-else size="mini" @click="FormModify(scope.$index, scope.row)">确认</el-button>
                                    <el-button size="mini" :disabled="disabled" type="danger" @click="FormDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col>
                        <div style="color:#606266;margin-left: 3%;margin-bottom: 20px; font-size: 16px">扩展属性:</div>
                        <el-col :span="12">
                            <el-form-item label="备用字段1" prop="bak01">
                                <div v-if="!disabled">
                                    <el-input v-model="channelForm.bak01" :disabled="disabled" maxlength="50" show-word-limit></el-input>
                                </div>
                                <div v-else class="show-word-limit">
                                    <el-input v-model="channelForm.bak01" :disabled="disabled"></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备用字段2" prop="bak02">
                                <div v-if="!disabled">
                                    <el-input v-model="channelForm.bak02" :disabled="disabled" maxlength="50" show-word-limit></el-input>
                                </div>
                                <div v-else class="show-word-limit">
                                    <el-input v-model="channelForm.bak02" :disabled="disabled"></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备用字段3" prop="bak03">
                                <div v-if="!disabled">
                                    <el-input v-model="channelForm.bak03" :disabled="disabled" maxlength="50" show-word-limit></el-input>
                                </div>
                                <div v-else class="show-word-limit">
                                    <el-input v-model="channelForm.bak03" :disabled="disabled"></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备用字段4" prop="bak04">
                                <div v-if="!disabled">
                                    <el-input v-model="channelForm.bak04" :disabled="disabled" maxlength="50" show-word-limit></el-input>
                                </div>
                                <div v-else class="show-word-limit">
                                    <el-input v-model="channelForm.bak04" :disabled="disabled"></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备用字段5" prop="bak05">
                                <div v-if="!disabled">
                                    <el-input v-model="channelForm.bak05" :disabled="disabled" maxlength="50" show-word-limit></el-input>
                                </div>
                                <div v-else class="show-word-limit">
                                    <el-input v-model="channelForm.bak05" :disabled="disabled"></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-form-item v-if="showSave">
                    <el-button type="primary" :disabled="disabled" @click="_submitForm">保存</el-button>
                    <el-button @click="_resetForm">{{ showClose }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <tree-select-channel v-model="isShowTreeList" :self="currentMoveId" @on-change="_getCopyParentId" />
        <!-- 发布 -->
        <PublishModal v-bind="publish" :channel-id="channelId" @closePublishModal="closePublishModal" />

        <el-dialog title="分享频道" :visible.sync="sharedialog" :before-close="sharedialogClose">
            <el-form :model="form">
                <el-form-item label="站点" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择站点" @change="changeSite">
                        <el-option v-for="(site, index) in siteOptions" :key="index" :label="site.label" :value="site.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="频道" :label-width="formLabelWidth">
                    <el-tree
                        ref="tree"
                        :data="linkChannelList"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="checkedkey"
                        :default-checked-keys="[checkedkey]"
                        :props="defaultProps"
                        default-expand-all
                        is-select-self
                        check-strictly
                        @check-change="getname"
                    >
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitcrossShare">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="选择预览设备"
            :visible.sync="previewShow"
            width="30%"
            :before-close="checkPreviewClose"
        >
            <div class="device_box">
                <ul class="device_list">
                    <li 
                        v-for="item in previewList"
                        :key="item.key" @click="currActive = item.key"
                        :class="['list_item',{'actives':currActive==item.key}]"
                    >
                        <div :class="['hzicon', item.icon]"></div>
                        <p class="txt">{{item.name}}</p>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="checkPreviewClose">取 消</el-button>
                <el-button type="primary" @click="commonPrev" style="margin-left:10px">确 定</el-button>
            </div>
        </el-dialog>
    <mobileMoadel :mobileVisible="ylShow" :mediaType="currActive" :url="ylUrl" @closed="moboelClosed"></mobileMoadel>
    
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { showLoading, showMessage, confirm } from "@/utils";
import { matchTemplateUrl, matchExtraCode, matchEmoji, matchName, pathUrl, pathUrlMain } from "@/utils/RegExpUtil";
import { previewChannel, previewMobileChannel } from "../../preview";
import PlainChannelList from "../components/PlainChannelList";
import TreeSelectChannel from "../components/TreeSelectChannel";
import siteMixin from "../../cmsmixins/siteMixin";
import CodeTips from "@/components/CodeTips";
import { isEmpty } from "@/utils/BaseUtil";
import PublishModal from "./publish";
// import TreeSite from '../../channel/components/TreeSite.vue'
import { deepCopy } from "@/utils/BaseUtil";
import mobileMoadel from "../../article/articleList/mobileModel/mobileModel.vue"
export default {
    name: "ChannelList",
    components: {
        PlainChannelList,
        TreeSelectChannel,
        CodeTips,
        PublishModal,
        mobileMoadel
        // TreeSite
    },
    mixins: [siteMixin],
    data() {
        return {
            CodeDisabled:true,
            publish: {
                visible: false
            },
            linkChannelList: [],
            auditSelect: [],
            showSave: false,
            defaultProps: {
                children: "children",
                label: "name"
            },
            copyDialogTitle: "复制频道",
            VIEW_SHOW:false,
            isShowTreeList: false,
            currentMoveId: null,
            sharedialog: false,
            orderBy: {
                condition1: {
                    value: "",
                    list: [
                        { key: "id", name: "ID" },
                        { key: "title", name: "标题" },
                        { key: "createTime", name: "创建时间" },
                        { key: "upateTime", name: "更新时间" },
                        { key: "showTime", name: "显示时间" },
                        { key: "bak01", name: "备用字段01" },
                        { key: "sort", name: "自定义" }
                    ]
                },
                condition2: {
                    value: "",
                    list: [
                        { key: "asc", name: "升序" },
                        { key: "desc", name: "降序" }
                    ]
                }
            },
            contextmenuType: "",
            currentSelectedNode: {},
            currentSelectedData: {},
            checkedkey: [],
            channelForm: {
                name: "",
                urlPart:"",
                urlMain:"",
                pageFlag: 0,
                viewName: "",
                code: "",
                pid: "",
                pName: "",
                keyword: "",
                type: 1,
                generalTemplate: "",
                detailTemplate: "",
                allow: 0,
                open: "_self",
                orderBy: "",
                orderByLabel: "显示时间降序",
                url: "",
                releaseType: 1,
                flowId: "",
                icon: "",
                menu: 0,
                linkChannelId: "",
                linkType: 1,
                bak01: "",
                bak02: "",
                bak03: "",
                bak04: "",
                bak05: "",
                sortId: "",
                articlePage: 10,
                defShareList: [],
                formList: []
            },
            channelId: null,
            selectOrg: {
                orgsid: []
            },
            channelFormRules: {
                name: [
                    { required: true, message: "请输入频道名称", trigger: "blur" },
                    {
                        validator(rule, value, callback) {
                            if (!matchName(value)) {
                                callback("频道名称只能是中文、数字、字母、下划线、横线、两边不能有横线");
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }
                ],
                code: [
                    {
                        validator: (rule, value, callback) => {
                            return value && !matchExtraCode(value)
                                ? callback("只允许输入数字、字母、特殊字符(:-_),特殊字符不能连续且只能出现一种")
                                : callback();
                        },
                        trigger: "blur"
                    }
                ],
                viewName: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                keyword: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                urlPart:[{
                    validator: function (rule, value, callback) {
                        if (value && !pathUrl(value)) {
                            callback('路径以数字字母开头,允许数字字母下划线点-@#')
                        } else {
                            callback()
                        }
                    }
                }],
                urlMain:[{
                    validator: function (rule, value, callback) {
                        if (value && !pathUrlMain(value)) {
                            callback('路径以/开头,允许数字字母下划线点-@#')
                        } else {
                            callback()
                        }
                    }
                }],
                icon: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                articlePage: [
                    { required: true, message: "分页量不能为空", trigger: "blur" },
                    {
                        validator(rule, value, cb) {
                            return value && !/^[0-9]+$/.test(value) ? cb("只能输入数字") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                bak01: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                bak02: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                bak03: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                bak04: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                bak05: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb("不能输入非法字符") : cb();
                        },
                        trigger: "blur"
                    }
                ],
                // pName: [
                //     { required: true, message: '父频道不能为空', trigger: 'blur' }
                // ],
                allow: [{ required: true, message: "请选择是否发布", trigger: "blur" }],
                menu: [{ required: true, message: "请选择主菜单方式", trigger: "blur" }],
                type: [{ required: true, message: "请选择频道类型", trigger: "blur" }],
                open: [{ required: true, message: "请选择频道打开方式", trigger: "blur" }],
                sort: [
                    {
                        validator: (rule, value, callback) => {
                            return value && !/^\d+$/.test(value) ? callback(new Error("只能输入数字")) : callback();
                        },
                        trigger: "blur"
                    }
                ],
                url: [
                    { required: true, message: "跳转链接不能为空", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            if(value.indexOf('/preview/')!=-1){
                                callback()
                            }
                            return !matchTemplateUrl(value) ? callback(new Error("输入的链接格式不正确")) : callback();
                        },
                        trigger: "change"
                    }
                ],
                linkChannelId: [{ required: true, message: "内部频道不能为空", trigger: "change" }]
            },
            permissions: [],
            disabled: false,
            radio: "null",
            isShowOver: false,
            clickNodeData: {},
            clickArrId: [],
            originalPosition: true,
            isShowOther: true,
            isShowMenu: true,
            isShowMenuInfo: true,
            isShowHome: true,
            isShowAdd: true,
            currentClickId: "",
            appid: "",
            showPermission: false,
            showClose: "重置",
            showGet: false,
            form: {
                region: ""
            },
            formLabelWidth: "120px",
            Sharename: "",
            shareArr: [],
            appName: "",
            formListData: [],
            FromListOption: [],

            previewShow: false,
            previewList: [
                {name:'手机', key: 'mobile', icon:'icon_phone'},
                {name:'平板', key: 'pad', icon: 'icon_iPad'},
                {name:'电脑', key: 'pc', icon: 'icon_pc'},
            ],
            currActive: 'pc',
            ylShow: false,
            ylUrl: '',
            isProduct: false,
        };
    },
    computed: {
        ...mapState("authen", ["userinfo"]),
        ...mapState("cms/channel/channelList", ["channelList", "auditList"]),
        ...mapGetters("authen", ["getDictionary"]),
        ...mapGetters("cms/template", ["getTemplateById"]),
        ...mapGetters("cms/site", {
            sites: "normalizeSites",
            site: "site"
        }),
        dictionary() {
            return this.getDictionary(["channelType", "linkTarget", "publishType"]);
        },
        generalTemplate() {
            return this.getTemplateById([3, 5]);
        },
        detailTemplate() {
            return this.getTemplateById(4);
        },
        channelOptions() {
            let channels = deepCopy(this.channelList || []);
            const simpleSite = _channels => {
                return _channels.map(channel => {
                    const _channel = { value: channel.id, label: channel.name };
                    if (channel.children && channel.children.length) {
                        _channel.children = simpleSite(channel.children);
                    }
                    return _channel;
                });
            };
            return simpleSite(channels);
        },
        siteOptions() {
            const sites = this.sites;
            const options = [];
            sites.forEach(site => {
                options.push({ label: site.name, value: site.id });
            });
            return options;
        }
    },
    watch: {
        "channelForm.linkChannelId": function(v) {
            if (v === this.currentClickId) {
                showMessage({
                    type: "warning",
                    message: "内链频道不能是自己"
                });
            }
        },
        "channelForm.linkType": function(v) {
            if (v === 1) {
                // if (this.$refs.channelForm) this.$refs.channelForm.resetFields()
                this.channelForm.linkChannelId = "";
            } else {
                // if (this.$refs.channelForm) this.$refs.channelForm.resetFields()
                this.channelForm.url = "";
            }
        }
    },
    created() {
        this.loadSites();
        this.init();
        // this.processAudit()
    },
    mounted() {},
    methods: {
        ...mapActions("cms/channel/channelList", [
            "getChannelList",
            "addChannel",
            "releaseChannel",
            "deleteChannel",
            "copyChannel",
            "moveChannel",
            "getChannel",
            "getFromList"
            // '_auditProcess'
        ]),
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("cms/template", ["getAllTemplateList"]),
        openshareDialog() {
            if (this.channelForm.defShareList.length >= 3) {
                showMessage({
                    type: "warning",
                    message: "默认分享频道不超过3个"
                });
            } else {
                this.sharedialog = true;
            }
        },
        //关闭弹框
        sharedialogClose() {
            this.linkChannelList = [];
            this.form.region = "";
            this.selectOrg.orgsid = [];
            this.sharedialog = false;
            this.Sharename = "";
            this.appName = "";
        },
        changeSite() {
            this.getChannel({ appid: this.form.region })
                .then(data => {
                    this.linkChannelList = data.data;
                    this.selectOrg.orgsid = [];
                    showLoading(false);
                })
                .catch(errpr => {
                    showLoading(false);
                });
        },
        getname(data, checked) {
            for (var i = 0; i < this.siteOptions.length; i++) {
                if (this.siteOptions[i].value == data.appid) {
                    this.appName = data.appName;
                    // this.Sharename = this.siteOptions[i].label+'-'+data.name
                    this.Sharename = data.name;
                }
            }
            // if(checked){
            //     this.appid = data.appid
            //     this.channelId = data.id
            //     this.$refs.tree.setCheckedNodes([data]);
            // }
            this.channelId = data.id;
            // const node = this.$refs.tree.getNode(data.id)
            // this.setNode(node)
            var j = this.$refs.tree.getCheckedNodes().length;
            if (j == 2) {
                this.$refs.tree.setCheckedKeys([data.id]);
            }
        },
        submitcrossShare() {
            var objdata = {
                id: "",
                name: ""
            };
            objdata.id = this.channelId;
            objdata.name = this.Sharename;
            objdata.appName = this.appName;
            this.shareArr.unshift(objdata);
            this.sharedialog = false;
            this.linkChannelList = [];
            this.form.region = "";
            this.selectOrg.orgsid = [];
            this.channelForm.defShareList = this.shareArr;
        },
        removeShare(index) {
            this.shareArr.splice(index, 1);
            this.channelForm.defShareList = this.shareArr;
        },
        init() {
            // 初始化频道数据
            showLoading(true, "频道数据加载中...");
            this.getChannelList()
                .then(data => {
                    this.linkChannelList = data[0].children;
                    // this.channelOptions
                    showLoading(false);
                })
                .catch(errpr => {
                    showLoading(false);
                });
            // 获取模版列表
            this.getAllTemplateList();
        },

        // processAudit () {
        //     showLoading(true, '频道数据加载中...')
        //     this._auditProcess().then(() => {
        //         this.auditSelect = this.auditList
        //         showLoading(false)
        //     })
        // },

        reloadWhenSiteChange() {
            this.init();
        },
        // 判断是否有按钮操作权限,并且不是管理员
        hasPermission(permission) {
            return (this.permissions || []).indexOf(permission) !== -1;
        },

        // 获取当前节点点击的数据
        _getCurrentNode(data, node) {
            if(!data.id&&data.name==='频道'){
                this._resetForm()
                this.isShowMenu = true;
                this.isShowMenuInfo = true;
                this.isShowAdd = false;
                this.isShowHome = true;
                return
            }
            if (this.$refs.channelForm) this.$refs.channelForm.resetFields();
            this.showGet = true;
            this.shareArr = data.defShareList.slice();
            this.permissions = data.permissions
            this.channelId = data.id;
            this.radio = "null";
            this.channelForm.sortId = "";
            this.isShowOver = false;
            this.showSave = false;
            this.showPermission = true;
            this.appid = data.appid;
            this.isShowMenu = false;
            this.isShowAdd = false;
            data.isHomePage ? (this.isShowHome = true) : (this.isShowHome = false);
            this.currentClickId = data.id;
            let condition = {};
            let conditionId = {};
            let arr = [];
            let newChildNodes = node.parent.childNodes.filter(item => item.data.id != data.id);
            newChildNodes.map(item => {
                condition[item.data.id] = item.data.name;
            });
            this.clickNodeData = condition;
            if (isEmpty(this.clickNodeData)) {
                this.isShowOther = false;
            } else {
                this.isShowOther = true;
            }
            this.currentSelectedData = data;
            this.currentSelectedNode = node;
            this._operationContextmenu("view");
            node.parent.childNodes.map(item => {
                conditionId[item.data.id] = item.data.name;
            });
            Object.keys(conditionId).forEach(function(key, i, v) {
                arr = v;
            });
            this.clickArrId = arr;
            this.formListData = [];
            this.channelForm.formList.forEach(ele => {
                this.formListData.push({ ...ele, show: false, select: false });
            });
            // 获取表单设置下拉项
            this.getFromList({ flag: 1 })
                .then(data => {
                    this.FromListOption = data.data;
                    this.selectOpt();
                })
                .catch(errpr => {
                    showLoading(false);
                });
            if(!this.channelForm.generalTemplate){
                this.VIEW_SHOW = false
            }else{
                this.VIEW_SHOW = true
            }
        },

        // 菜单操作功能
        _operationContextmenu(type) {
            this.contextmenuType = type;
            // reset this id
            this.currentMoveId = null;
            /* eslint-disable */
            switch (type) {
                case "add":
                    this.showGet = true
                    this._resetForm({ pid: this.currentSelectedData.id, pName: this.currentSelectedData.name });
                    /* this.channelForm.pid = this.currentSelectedData.id
                    this.channelForm.pName = this.currentSelectedData.name */
                    this.formListData = []
                    this.showSave = true;
                    this.disabled = false;
                    this.CodeDisabled = false;
                    this.isShowMenu = true;
                    this.isShowHome = true;
                    this.isShowMenuInfo = false;
                    this.originalPosition = false;
                    this.orderBy.condition1.value = "showTime";
                    this.orderBy.condition2.value = "desc";
                    this.showClose = "清空";

                    break;
                case "view":
                    this.isShowMenuInfo = false;
                    this.channelForm.pid = this.currentSelectedNode.parent.data.id;
                    this.channelForm.pName = this.currentSelectedNode.parent.data.name;
                    this.disabled = true;
                    this.CodeDisabled = true;
                    this.originalPosition = true;
                    for (let [key, value] of Object.entries(this.currentSelectedData)) {
                        this.channelForm[key] = value;
                    }
                    if (!this.currentSelectedData.orderBy) {
                        return;
                    }
                    let orderBy = this.currentSelectedData.orderBy.replace(",", "").split(" ");
                    this.orderBy.condition1.value = orderBy[0] || "showTime";
                    this.orderBy.condition2.value = orderBy[1] || "desc";

                    break;
                case "edit":
                    if (isEmpty(this.currentSelectedNode)) {
                        showMessage({
                            type: "warning",
                            message: "请至少选择一个要修改的频道"
                        });
                        return;
                    }
                    this.showSave = true;
                    this.isShowHome = true;
                    this.channelForm.pid = this.currentSelectedNode.parent.data.id;
                    this.channelForm.pName = this.currentSelectedNode.parent.data.name;
                    this.disabled = false;
                    this.originalPosition = true;
                    for (let [key, value] of Object.entries(this.currentSelectedData)) {
                        this.channelForm[key] = value;
                    }
                    if (!this.currentSelectedData.orderBy) {
                        return;
                    }
                    if(!this.channelForm.code){
                        this.CodeDisabled = false
                    }else{
                        this.CodeDisabled = true
                    }
                    orderBy = this.currentSelectedData.orderBy.replace(",", "").split(" ");
                    this.orderBy.condition1.value = orderBy[0] || "创建时间";
                    this.orderBy.condition2.value = orderBy[1] || "倒序";
                    this.showClose = "重置";
                    break;
                case "totalRelease":
                    this.publish.visible = true;
                    // this.channelForm.releaseType = 1
                    // this.releaseChannel({ id: this.currentSelectedData.id,type:1 }).then(res => showMessage('发布成功！'))
                    break;
                // case 'incrementalRelease':
                //     this.channelForm.releaseType = 2
                //     this.releaseChannel({ id: this.currentSelectedData.id,type:2 }).then(res => showMessage('发布成功！'))
                //     break
                case "delete":
                    confirm("删除频道将一并删除频道下子频道和文章", "警告", {
                        ok: () => {
                            showLoading(true, "正在删除频道...");
                            this.deleteChannel({ id: this.currentSelectedData.id }).then(res => {
                                showLoading(false);
                                showMessage("删除成功！");
                                this.isShowMenu = true;
                                this.isShowMenuInfo = true;
                                this.isShowHome = true;
                                this.getChannelList();
                                this._resetForm();
                            });
                        }
                    });
                    break;
                case "copy":
                    this.copyDialogTitle = "复制频道";
                    this.isShowTreeList = true;
                    break;
                case "move":
                    this.copyDialogTitle = "移动频道";
                    this.isShowTreeList = true;
                    this.currentMoveId = this.currentSelectedData.id;
                    break;
                case "preview":
                    this.previewShow = true
                    // previewChannel(this.currentSelectedData.id);
                    break;
                case "recycle":
                    this.$router.push({ name: "channelRecycle" });
                    break;
                case "todata":
                    this.$router.push({
                        path: "/system/authority",
                        query: { channelId: this.currentClickId, channelTag: "channel", appid: this.appid }
                    });
            }
            /* eslint-disable */
        },

        // 选择预览设备关闭
        checkPreviewClose(){
            this.previewShow = false
            this.currActive = 'pc'
        },
        moboelClosed(){
            this.ylShow = false
            this.currActive = 'pc'
        },
        commonPrev() {
            this.previewShow = false
            // 如果选择的是预览pc端， 走原来的逻辑
            if(this.currActive == 'pc') {
                previewChannel(this.currentSelectedData.id);
            } else {
                previewMobileChannel(this.currentSelectedData.id).then(res => {
                    console.log('mobile',res)
                    if(res.link) {
                        this.ylUrl = res.link
                        this.ylShow = true
                    }
                })
                
            }
        },
        // 获取复制、移动频道的父id
        _getCopyParentId(pid) {
            showLoading(true, `${this.copyDialogTitle}中...`);
            this[`${this.contextmenuType}Channel`]({ pid, id: this.currentSelectedData.id }).then(res => {
                showLoading(false);
                showMessage(`${this.copyDialogTitle}成功！`);
                this.isShowTreeList = false;
                this.getChannelList();
            });
        },

        closePublishModal(needReload) {
            this.publish.visible = false;
            needReload && this.reloadSites();
        },
        // 保存频道信息
        _submitForm() {
            this.formListData.forEach(ele => {
                if (ele.show) {
                    this.$message({
                        message: "请保存表单设置列表",
                        type: "warning"
                    });
                     throw new Error('请保存表单设置列表！')
                }
            });
            if ((this.channelForm.flowPublish || this.channelForm.flowRevoke || this.channelForm.flowDelete) && !this.channelForm.flowId) {
                this.$confirm("如若选择审核操作，必须选择审核流程", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    closeOnClickModal: false
                })
                    .then(() => {
                        this.$message({
                            message: "请选择审核流程",
                            type: "warning"
                        });
                    })
                    .catch(() => {});
            } else {
                if (!this.channelForm.flowPublish && !this.channelForm.flowRevoke && !this.channelForm.flowDelete && this.channelForm.flowId) {
                    this.$confirm("审核操作至少需要选择一个", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                        closeOnClickModal: false
                    })
                        .then(() => {
                            this.$message({
                                message: "请至少选择一个审核操作",
                                type: "warning"
                            });
                        })
                        .catch(() => {});
                } else if(this.channelForm.pageFlag == 1 && !this.channelForm.urlMain) {
                    this.$message({
                        message: "主页面完整路径为必填!",
                        type: "warning"
                    });
                } else {
                    this.$refs.channelForm.validate(valid => {
                        if (!valid) {
                            return false;
                        }
                        showLoading(true, "保存中...");
                        const order1 = this.orderBy.condition1.value;
                        const order2 = this.orderBy.condition2.value;
                        let orderBy = order1 && order2 ? `,${order1} ${order2}` : "";
                        this.channelForm.children = [];
                        this.channelForm.channelPermissions = [];
                        this.channelForm.articlePermissions = [];
                        this.channelForm.formList = this.formListData;
                        this.addChannel(
                            {
                                ...this.channelForm,
                                orderBy
                            },
                            { headers: { "Content-Type": "application/json;utf-8" } }
                        )
                            .then(data => {
                                showLoading(false);
                                if(!data.success) {
                                    console.log(data)
                                    return showMessage({
                                        type: "error",
                                        message: data.errMsg
                                    });
                                }
                                showMessage("保存成功");
                                this.getChannelList();
                                this.isShowMenu = true;
                                this.isShowMenuInfo = true;
                                this.isShowHome = true;
                                this.radio = "null";
                                this._resetForm();
                            })
                            .catch(error => {
                                showLoading(false);
                            });
                    });
                }
            }
        },

        // 重置表单
        _resetForm({ pid, pName } = {}) {
            this.$refs.channelForm.resetFields();
            this.orderBy.condition1.value = "";
            this.orderBy.condition2.value = "";
            this.currentSelectedData = {};
            this.currentSelectedNode = {};
            this.permissions = []
            this.channelForm = {
                name: "",
                urlPart: "",
                urlMain: "",
                pageFlag: 0,
                viewName: "",
                code: "",
                pid,
                pName,
                keyword: "",
                type: 1,
                generalTemplate: "",
                detailTemplate: "",
                allow: 0,
                open: "_self",
                sort: "",
                orderBy: "",
                url: "",
                releaseType: 1,
                menu: 0,
                icon: "",
                sortId: "",
                articlePage: 10,
                linkType: 1,
                linkChannelId: "",
                bak01: "",
                bak02: "",
                bak03: "",
                bak04: "",
                bak05: "",
                defShareList: []
            };
        },
        // 点击单选框发生的事件
        _selectRadio(type) {
            this.radio = type;
            switch (type) {
                case "null":
                    (this.channelForm.sortId = null), (this.channelForm.sortFlag = "null");
                    this.isShowOver = false;
                    break;
                case "other":
                    this.isShowOver = true;
                    this.channelForm.sortFlag = "other";
                    break;
                case "top":
                    (this.channelForm.sortId = Math.min.apply(null, this.clickArrId)), (this.channelForm.sortFlag = "top");
                    this.isShowOver = false;
                    break;
                case "bottom":
                    (this.channelForm.sortId = Math.max.apply(null, this.clickArrId)), (this.channelForm.sortFlag = "bottom");
                    this.isShowOver = false;
                    break;
            }
        },
        // 表单设置
        FormSettingsAdd() {
            this.formListData.push({
                channelId: this.channelForm.id,
                formId: 0,
                formName: "",
                id: 0,
                keyword: null,
                mark: "",
                show: true,
                showName: "",
                select: true
            });
        },
        // 主表单设置
        _master(i,v){
            this.formListData.forEach(ele=>{
                ele.master = false
            })
            this.formListData[i].master = v
        },
        FormModify(i, v) {
            var _name = /^[\u4e00-\u9fa5]+$/;
            var _mark = /^[0-9a-zA-Z]+$/;
            if (!v.formName) {
                this.$message({
                    message: "请选择表单",
                    type: "warning"
                });
                return;
            }
            if (v.showName.trim() == "") {
                this.$message({
                    message: "请输入新名称",
                    type: "warning"
                });
                return;
            }
            if (!_name.test(v.showName)) {
                this.$message({
                    message: "新名称必须为汉字",
                    type: "warning"
                });
                return;
            }
            if (v.mark.trim() == "") {
                this.$message({
                    message: "请输入标签名称",
                    type: "warning"
                });
                return;
            }
            if (!_mark.test(v.mark)) {
                this.$message({
                    message: "标签只允许输入英文及数字",
                    type: "warning"
                });
                return;
            }
            this.FromListOption.forEach(ele => {
                if (ele.alias == v.formName) {
                    v.formId = ele.id;
                }
            });
            this.formListData[i].show = false;
            this.formListData[i].select = false;
        },
        selectOpt() {
            this.FromListOption.forEach(item => {
                item.option = false;
            });
            this.formListData.forEach(ele => {
                this.FromListOption.forEach(item => {
                    if (item.alias == ele.formName) {
                        item.option = true;
                    }
                });
            });
        },
        FormDel(i) {
            this.formListData.splice(i, 1);
            this.selectOpt();
        }
    }
};
</script>
<style lang="scss" scoped>
.FormSettings {
    /deep/.el-table th > .cell {
        text-align: center;
    }

    /deep/.el-table .cell {
        text-align: center;
    }
}
.top {
    text-align: center;
}
.item {
    margin: 4px;
}
$padding: 10px;
.cke_screen_reader_only {
    display: none !important;
}
.container {
    display: flex;
    height: 100%;

    .channel-wrapper {
        width: 20%;
        max-width: 300px;
        overflow-y: auto;
    }
    .channel-detail {
        flex: 1;
        padding: 0 15px;
        overflow-x: hidden;
        border-left: 1px solid $border-color;
    }

    .btn-group {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid $border-color;
        >div{
            display: inline-block;
            margin-right: 10px;
        }
    }
}
.show-word-limit {
    /deep/ .el-input__inner {
        padding-right: 15px;
    }
}
/deep/ .el-tree-node > .el-tree-node__children {
    overflow: visible;
}
/deep/ .el-form-item__error {
    position: relative;
}
/deep/ .el-form-item.is-error {
    margin-bottom: 5px;
}

.shareList {
    width: 100%;
    display: flex;
    align-items: center;
}
.removeIcon {
    width: 17px;
    height: 17px;
    margin-left: 15px;
    cursor: pointer;
}
.portant {
    position: absolute;
    color: #ff4949;
    top: 35%;
    left: 2px;
}
.device_box{
    .device_list{
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        .list_item{
            width: 100px;
            height: 120px;
            font-size: 14px;
            text-align: center;
            padding: 5px;
            margin: 0 5px;
            border: 1px solid #d1e9ff;
            border-radius: 10px;
            cursor: pointer;
            &.actives{
                border-color: #1890ff;
            }
            .hzicon{
                width: 64px;
                height: 64px;
                margin: 0 auto 15px;
                &.icon_phone{
                    background: url('../../../../assets/images/icon_phone.png');
                    background-size: 100%;
                }
                &.icon_iPad{
                    background: url('../../../../assets/images/icon_iPad.png');
                    background-size: 100%;
                }
                &.icon_pc{
                    background: url('../../../../assets/images/icon_pc.png');
                    background-size: 100%;
                }
            }
        }
    }
}
</style>
