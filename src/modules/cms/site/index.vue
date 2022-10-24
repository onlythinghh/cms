<template>
    <div class="container">
        <div class="site-wrapper">
            <tree-site @node-click="_getCurrentNode"/>
        </div>
        <div class="info-wrapper">
            <div class="flex btn-group">
                <div>
                    <el-button v-if="Juris.indexOf('ALL_APP_ADD')!==-1" size="mini" @click="_addSite">新增站点</el-button>
                    <el-button
                        v-if="Juris.indexOf('ALL_APP_RECYCLE')!==-1"
                        icon="el-icon-delete" size="mini" type="danger"
                        @click="_goRecycle"
                    >回收站</el-button>
                </div>
                <div v-if="siteForm.id">
                    <el-button
                        v-if="siteForm.authString.indexOf('APP_UPDATE')!==-1"
                        size="mini"
                        :disabled="showData"
                        @click="_editSite(2, siteForm, $event)"
                    >修改站点</el-button>
                    <el-button
                        v-if="siteForm.authString.indexOf('APP_DELETE')!==-1"
                        type="danger"
                        size="mini"
                        :disabled="showData"
                        @click="_delSite(siteForm, $event)"
                    >删除站点</el-button>
                    <el-button
                        v-if="siteForm.authString.indexOf('APP_PUBLISH')!==-1"
                        size="mini"
                        :disabled="showData"
                        @click="_publishSite(siteForm, 1)"
                    >发布</el-button>
                    <el-button
                        v-if="siteForm.authString.indexOf('APP_CLONE')!==-1"
                        size="mini"
                        :disabled="showData"
                        @click="_copySite(siteForm, $event)"
                    >复制站点</el-button>
                    <el-button
                        v-if="siteForm.authString.indexOf('APP_PREVIEW')!==-1"
                        size="mini"
                        :disabled="showData"
                        @click="_previewSite(siteForm, $event)"
                    >预览站点</el-button>
                    <el-button
                        v-if="siteForm.authString.indexOf('APP_FILE')!==-1"
                        size="mini"
                        :disabled="showData"
                        @click="_toFilexplorer(siteForm, $event)"
                    >站点资源管理</el-button>
                </div>
            </div>
            <el-form v-show="appGet" ref="sourceForm" :model="siteForm" :rules="siteFormRules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="站点名称" prop="name">
                            <div v-if="!isReadOnly ">
                                <el-input
                                    v-model="siteForm.name"
                                    class="site-name"
                                    :disabled="isReadOnly"
                                    maxlength="50"
                                    size="mini"
                                    show-word-limit
                                    clearable
                                >
                                    <template v-if="siteForm.id" slot="prepend" >{{ siteForm.id }}</template>
                                </el-input>
                            </div>
                            <div v-else class="show-word-limit">
                                <el-input
                                    v-model="siteForm.name"
                                    :disabled="isReadOnly"
                                    clearable
                                >
                                    <template slot="prepend" >{{ siteForm.id }}</template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="显示名称" prop="showName">
                            <div v-if="!isReadOnly">
                                <el-input
                                    v-model="siteForm.showName"
                                    :disabled="isReadOnly"
                                    maxlength="50"
                                    show-word-limit
                                    clearable
                                />
                            </div>
                            <div v-else class="show-word-limit">
                                <el-input
                                    v-model="siteForm.showName"
                                    :disabled="isReadOnly"
                                    clearable
                                />
                            </div>

                        </el-form-item>
                        <el-form-item label="站点类型" prop="type">
                            <el-select v-model="siteForm.type" :disabled="isReadOnly" class="w100" clearable>
                                <el-option
                                    v-for="(text, key) in siteType"
                                    :key="key"
                                    :label="text"
                                    :value="Number(key)"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="站点关键字" prop="keywords">
                            <el-input
                                v-model="siteForm.keywords"
                                :disabled="isReadOnly"
                                type="textarea"
                                rows="3"
                                resize="none"
                                maxlength="200"
                                show-word-limit
                            />
                        </el-form-item>
                        <el-form-item label="描述" prop="descript">
                            <el-input
                                v-model="siteForm.descript"
                                :disabled="isReadOnly"
                                type="textarea"
                                rows="3"
                                resize="none"
                                maxlength="200"
                                show-word-limit
                            />
                        </el-form-item>
                        <!-- <el-form-item label="审核人" prop="descript"> -->
                            <!-- <el-input
                                v-model="siteForm.reviewer"
                                :disabled="isReadOnly"
                                rows="3"
                                resize="none"
                                maxlength="200"
                                show-word-limit
                            /> -->
                            <!-- <el-select
                                ref="select"
                                v-model="siteForm.reviewer"
                                style="width:100%;"
                                :disabled="isReadOnly"
                                multiple
                                placeholder="请选择审核人"
                            >
                                <el-option
                                    v-for="(item,index) in reviewerList"
                                    :key="index"
                                    :disabled="isReadOnly"
                                    rows="3"
                                    :label="item.value"
                                    :value="item.key"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="父级站点" prop="pid">
                            <TreeSelect
                                v-model="siteForm.pid"
                                value-prop="value"
                                text-prop="label"
                                :disabled="isReadOnly"
                                :options="siteOptions"
                            ></TreeSelect>
                        </el-form-item>
                        <el-form-item label="站点根" prop="path">
                            <div v-if="!isReadOnly">
                                <el-input
                                    v-model="siteForm.path"
                                    :disabled="isReadOnly"
                                    maxlength="50"
                                    show-word-limit
                                    clearable
                                />
                            </div>
                            <div v-else class="show-word-limit">
                                <el-input
                                    v-model="siteForm.path"
                                    :disabled="isReadOnly"
                                    clearable
                                />
                            </div>
                        </el-form-item>
                        <el-form-item label="版权信息" prop="copyright">
                            <el-input
                                v-model="siteForm.copyright"
                                :disabled="isReadOnly"
                                type="textarea"
                                maxlength="200"
                                show-word-limit
                                clearable
                            />
                        </el-form-item>
                        <el-form-item label="排序位置">
                            <el-radio
                                v-model="radio"
                                :disabled="isReadOnly"
                                label="null"
                                @change="_selectRadio('null')"
                            >原始位置</el-radio>
                            <div v-if="isShowOther">
                                <el-radio
                                    v-if="originalPosition"
                                    v-model="radio"
                                    :disabled="isReadOnly"
                                    label="other"
                                    @change="_selectRadio('other')"
                                > 某一站点之前</el-radio>
                                <el-select v-if="isShowOver" v-model="siteForm.sortId" :disabled="place" prop="sortId">
                                    <el-option
                                        v-for="(text, key) in clickNodeData"
                                        :key="key"
                                        :label="text"
                                        :value="Number(key)"
                                    ></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="主频道" prop="indexChannel">
                            <template>
                                <!-- <div v-if="siteForm.indexChannel !== 0"> -->
                                <el-select
                                    ref="mainChannels"
                                    v-model="siteForm.indexChannel"
                                    filterable
                                    clearable
                                    placeholder="请选择"
                                    :disabled="showChannels"
                                >
                                    <el-option
                                        v-for="item in channelList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                                <!-- </div>
                                <div v-else>
                                    <el-select
                                        ref="mainChannels"
                                        v-model="showMainChannel"
                                        filterable
                                        clearable
                                        placeholder="请选择"
                                        :disabled="showChannels"
                                    >
                                        <el-option
                                            v-for="item in showMainChannel"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </div> -->
                            </template>
                        </el-form-item>
                        <el-form-item v-if="siteForm.id" label="网站LOGO" prop="logo">
                            <el-upload
                                v-if="!isReadOnly"
                                v-loading="uploadLoading"
                                class="site-logo-uploader"
                                action
                                :http-request="_uploadLogo"
                                :show-file-list="false"
                            >
                                <img v-if="siteForm.logo" :src="siteForm.logo.url" class="site-logo" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-upload
                                v-else
                                class="site-logo-uploader"
                                action
                                :disabled="disLogo"
                            >
                                <img v-if="siteForm.logo" :src="siteForm.logo.url" class="site-logo" />
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>

                <template v-if="isShowMessage" #header>发布信息</template>
                <el-row>
                    <el-col v-if="isShowMessage" :span="12">
                        <el-form-item label="时间表达式" prop="cron">
                            <el-input
                                v-model="siteForm.cron"
                                :disabled="isReadOnly"
                                maxlength="100"
                                show-word-limit
                            />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item>
                            <el-button v-if="showSave" type="primary" @click="save">保存</el-button>
                            <el-button v-if="showSave" @click="close">{{empty}}</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 新增/修改 -->
            <!-- <EditModal v-bind="edit" @closeEditModal="closeEditModal" /> -->
            <!-- 新增/修改 -->

            <!-- 复制 -->
            <CopyModal v-bind="copy" @closeCopyModal="closeCopyModal" />
            <!-- 复制 -->

            <!-- 发布方式 -->
            <PublishModal v-bind="publish" :site-id="siteId" @closePublishModal="closePublishModal"/>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { showLoading, showMessage, showError, confirm } from '@/utils'
import { deepCopy } from '@/utils/BaseUtil'
import { previewApp } from '../preview'
// import EditModal from './main/edit'
import CopyModal from './main/copy'
import PublishModal from './main/publish'
import TreeSite from './components/TreeSite.vue'
import { matchName, matchCode, matchImage } from '@/utils/RegExpUtil'
import { isEmpty } from '@/utils/BaseUtil'
import { BASE64Helper } from '@/utils/CryptUtil'
// import { constants } from 'crypto';
/* eslint-disable */
export default {
    name: 'Site',
    components: {
        // EditModal,
        CopyModal,
        TreeSite,
        PublishModal
    },

    data() {
        const siteForm = {
            id: null,
            name: '',
            showName: '',
            type: 1,
            keywords: '',
            pid: '',
            path: '',
            logo: {},
            descript: '',
            copyright: '',
            cron: '',
            currentSelectedNode: {},
            sortFlag: '',
            sortId: 0,
            pName: '',
            indexChannel: '',
            reviewer: []
        }
        const addSite = {
            id: null,
            name: '',
            showName: '',
            type: 1,
            keywords: '',
            pid: '',
            path: '',
            logo: {},
            descript: '',
            copyright: '',
            cron: '',
            sortFlag: '',
            sortId: 0,
            pName: '',
            indexChannel: ''
        }

        const siteFormRules = {
            name: [
                { required: true, message: '站点名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchName(value)) {
                            callback('站点名称只能是中文、数字、字母、下划线、横线、两边不能有横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            showName: [
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchName(value)) {
                            callback('站点显示名称只能是中文、数字、字母、下划线、横线；两边不能有横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            path: [
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchCode(value)) {
                            callback('站点根只能输入数字、字母、下划线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            type: [
                { required: true, message: '请选择站点类型' },
            ]
        }
        return {
            Juris:[],
            reviewer: [],
            reviewerList: [],
            siteId: null,
            appGet: true,
            showMainChannel: '',
            showChannels: true,
            showIndexChannel: false,
            showSave: false,
            // filename:'',
            // logoUrl: '',
            disLogo: true,
            place: true,
            channel: '',
            channelList: {},
            //主频道
            // mainChannel: '',
            showChannel: true,
            currentSelectedNode: {},
            clickNodeData: {},
            radio: 'null',
            originalPosition: true,
            isShowOver: true,
            isShowOther: true,
            showData: true,
            addSite,
            isReadOnly: true,
            needReload: false,
            uploadLoading: false,
            siteForm,
            siteFormRules,
            dataId: '',
            dataType: '',
            siteData: [],
            siteDatas: [],
            empty: '重置',
            edit: {
                visible: false,
                info: {},
                optType: 3,
            },
            search: '',
            copy: {
                visible: false,
                info: {}
            },
            publish: {
                visible: false
            },
            background: '',
            btns: {
                'app:btn:alter': {
                    name: '修改',
                    args: [2],
                    event: (siteForm, event, type)=>{
                        this._editSite(type, siteForm, event),
                        this.showSave = true
                    },
                },
                'app:btn:del': {
                    name: '删除',
                    args: null,
                    event: (siteForm, event)=>{
                        this._delSite(siteForm, event)

                    },
                    type: "danger"
                },
                'app:btn:release': {
                    name: '发布',
                    args: null,
                    event: (siteForm, event, type) => this._publishSite(siteForm, 1),
                },
                // 'app:btn:release:incr': {
                //     name: '增量发布',
                //     args: null,
                //     event: (siteForm, event, type) => this._publishSite(siteForm, 2),
                // },
                'app:btn:copy': {
                    name: '复制',
                    args: null,
                    event: (siteForm, event) => this._copySite(siteForm, event)
                },
                'app:btn:preview': {
                    name: '预览',
                    args: null,
                    event: (siteForm, event) => this._previewSite(siteForm, event)
                },
                'app:btn:filexplorer': {
                    name: '文件管理',
                    args: null,
                    event: (siteForm, event) => this._toFilexplorer(siteForm, event)
                },
                // 'app:btn:data:perm': {
                //     name: '权限设置',
                //     args: null,
                //     event: (siteForm, event) => this.todata(siteForm, event),
                //     type: "primary"
                // },
                'app:btn:recycle': {
                    name: '回收站',
                    args: null,
                    event: (siteForm, event)=>this._goRecycle( siteForm, event),
                    type: "danger"
                },
            }
        }
    },
    computed: {
        ...mapGetters('authen', ['getAttachModule']),
        ...mapState('authen', ['userinfo']),
        ...mapState('cms/site', ['sites']),
        ...mapGetters('cms/site', ['site']),
        ...mapGetters('authen', ['getDictionary']),
        isShowMessage() {
            return this.siteForm.type !== 1 && this.siteForm.type !== 2
        },
        // isReadOnly(){
        //     return this.siteForm.type !== 1 && this.siteForm.type !== 2
        // },
        isChoosedSite() {
            return id => {
                return this.site.id === id
            }
        },
        siteOptions() {
            let sites = deepCopy(this.sites || [])
            const id = this.siteForm.id
            const filter = (_sites = []) => {
                return _sites.filter(site => {
                    if (site.id === id) {
                        return false
                    }
                    if (site.children && site.children.length) {
                        site.children = filter(site.children)

                    }
                    return true
                })
            }
            const simpleSite = (_sites) => {
                return _sites.map(site => {
                    const _site = { value: site.id, label: site.name }
                    if (site.children && site.children.length) {
                        _site.children = simpleSite(site.children)
                    }
                    return _site
                })
            }
            if (id) {
                // 排除掉自己和自己的子级
                sites = filter(sites)
            }
            return simpleSite(sites)

        },
        siteType() {
            return this.getDictionary('siteType')
        },
        siteStatus() {
            // 1 发布 2 发布中
            return this.getDictionary('siteStatus')
        },
        siteStatusFullName() {
            const siteStatus = this.siteStatus
            return (key = '') => {
                return siteStatus[key] || '全量发布'
            }
        },
        siteStatusAddName() {
            const siteStatus = this.siteStatus
            return (key = '') => {
                return siteStatus[key] || '增量发布'
            }
        },
        tableDatas() {
            const searchKey = this.search
            const sites = deepCopy(this.sites)
            const filter = (datas = [], key) => {
                if (!key) return datas
                return datas.filter(item => {
                    let isMatch = false
                    if (item.name.toLowerCase().includes(key.toLowerCase()) || item.showName.toLowerCase().includes(key.toLowerCase())) {
                        isMatch = true
                    }
                    if (item.children && item.children.length > 0) {
                        const children = filter(item.children, key)
                        if (children && children.length > 0) {
                            isMatch = true
                            item.children = children
                        } else {
                            item.children = []
                        }
                    }
                    return isMatch
                })
            }
            return filter(sites, searchKey)
        },
    },
    watch: {
        'siteForm.indexChannel' (v) {
            if (v === 0) {
                this.siteForm.indexChannel = ''
            }
        },

    },
    created() {

        if(this.siteForm.sortId === 0) {
            this.siteForm.sortId = ''
        }
        this.reloadSites()
        this.init()
        // this.getReviewer()
    },
    methods: {
        ...mapActions('authen', ['getReviewerList']),
        //处理下拉数据
        selectData(data){
            var arr = []
            data.forEach(item => {
                arr.push(item.key)
            })
            return arr
        },
        //获取审核人列表
        // getReviewer(){
        //     this.getReviewerList().then(
        //         result => {
        //             this.reviewerList = result
        //         })
        // },
        // 点击单选框发生的事件
        _selectRadio(type) {
            this.radio = type
            switch (type) {
            case 'null':
                this.siteForm.sortId = null,
                this.siteForm.sortFlag = 'null'
                this.isShowOver = false,
                this.place = true
                break;
            case 'other':
                this.isShowOver = true
                this.siteForm.sortFlag = 'other'
                this.place = false
                break;
            }
        },
        ...mapActions('cms/channel/channelList', ['getChannelList']),
        init() {
            // 初始化频道数据
            if(this.dataId)
                this.getChannelList({ appid: this.dataId }).then((data) => {
                    this.channelList = data[0].children
                })
        },
        // 判断是否有按钮操作权限,并且不是管理员
        _getCurrentNode (data,node) {
            if (this.$refs.sourceForm)
                this.$refs.sourceForm.resetFields();
            this.siteId = data.id
            this.siteForm.sortId = ''
            this.place = true
            this.radio = 'null'
            this.showChannels = true
            this.showSave = false
            this.siteForm.logo = data.logo
            // this.logoUrl = data.logo.url
            this.siteDatas = data
            this.siteData = data.permissions
            this.showChannel = true
            this.originalPosition = true,
            this.isShowOver = true
            this.currentSelectedNode = node
            this.showData = false,
            this.isReadOnly = true,
            this.dataId = data.id,
            this.dataType = data.type,
            this.siteForm = {
                ...this.siteForm,
                ...data
            },
            this.siteForm.reviewer = this.selectData(this.siteForm.reviewer)
            this.edit.info = data
            let condition = {}

            let newChildNodes = node.parent.childNodes.filter(item => item.data.id != data.id)
            newChildNodes.map(item => {
                condition[item.data.id] = item.data.name
            })
            this.clickNodeData = condition
            if (isEmpty(this.clickNodeData)) {
                this.isShowOther = false
            } else {
                this.isShowOther = true
            }
            this.init()
            if(data.authString) {
                if(!data.authString.length ) {
                    this.appGet = false
                }
                if(data.authString.indexOf('APP_VIEW') === -1) {
                    this.appGet = false
                } else {
                    this.appGet = true
                }

            }
            if(this.userinfo.admin) this.appGet = true
        },
        ...mapActions('cms/site', ['loadSites', 'delSite', 'publishSite']),
        ...mapMutations('cms/site/filexplorer', ['clearExplorer']),
        ...mapActions('cms/site', ['saveSite', 'uploadLogo']),
        _siteInfo(site, event) {
            this.modifier(3, site, event)
        },
        _addSite() {
            this.appGet = true
            this.showChannels = false
            this.channelList = {}
            this.empty = '清空'
            this.showChannel = true
            this.showSave = true
            this.originalPosition = false,
            this.isShowOver = false
            this.showData = true,
            this.addSite.pid = this.siteForm.id
            this.isReadOnly = false,
            this.modifier({ ...this.addSite })
        },
        _editSite() {
            if(this.siteForm.indexChannel === '') {
                this.showChannel = true
            } else {
                this.showChannel = false
            }

            if (isEmpty(this.currentSelectedNode)) {
                showMessage({
                    type: 'warning',
                    message: '请至少选择一个要修改的频道'
                })
                return
            }
            this.showChannels = false
            this.empty = '重置'
            this.originalPosition = true,
            this.showData = true
            this.showSave = true
            this.modifier({...this.siteForm})
        },
        modifier(info, event) {
            this.isReadOnly = false,
            event && event.stopPropagation()
            this.siteForm = info || {}
        },
        _delSite({ id, name }, event) {
            event.stopPropagation()
            confirm(`删除后可在回收站内恢复，确认删除吗？`, '警告', {
                ok: () => {
                    showLoading(true, '正在删除站点')
                    this.delSite({ id }).then(() => {
                        this.close()
                        showLoading(false)
                        showMessage('站点删除成功')
                        this.reloadSites()
                    }).catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
                }
            })
        },
        _uploadLogo({ file, onError, onSuccess }) {
            const { type, limit = 0 } = this.getAttachModule('imageAppLogo')
            const appid = this.siteForm.id
            // https://jsonplaceholder.typicode.com/posts/
            this.uploadLoading = true
            if (!matchImage(file.type)) {
                showError('只允许上传图片')
                this.uploadLoading = false
                onError(new Error('只允许上传图片'), file, [file])
                return
            }
            const isLimit1M = file.size / 1024 / 1024 < limit
            if (!isLimit1M) {
                showError(`LOGO图片大小不能超过 ${limit} MB`)
                this.uploadLoading = false
                onError(new Error(`LOGO图片大小不能超过 ${limit} MB`), file, [file])
                return
            }
            BASE64Helper.imgMd5(file).then(_file=>{
                this.uploadLogo({ file:_file, type,appid }).then(response => {
                    // debugger
                    this.uploadLoading = false
                    const { file} = response.data.data
                    this.siteForm.logo = response.data.data
                    // this.filename = file
                    // this.siteForm.logo = file
                    // this.logoUrl = url
                    // this.siteForm.logoId = id || '';
                    onSuccess(response, file, [file])
                }).catch(error => {
                    this.siteForm.logo = ''
                    onError(error, file, [file])
                    this.uploadLoading = false
                    showError(error.message)
                })
            })
        },
        // 站点发布
        _publishSite(site, type) {
            // site.type = type
            event.stopPropagation()
            this.publish.visible = true
            // showLoading(false, '正在发布站点')
            // this.publishSite(site).then(response => {
            //     showLoading(false)
            //     showMessage('此过程可能需要一段时间, 请耐心等待')
            // }).catch(error => {
            //     showLoading(false)
            //     showError(error.message)
            // })

        },

        save() {
            this.$refs.sourceForm.validate(valid => {
                if (!valid) {
                    return false
                }
                // const site = this.siteForm
                showLoading(true, '正在保存')
                this.reviewer = []
                this.siteForm.reviewer && this.siteForm.reviewer.forEach(key => {
                    this.reviewerList.forEach(item => {
                        if(item.key == key){
                            this.reviewer.push(item)
                        }
                    });
                })
                this.saveSite({...this.siteForm, reviewer: this.reviewer}).then(() => {
                    // debugger
                    showLoading(false)
                    showMessage('保存成功')
                    this.needReload = true
                    this.showChannel = true
                    this.needReload && this.reloadSites()
                    this.radio='null'
                    this.isReadOnly = true
                    this.place = true
                    this.showChannels = true
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            })
        },
        close() {
            // this.$refs.siteForm.resetFields()
            // this.siteModalVisible = false
            this.siteForm = {
                id: null,
                name: '',
                showName: '',
                type: 1,
                keywords: '',
                pid: '',
                path: '',
                logo: {},
                // logoId: '',
                descript: '',
                copyright: '',
                cron: '',
                currentSelectedNode: {},
                sortFlag: '',
                sortId: '',
                pName: '',
                indexChannel:'',

            }
            this.radio = 'null',
            this.$refs.sourceForm.resetFields()
        },
        // 站点复制
        _copySite(site, evnet) {
            event.stopPropagation()
            this.copy.visible = true
            this.copy.info = { ...site }
        },
        // 站点预览
        _previewSite(site, evnet) {
            event.stopPropagation()
            previewApp(site.id)
        },
        // 站点统计
        _statistics(site, evnet) {
            event.stopPropagation()
            showMessage('待定...')
        },
        // 资源管理
        _toFilexplorer(site, evnet) {
            event.stopPropagation()
            // 清理上一个站点的文件
            this.clearExplorer()
            this.$router.push({ path: `/cms/sites/filexplorer/${site.id}` })
        },
        closeEditModal(needReload) {
            this.edit.visible = false
            this.edit.info = {}
            needReload && this.reloadSites()
        },
        //取消复制
        closeCopyModal(needReload) {
            this.copy.visible = false
            needReload && this.reloadSites()
        },
        closePublishModal(needReload) {
            this.publish.visible = false
            needReload && this.reloadSites()
        },
        reloadSites() {
            showLoading(true, '正在加载站点')
            this.loadSites().then((data) => {
                this.Juris = data.auth
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        todata(v,e){
            this.$router.push({path:'/system/authority',query:{appId:this.dataId,siteTag:"app"}})
        },
        //回收站
        _goRecycle() {
            this.$router.push('/cms/sites/site-recycle')
        }
    }
}
</script>
<style lang="scss" scoped>
.mt {
    margin-right: 5px;
}
.flex{
    display: flex;
    >div:first-child{
        margin-right: 10px;
    }
}
.container {
    display: flex;
    // height: 100%;

    .site-wrapper {
        width: 20%;
        max-width: 300px;
        padding-right: 15px;
        overflow-y: auto;
        border-right: 1px solid #e6ebf5
    }
    .info-wrapper {
        padding: 0 15px;
        width: 80%;
    }
}
.btn-group {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
}

// .site-name {
//     .el-input-group__prepend {
//         background-color: #fff;
//         color: yellow;
//     }
// }

/deep/ .el-form-item__error{
    position: relative ;
}
/deep/ .el-form-item.is-error{
    margin-bottom: 5px;
}

.show-word-limit {
    /deep/ .el-input__inner {
        padding-right: 15px;
    }
}
/deep/.site-logo-uploader {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    color: #d9d9d9;

}
/deep/.el-upload{
    width: 180px !important;
    height: 180px !important;
    i {
        line-height: 180px
    }
}
img {
    width: 178px;
    height: 178px
}
// /deep/ .is-current {

        // /deep/.el-tree-node__content {
            // background: red
        // }
    // .tree-item {
    //     height: 26px;
    //     line-height: 26px;
    //     background: #edf6ff
    // }


    // .el-tree-node__content:nth-child(1)  {
    //     .custom-tree-node{
            // /deep/  .tree-item:nth-child(1) {
            //     height: 26px;
            //     line-height: 26px;
            //     background: #edf6ff
            // }
    //     }
    // }
// }
</style>
