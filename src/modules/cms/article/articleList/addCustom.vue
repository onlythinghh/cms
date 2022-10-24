<!-- eslint-disable  -->
<template>
<div>
    <Modal
        v-if="showedit"
        :visible="value" 
        :title="title + (custonId ? custonId : '') +'　　'+ (currVersion?'当前版本：'+currVersion:'')"
        width="100%"
        fullscreen
        :modal="false"
        :close-on-press-escape="false"
        class="add-custom-article"
        @close="_closeModal"
    >
        <el-form ref="editForm" :model="formModel" :rules="formRules" label-width="150px" size="mini" class="add_form">
            <el-row>
                <el-col :span="14" :class="collect?'row_coll':''">
                    <el-form-item
                        v-for="(item, idx) in articleFields"
                        :key="idx"
                        :label="item.title"
                        :required="item.widget=='ATTACH'||item.widget=='IMAGE'?false:item.required"
                        :prop="item.name"
                        class="form_it"
                        :class="{'checkItem':item.widget=='ATTACH'||item.widget=='IMAGE'?item.required:false}"
                        :style="item.widget === 'HIDDEN' || item.widget === 'SYSTEM' ? 'display:none;' : ''"
                    >
                        <template>
                            <el-input-number
                                v-if="item.type === 'NUMBER' && item.widget ==='TEXT'"
                                :key="idx"
                                v-model.number="formModel[item.name]"
                                :precision="item.precision"
                                :controls="false"
                                :readonly="isReadOnly"
                                tyle="width: 100%;"
                                @change="NumberChange(item.len,item.name,item.precision)"
                            />
                            <el-radio-group 
                                v-else-if="item.type === 'BOOL'" 
                                :key="idx"
                                v-model="formModel[item.name]"
                                :disabled="isReadOnly" size="mini"
                            >
                                <el-radio v-for="(it, index) in item.enums" :key="index" :label="it.key==1?true:false">
                                    {{ it.label }}
                                </el-radio>
                            </el-radio-group>
                            <el-radio-group v-else-if="item.widget === 'RADIO'&&item.type!=='BOLL'"
                                            :key="idx" v-model="formModel[item.name]"
                                            :disabled="isReadOnly"
                                            size="mini"
                            >
                                <el-radio v-for="(it, index) in item.enums" :key="index" :label="it.key">{{
                                        it.label
                                    }}
                                </el-radio>
                            </el-radio-group>
                            <el-select
                                v-else-if="item.widget === 'SELECT'"
                                v-model="formModel[item.name]"
                                :disabled="isReadOnly"
                                style="width: 100%;"
                            >
                                <el-option
                                    v-for="it in item.enums"
                                    :key="it.key"
                                    :label="it.label"
                                    :value="it.key"
                                ></el-option>
                            </el-select>
                            <el-select
                                v-else-if="item.widget === 'TAGS'"
                                v-model="formModel[item.name]"
                                :disabled="isReadOnly"
                                style="width: 100%;"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择或输入标签"
                            >
                                <el-option
                                    v-for="it in item.enums"
                                    :key="it.key"
                                    :label="it.label"
                                    :value="it.key"
                                >
                                </el-option>
                            </el-select>
                            <el-select
                                v-else-if="item.widget === 'CHECKBOX'"
                                :key="idx"
                                v-model="formModel[item.name]"
                                :disabled="isReadOnly"
                                clearable
                                multiple
                                size="mini"
                                style="width: 100%;"
                            >
                                <el-option v-for="(it, index) in item.enums" :key="index" :label="it.label" :value="it.key"/>
                            </el-select>
                            <el-date-picker
                                v-else-if="item.widget === 'DATE' || item.widget === 'DATETIME'"
                                v-model="formModel[item.name]"
                                placeholder="选择日期时间"
                                :readonly="isReadOnly"
                                size="mini"
                                :type="item.widget === 'DATE'?'date':'datetime'"
                                @change="dateTime(item.name)"
                            />
                            <el-time-picker
                                v-else-if="item.widget === 'TIME'"
                                :key="idx"
                                v-model="formModel[item.name]"
                                placeholder="选择时间"
                                :readonly="isReadOnly"
                                value-format="timestamp"
                                size="mini"
                            />
                            <div
                                v-else-if="(item.widget === 'TEXT' && item.type!=='NUMBER') || item.widget === 'HIDDEN' || item.widget === 'SYSTEM'"
                            >
                                <!-- <div v-if="tagList.length!==0 && item.name==='tag'">
                                    <el-select
                                        v-model="formModel[item.name]"
                                        :disabled="isReadOnly"
                                        clearable
                                        style="width: 100%;"
                                    >
                                        <el-option
                                            v-for="(it,index) in tagList"
                                            :key="index"
                                            :label="it"
                                            :value="it"
                                        ></el-option>
                                    </el-select>
                                </div> -->
                                <div>
                                    <el-input
                                        :key="idx"
                                        v-model="formModel[item.name]"
                                        :maxlength="item.len"
                                        :readonly="isReadOnly"
                                        size="mini"
                                    />
                                </div>
                            </div>
                            <div v-else-if="item.widget === 'IMAGE'">
                                <div v-for="(img,val) in formModel[item.name]" :key="val" class="upload_img">
                                    <img :src="img.url" @click="_removeImage(item.name,val)">
                                    <i class="el-icon-delete" @click="_removeImage(item.name,val)"></i>
                                </div>
                                <!-- 918 -->
                                <!-- <el-upload
                                    action
                                    :disabled="isReadOnly"
                                    list-type="picture-card"
                                    :data="{name:item.name}"
                                    :http-request="_uploadThumbnail"
                                    :on-change="_selectFile"
                                    :show-file-list="false"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <p v-if="item.desc" style="color:#ff4949">{{item.desc}}</p> -->

                                <!-- <div class="title">手机端图片<span class="jy">（建议尺寸750*500）</span></div> -->
                                <ImgCutter ref="imgCutterModal"
                                    :index="{name:item.name}"
                                    :cross-origin="true"
                                    :tool="false"
                                    :tool-bgc="'none'"
                                    :is-modal="true"
                                    :show-choose-btn="true"
                                    :lock-scroll="true"
                                    :box-width="1024"
                                    :box-height="780"
                                    :cut-width="750"
                                    :cut-height="334"
                                    :size-change="true"
                                    :move-able="true"
                                    :img-move="false"
                                    style="width: 150px"
                                    @cutDown="_uploadThumbnail"
                                    @onChooseImg="_selectFile"
                                >
                                    <div slot="open" class="upload-picture"><i class="el-icon-plus"></i></div>
                                </ImgCutter>
                                <p v-if="item.desc" style="color:#ff4949">{{item.desc}}</p>
                            </div>
                            <el-upload
                                v-else-if="item.widget === 'ATTACH'"
                                action
                                class="upload-file"
                                :disabled="isReadOnly"
                                :multiple="false"
                                :data="{name:item.name}"
                                :show-file-list="false"
                                :on-change="_selectFile"
                                :http-request="_uploadFile"
                                :on-success="onSuccess"
                                :file-list="formModel[item.name]"
                            >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <span v-if="item.desc" style="color:#ff4949;margin-left: 20px;cursor:default">{{item.desc}}</span>
                                <div slot="tip">
                                    <p v-for="(img,val) in formModel[item.name]" :key="val" class="upload_File">
                                        <a :href="img.url">{{ img.origin }}</a>
                                        <i class="el-icon-delete" @click="_removeImage(item.name,val)"></i>
                                    </p>
                                </div>
                            </el-upload>
                            
                            <CK-editor
                                v-if="item.widget === 'RICHTEXT'"
                                :ref="'ck_'+item.name"
                                v-model="formModel[item.name]"
                                :readonly="isReadOnly"
                                :config="editorConfig"
                                :easy="true"
                                :upload-image-config="editorImageConfig"
                                :need-bottom-tools="true"
                                :isdiyForm="true"
                                @on-uploaded="_getContent"
                            >
                                <!-- <template #btn>
                                    <el-button
                                        :disabled="hotword"
                                        @click="_replaceHotword"
                                    >热词替换</el-button>
                                </template> -->
                            </CK-editor>
                            <!-- <UEditor v-else-if="item.widget === 'RICHTEXT'" ref="ueditor" v-model="formModel[item.name]" /> -->

                            <el-input
                                v-else-if="item.widget === 'TEXTAREA'"
                                :key="idx"
                                v-model="formModel[item.name]"
                                type="textarea"
                                :readonly="isReadOnly"
                                :rows="3"
                                size="mini"
                            />
                            <span
                                v-if="item.required&&(item.widget=='ATTACH'||item.widget=='IMAGE')"
                                :ref="'msg_'+item.name"
                                class="msgerr"
                            ></span>

                            <!-- 颜色下拉框 -->
                            <el-color-picker
                                v-else-if="item.widget === 'COLOR'"
                                :key="idx"
                                v-model="formModel[item.name]"
                                popper-class="from-color-picker"
                                :readonly="isReadOnly"
                                :predefine="predefineColors"
                            >

                            </el-color-picker>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="9" :offset="1" :class="collect?'row_col':''">
                    <div :class="collect?'collect_ac':'collect'">
                        <div @click="retract">
                            <i :class="collect?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"></i>
                            <span>{{collect?'展开':'收起'}}</span>
                        </div>
                    </div>
                    <h4 style="text-align: center;margin-bottom: 10px;">基础属性</h4>
                    <el-form-item label="标签" label-width="70px" :required="tagList.length !== 0" >
                        <div v-if="tagList.length !== 0">
                            <el-select v-model="formModel['tag']" :disabled="isReadOnly" clearable style="width: 100%">
                                <el-option v-for="(it, index) in tagList" :key="index" :label="it" :value="it"></el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <el-input v-model="formModel['tag']" :maxlength="200" :readonly="isReadOnly" size="mini" />
                        </div>
                    </el-form-item>
                    <el-form-item label="文章路径" prop="url_part" label-width="70px">
                        <el-input v-model="formModel.url_part" @input="parturlChanges" maxlength="50" :disabled="isReadOnly" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="完整路径" prop="url_main" label-width="70px">
                        <el-input v-model="formModel.url_main" @input="mainurlChanges" maxlength="300" :disabled="isReadOnly" show-word-limit></el-input>
                        <p class="tips">新增或复制项目后务必<span>更新</span>路径，并保持路径完整性。</p>
                    </el-form-item>
                    <el-form-item label="是否产品" label-width="70px">
                        <el-switch v-model="isProduct" inactive-text="否" active-text="是"></el-switch>
                    </el-form-item>
                    <div v-show="isProduct">
                        <el-form-item label="图标" prop="icon" label-width="70px">
                            <el-select
                                v-model="formModel.icon"
                                filterable
                                placeholder="请选择资源图标"
                                class="w100"
                                clearable
                            >
                                <el-option
                                    v-for="(icon, index) in icons"
                                    :key="index"
                                    :label="icon"
                                    :value="icon"
                                >
                                    <span style="float: left">{{ icon }}</span>
                                    <span style="font-size:20px; float: right">
                                        <i :class="['iconfont', icon]"></i>
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品描述" prop="description" label-width="70px">
                            <el-input v-model="formModel.description" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <!-- <el-form-item label="二维码链接" label-width="70px">
                        <el-input v-model="qrcodeurl" ></el-input>

                    </el-form-item> -->
                    <template v-if="from.formId == 32">
                        <el-form-item v-if="formType != 'add' && formModel.status == 'PUBLISHED'" label="二维码" label-width="70px">
                            <div class="qrcode" ref="qrcode">
                                <img :src="qrcodeurl" />
                            </div>
                            <el-button @click="generateQRCode">生成二维码</el-button>
                        </el-form-item>
                    </template>
                    <h4 style="text-align: center;margin-bottom: 10px;">操作记录</h4>
                    <el-form-item label="操作记录" >
                        <el-tabs v-model="activeName" @tab-click="tabsClick">
                            <el-tab-pane label="全部" name="first">
                                <el-table
                                    height="270"
                                    :data="reviewerList"
                                    style="width: 100%"
                                >
                                    <el-table-column
                                        label="日期"
                                        width="180"
                                    >
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="oper"
                                        label="操作人"
                                        width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="description"
                                        label="描述"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="新增" name="second">
                                <el-table
                                    height="270"
                                    :data="reviewerList1"
                                    style="width: 100%"
                                >
                                    <el-table-column
                                        label="日期"
                                        width="180"
                                    >
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="oper"
                                        label="操作人"
                                        width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="description"
                                        label="描述"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="发布" name="third">
                                <el-table
                                    height="270"
                                    :data="reviewerList1"
                                    style="width: 100%"
                                >
                                    <el-table-column
                                        label="日期"
                                        width="180"
                                    >
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="oper"
                                        label="操作人"
                                        width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="description"
                                        label="描述"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="审核" name="fourth">
                                <el-table
                                    height="270"
                                    :data="reviewerList1"
                                    style="width: 100%"
                                >
                                    <el-table-column
                                        label="日期"
                                        width="180"
                                    >
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="oper"
                                        label="操作人"
                                        width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="description"
                                        label="描述"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="撤稿" name="five">
                                <el-table
                                    height="270"
                                    :data="reviewerList1"
                                    style="width: 100%"
                                >
                                    <el-table-column
                                        label="日期"
                                        width="180"
                                    >
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="oper"
                                        label="操作人"
                                        width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="description"
                                        label="描述"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form-item>
                    <!-- 历史版本-->
                    <div class="historyBox">
                        <span style="font-weight:bold;line-height:46px">历史版本</span>
                        <div :class="ifexpand?'historyList':'historyList historyActive'">
                            <el-button 
                                v-for="(item,index) in historyArr"
                                :key="index"
                                :disabled="item.disable"
                                :style="!item.version?'':'margin:5px;width:195px'"
                                @click="changeVesion(item,index)"
                            >{{!item.version?'无':item.version}}</el-button>
                        </div>
                        <el-tooltip
                            v-if="historyArr.length>=5"
                            class="item" effect="dark"
                            :content="ifexpand?'点击展开历史版本数据':'点击收起历史版本数据'"
                            placement="right-start"
                        >
                            <i :class="ifexpand?'el-icon-circle-plus':'el-icon-remove'" style="cursor:pointer;margin-top:17px" @click="expandVersion"></i>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
        </el-form>

        <div class="bottom-btn-wrapper">
            <el-button size="medium" :disabled="isReadOnly" @click="_saveArticle(2)">保存并关闭</el-button>
            <el-button size="medium" :disabled="isReadOnly" style="margin-left:10px" @click="_saveArticle(1)">保存草稿
            </el-button>
            <!-- <el-button size="medium" :disabled="isReadOnly" @click="commonPrev">预览</el-button> -->
            <el-button size="medium" @click="_closeModal">关闭</el-button>
            <template v-if="from.formId != 22">
            <el-button size="medium" v-if=" includeId.includes(this.currentChannel.pid) == true || this.currentChannel.id == 412" @click="_lookPrdFeature">查看产品特色</el-button>
            </template>
        </div>
    </Modal>
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
            <el-button type="primary" @click="_preview" style="margin-left:10px">确 定</el-button>
        </div>
    </el-dialog>
    <mobileMoadel :mobileVisible="ylShow" :mediaType="currActive" :url="ylUrl" @closed="moboelClosed"></mobileMoadel>
    
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex";
import {showLoading, showMessage} from "@/utils/";
import {pathUrl,pathUrlMain} from '@/utils/RegExpUtil';
import {showError} from '@/utils';
import {isArray} from '@/utils/BaseUtil'
import {BASE64Helper} from '@/utils/CryptUtil'
import mobileMoadel from "./mobileModel/mobileModel.vue"
import zhIcons from '../api/icondata'
import ImgCutter from 'vue-img-cutter'
// import QRCode from 'qrcodejs2'


export default {
    name: "AddCustom",
    components: {
        mobileMoadel,
        ImgCutter
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        from: {
            type: Object,
            default: () => {
            }
        },
        articleFields: {
            type: Array,
            default: () => []
        },
        tagList: {
            type: Array,
            default: () => []
        },
        value: {
            type: Boolean,
            default: false
        },
        editable: {
            type: Boolean,
            default: false
        },

        data: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            qrcodeurl: '',
            collect:false,
            showedit: false,
            record: ["1"],
            tabType: [],
            reviewerList: [],
            reviewerList1: [],
            activeName: 'first',
            custonId: "",
            audit: "",
            idea: "",
            topor: false,
            sort: true,
            radio: "null",
            isReadOnly: false,
            isShowShortTitle: false,
            isShowSubTitle: false,
            isShowViewTitle: false,
            file: {}, // 当前选中的文件
            editorConfig: {
                removeButtons: ["Paste", "PasteText", "PasteFromWord", "Maximize"],
            },
            //上传图片
            editorImageConfig: {
                url: `${process.env.VUE_APP_REQUEST_BASE_API}/cms/attach/upload/file`,
                data: {
                    module: '13',
                    appid: ''
                }
            },
            formModel: {},
            formExtraData: {},
            contentIds: [],
            formRules: {},
            hotword: false,
            editorUploadEnums: {
                link: "link",
                image: "image",
                video: "video",
                audio: "audio"
            },
            // 图片上传配置
            imageConfig: {
                responseType: "json",
                responsePathName: "path", // 上传完成获取图片路径字段
                url: "/api/cms/attach/upload/file",
                name: "file",
                size: 5, // 上传图片的大小，单位Mb
                data: {
                    module: 14,
                    appid: ''
                }
            },
            currVersion:'',
            historyArr:[],
            ifexpand:true,
            formUid:'',
            formId:'',
            formType:"",
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
            urlDisabled: false,
            includeId: [293, 296, 65794, 65795], // 排除不显示的频道
            predefineColors: [
                '#00A758',
                '#FAFAFA',
                '#EDEDED',
                '#FF7769',
                '#282B3E',
                '#0000C1',
                '#424559',
                '#FFFFFF',
                '#361558',
                '#F49600',
                '#06C7BA',
            ]
        };
    },
    computed: {
        ...mapState("authen", ["userinfo"]),
        ...mapState("cms/article", ["currentChannel"]),
        ...mapState("cms/article/articleList", ["appid", "list"]),
        // ...mapGetters("authen", ["getDictionary"]),
        // ...mapGetters("cms/template", ["getTemplateById"]),
        ...mapGetters("cms/site", {
            sites: "normalizeSites",
            site: "site"
        }),
        icons() {
            return zhIcons
        }
    },
    watch: {
        value(v) {
            if (!v) {
                this._resetForm()
            }
            // v && (this.formModel.author = this.userinfo.username);
        },
        isProduct(v) {
            if(!v) {
                this.formModel.icon = ''
                this.formModel.description = ''
            }
        },
        data: {
            deep: true,
            handler(v) {
                if (!v.custom) {
                    return;
                }
                // console.log(v.type);
                this.formUid = v.formUid
                this.showedit = true,
                this.custonId = v.id
                this.formId = v.formId
                this.formType = v.type
                this.articleFields.forEach(ele => {
                    if (ele.required && ele.widget !== 'RICHTEXT' && ele.widget !== 'IMAGE' && ele.widget !== 'ATTACH') {
                        this.formRules[ele.name] = [
                            {
                                required: true,
                                message: `${ele.title}不能为空`,
                                trigger: ele.widget == 'CHECKBOX' || ele.widget == 'TAGS' || ele.widget == 'RADIO' ||
                                ele.widget == 'SELECT' ? 'change' : 'blur'
                            }
                        ]
                    } else if (ele.required && ele.widget == 'RICHTEXT') {
                        this.formRules[ele.name] = [
                            {
                                validator: (rule, value, cb) => {
                                    value = this.getEditorData(ele.name)
                                    if (!value) {
                                        return cb('请输入文章正文')
                                    } else {
                                        return cb('')
                                    }
                                },
                                trigger: 'blur'
                            }
                        ]
                    }
                })
                this.formRules.url_part=[
                    // {required: true, message: '请输入文章路径', trigger: 'blur'},
                    {
                        validator: function (rule, value, callback) {
                            if (value && !pathUrl(value)) {
                                callback('路径以数字字母开头,允许数字字母下划线点-@#')
                            } else {
                                callback()
                            }
                        }
                    }
                ];
                this.formRules.url_main=[
                    // {required: true, message: '请输入完整路径', trigger: 'blur'},
                    {
                        validator: function (rule, value, callback) {
                            if (value && !pathUrlMain(value)) {
                                callback('路径以/开头,允许数字字母下划线点-@#')
                            } else {
                                callback()
                            }
                        }
                    }
                ];
                console.log(' this.articleFields', this.articleFields)
                if (v.type === 'edit') {
                    this.customDetail({dataId: v.id, channelId: this.currentChannel.id, formId: v.formId}).then(res => {
                        if(!res.success){
                            showError('文章获取失败')
                            this._closeModal()
                        }else{
                            this.formModel = Object.assign({}, this.formModel, res.data)
                            this.articleFields.forEach(ele => {
                                if (ele.widget == 'CHECKBOX' || ele.widget == 'TAGS') {
                                    this.formModel[ele.name] = this.formModel[ele.name]?this.formModel[ele.name].split(','):null
                                }
                            })
                            this.getLog(this.formModel.uuid)
                            this.isReadOnly = false
                            this.hotword = false
                            this.topor = false
                            let { icon } = this.formModel
                            this.isProduct = icon ? true : false
                            // this.urlDisabled = url_main == '' || url_main == null? false : true
                            this.currVersion = res.data.version
                            if(v.formId == 32) {
                                this.queryQrCode()
                            }
                            showLoading(false)
                        }
                    })
                    this.getVersion(v.formId)
                } else if (v.type === 'view') {
                    this.customDetail({dataId: v.id, channelId: this.currentChannel.id, formId: v.formId}).then(res => {
                        if(!res.success){
                            showError('文章获取失败')
                            this._closeModal()
                        }else{
                            this.formModel = Object.assign({}, this.formModel, res.data)
                            this.articleFields.forEach(ele => {
                                if (ele.widget == 'CHECKBOX' || ele.widget == 'TAGS') {
                                    this.formModel[ele.name] = this.formModel[ele.name]?this.formModel[ele.name].split(','):null
                                }
                            })
                            this.getLog(this.formModel.uuid)
                            this.isReadOnly = true
                            this.hotword = true
                            this.sort = true
                            this.topor = true
                            // this.urlDisabled = true
                            this.currVersion = res.data.version
                            let { icon } = this.formModel
                            this.isProduct = icon ? true : false
                            if(v.formId == 32) {
                                this.queryQrCode()
                            }
                            showLoading(false)
                        }
                    })
                    this.getVersion(v.formId)
                } else if (v.type === 'add') {
                    this.formModel = Object.assign({url_main: ''}, v)
                    this.articleFields.forEach(ele => {
                        if (ele.def) {
                            if (ele.widget == 'CHECKBOX' || ele.widget == 'TAGS') {
                                this.formModel[ele.name] = ele.def?ele.def.split(','):null
                            } else {
                                this.formModel[ele.name] = ele.def
                            }
                        }
                        if (ele.widget == "DATETIME" || ele.widget == "DATE" || ele.widget == "TIME") {
                            if (ele.def == 'true') {
                                this.formModel[ele.name] = new Date().getTime()
                            } else {
                                this.formModel[ele.name] = ''
                            }
                        }
                        if (ele.type == "BOOL"){
                            if(ele.def){
                                this.formModel[ele.name] = ele.def=='false'?false:true
                            }
                        } 
                    })
                    this.formModel = JSON.parse(JSON.stringify(this.formModel))
                    this.isReadOnly = false
                    this.hotword = false
                    this.topor = false
                    // this.urlDisabled = false
                    let params = {
                        channelId: this.currentChannel.id
                    }
                    // 获取默认完整路径
                    this.getdefautChannel(params).then(res => {
                        if(res.success) {
                            this.formModel.url_main = res.data
                            this.formModel.url_part = this.getLastItem(res.data)
                        } else {
                            this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                        }
                    })
                }
            }
        },
    },
    created() {
        this.imageConfig.data.appid = this.appid
        this.editorImageConfig.data.appid = this.appid
    },
    methods: {
        ...mapActions("cms", ["imageUpload", "fileUpload"]),
        ...mapActions('authen', ['getReviewerLog']),
        ...mapActions("cms/article/articleList", [
            "getArticleList",
            "collation",
            "replaceHotword",
            "articleAudit",
            "saveCustomArticle",
            "currenDel",
            "customDetail",
            "previewForm",
            "getVersionlist",
            "getQRcode",
            "getgenerateCode",
            "getdefautChannel"
        ]),
        // 获取版本列表
        getVersion(formId){
            this.getVersionlist({formUid: this.formUid, channelId: this.currentChannel.id,formId:formId}).then(res => {
                if(res.data.length){
                    this.historyArr = res.data
                    this.currVersion = res.data[0].version
                    this.historyArr.forEach((item,index)=>{
                        if(index==0){
                            item.disable = true
                        }else{
                            item.disable = false
                        }
                    })
                }
            })
        },
        // 修改文章路径
        parturlChanges(){
            let tmainPath = this.formModel.url_main.split('/')
            let lastpath = tmainPath.at(-1)
            let othertmp = lastpath.indexOf('#') != -1 ? `#${lastpath.split('#')[1]}` : lastpath.indexOf('?') != -1 ? `?${lastpath.split('?')[1]}` : ''
            tmainPath.splice(tmainPath.length-1, 1, `${this.formModel.url_part}${othertmp}`)
            this.formModel.url_main = tmainPath.join('/')
        },
        // 修改完整路径
        mainurlChanges() {
            let tmainPath = this.formModel.url_main.split('/')
            let lastpath = tmainPath.at(-1)
            let othertmp = lastpath.indexOf('#') != -1 ? lastpath.split('#')[0] : lastpath.indexOf('?') != -1 ? lastpath.split('?')[0] : lastpath || ''
            console.log('othertmp',othertmp)
            this.formModel.url_part = othertmp
        },
        getLastItem(thePath){
            return thePath ? thePath.substring(thePath.lastIndexOf('/') + 1) : thePath
        },
        changeVesion(item,i){
            showLoading(true, '文章数据加载中...')
            this.customDetail({dataId: item.id, channelId: this.currentChannel.id, formId: this.formId}).then(res => {
                this.currVersion = item.version
                this.formModel = Object.assign({}, this.formModel, res.data)
                this.articleFields.forEach(ele => {
                    if (ele.widget == 'CHECKBOX' || ele.widget == 'TAGS') {
                        this.formModel[ele.name] = this.formModel[ele.name]?this.formModel[ele.name].split(','):null
                    }
                })
                this.getLog(this.formModel.uuid)
                if(this.formType == 'view'){
                    this.isReadOnly = true
                    this.hotword = true
                    this.sort = true
                    this.topor = true
                }else{
                    this.isReadOnly = false
                    this.hotword = false
                    this.topor = false
                }
                this.historyArr.forEach((item,index)=>{
                    if(index==i){
                        item.disable = true
                    }else{
                        item.disable = false
                    }
                })
                showLoading(false)
            })
        },
        // 获取编辑器内容
        getEditorData(name) {
            var ref = 'ck_' + name
            return this.$refs[ref][0].getData()
        },
        queryQrCode() {
            let params = {
                id: this.formModel.uuid
            }
            this.getQRcode(params).then(res => {
                console.log('getqrcde', res)
                if(res.success) {
                    this.qrcodeurl = res.data
                }
            })
        },
        // 生成二维码
        generateQRCode () {
            let {id, url_main, name } = this.formModel
            if(!url_main) return this.$message.warning('请填写完整地址！')
            let params = {
                id: id,
                urlMain: url_main,
                name: name
            }
            this.getgenerateCode(params).then(res => {
                if(res.success) {
                    this.queryQrCode()
                    this.$message.success(res.data||'操作成功!')
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
            
        },
        
        // 校验方法
        _checkForm() {
            var result = null
            this.articleFields.forEach(ele => {
                var ref = 'msg_' + ele.name
                if (ele.required && (ele.widget == 'ATTACH' || ele.widget == 'IMAGE')) {
                    if (!this.formModel[ele.name]) {
                        this.$refs[ref][0].innerHTML = ele.title + "不能为空"
                        result = true
                    } else {
                        this.$refs[ref][0].innerHTML = ""
                        result = false
                        if (!this.formModel[ele.name].length) {
                            this.$refs[ref][0].innerHTML = ele.title + "不能为空"
                            result = true
                        }
                    }
                }
            })
            return result
        },
        // 保存文章
        _saveArticle(saveType) {
            this.articleFields.forEach(ele => {
                if (ele.widget == "RICHTEXT") this.formModel[ele.name] = this.getEditorData(ele.name)
            })
            this.$refs.editForm.validate(async valid => {
                if (!valid) {
                    return false;
                }
                if (this._checkForm()) {
                    return false
                }
                if (this.tagList.length !== 0 && !this.formModel.tag) {
                    showError('请选择标签')
                    return false
                }
                let { icon='', description='', page_flag='0', url_main='' } = this.formModel
                if(this.isProduct) {
                    
                    if(icon == '') return showError('产品图标不能为空')
                    if(description == '') return showError('产品描述不能为空')
                }
                if(page_flag == '1' && url_main == '') return showError('完整路径不能为空')
                
                // 保存文章
                let formData = JSON.parse(JSON.stringify(this.formModel));
                Object.keys(this.formModel).forEach(v => {
                    let value = this.formModel[v];
                    if (value instanceof Array) {
                        if (typeof (value[0]) !== 'object' && typeof (value[0]) !== 'undefined') {
                            // 拼接数组
                            formData[v] = value == '[]' ? null : value.join(",");
                        } else if(!value.length){
                            formData[v] = null
                        }
                    }
                });

                let res = await this.saveCustomArticle({
                    param: formData,
                    channelId: this.currentChannel.id,
                    dataId: this.data ? this.data.id : "",
                    appId: this.appid,
                    formId: this.from.formId,
                    saveType
                });
                if (res.success) {
                    showMessage(res.errMsg)
                    this._closeModal();
                    showLoading(true, "文章查询中...");
                    this.formModel = {}
                    // 获取文章列表
                    this.getArticleList({
                        formId: this.from.formId,
                        channelId: this.currentChannel.id,
                        page: 1,
                        limit: 30
                    });
                } else {
                    this.$message.error(res.errMsg);
                }
            });
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
        // 预览
        commonPrev() {
            this.$refs.editForm.validate(async valid => {
                if (!valid) {
                    return false;
                }
                this.previewShow = true
            })
        },
        async _preview() {
            this.$refs.editForm.validate(async valid => {
                if (!valid) {
                    return false;
                }
                if (this._checkForm()) {
                    return false
                }
                showLoading(true, "正在生成预览...")
                this.formModel["type"] = "10"
                let formData = JSON.parse(JSON.stringify(this.formModel));
                let data = await this.previewForm({
                    param: formData,
                    channelId: this.currentChannel.id,
                    dataId: this.data ? this.data.id : "",
                    appId: this.appid,
                    formId: this.from.formId,
                    saveType: 1
                })
                if (data.success) {
                    const oLink = document.createElement("a")
                    oLink.href = data.data
                    oLink.target = "_blank"
                    oLink.click()
                    showLoading(false)
                } else {
                    showError(data.errMsg)
                    showLoading(false)
                }
            })
        },
        retract(){
            this.collect = !this.collect
        },

        // 获取文章正文的图片id
        _getContent(data) {
            this.contentIds = [...new Set([...this.contentIds, data.id])];
        },

        // 选择文件
        _selectFile(file) {
            this.file = file;
        },
        // 删除上传文件
        _removeImage(name, val) {
            if (!this.isReadOnly) {
                this.formModel[name].splice(val, 1)
                this.$forceUpdate()
            } else {
                this.$message({
                    message: '查看状态下不可修改',
                    type: 'warning'
                });
            }
        },
        dateTime(name) {
            this.formModel[name] = new Date(this.formModel[name]).getTime()
        },
        // 上传文章缩略图
        async _uploadThumbnail(v) {
            // BASE64Helper.imgMd5(this.file.raw)  // 918
            BASE64Helper.imgMd5(this.file).then(async _file => {
                // var name = v.data.name // 918
                var name = v.index.name
                let {data} = await this.imageUpload({
                    file: _file,
                    type: "15",
                    appid: this.appid
                });
                if (data.success) {
                    if (!this.formModel[name]) {
                        this.formModel[name] = [{
                            id: data.data.id,
                            file: data.data.file,
                            url: data.data.url,
                            origin: data.data.origin
                        }]
                    } else {
                        this.formModel[name].push(
                            {
                                id: data.data.id,
                                name: data.data.file,
                                url: data.data.url,
                                origin: data.data.origin
                            })
                    }
                    this.$forceUpdate()
                } else {
                    this.$message.error(data.errMsg || '上传失败，请重新上传')
                }
            })
        },
        NumberChange(l, name, j) {
            let len = String(parseInt(this.formModel[name]))
            if (len.length > (l - j)) {
                this.formModel[name] = len.substr(0, l - j) * 1
            }
        },
        // 上传附件
        async _uploadFile(uploadData) {
            const {file, onError} = uploadData;
            BASE64Helper.imgMd5(file).then(async _file => {
                var name = uploadData.data.name
                try {
                    let {data} = await this.fileUpload({
                        file: _file,
                        type: "16",
                        appid: this.appid
                    });
                    if (data.success) {
                        if (!this.formModel[name]) {
                            this.formModel[name] = [{
                                id: data.data.id,
                                name: data.data.file,
                                url: data.data.url,
                                origin: data.data.origin
                            }]
                        } else {
                            this.formModel[name].push(
                                {
                                    id: data.data.id,
                                    name: data.data.file,
                                    url: data.data.url,
                                    origin: data.data.origin
                                })
                        }
                        this.$forceUpdate()
                    }
                } catch (error) {
                    onError(error);
                }
            })
        },
        onSuccess(response) {
            this.formModel["_random"] = new Date().getTime();
        },
        // 热词替换
        async _replaceHotword() {
            showLoading(true, "加载中...");
            let data = await this.replaceHotword({
                word: this.getEditorData(),
                appid: this.appid
            });
            showLoading(false);
            this.formModel.content = data;
        },
        // 重置表单
        _resetForm() {
            this.articleFields.forEach(ele => {
                if (ele.widget == "RICHTEXT") {
                    this.$refs['ck_' + ele.name][0].setData('')
                }
            })
            this.collect = false;
            this.currVersion = ''
            this.idea = "";
            this.$refs.editForm.resetFields();
            this.isShowShortTitle = false;
            this.isShowSubTitle = false;
            this.isShowViewTitle = false;
            this.contentIds = [];
            this.formModel = {};
            this.formExtraData = {};
            this.historyArr = []
            this.isProduct = false
        },

        // 关闭弹框
        _closeModal() {
            this.$emit("input", false);
            this.$emit("close");
            this._resetForm()
            showLoading(false)
        },
        _lookPrdFeature() {
        //     console.log('this.currentChannel', this.currentChannel)
            let {formList, pid, id} = this.currentChannel
            if(this.includeId.includes(pid) || id == 412) {
                let dis = formList.filter((item) => item.formId == 22)
                // console.log('dis',dis)
                // console.log('this.formModel-------------',this.formModel)
                let onlyVal = ''
                if(id == 412) {
                    onlyVal = this.formModel.hasOwnProperty("prdlx")&&this.formModel.prdlx.length > 0 ?  this.formModel.prdlx[0] : ''
                } else {
                    onlyVal = this.formModel.hasOwnProperty("onlyval") ?  this.formModel.onlyval : ''
                }
                // console.log('onlyVal',onlyVal)
                this.$emit('checkFormTab', dis[0], onlyVal)
                this._closeModal()
            }
        },
        // tabs点击事件
        tabsClick(tab) {
            var name = tab.name
            switch (name) {
            case 'second':
                this.tabType = 'INFO::EDIT:NEW'
                break
            case 'third':
                this.tabType = 'INFO::PUBLISH'
                break
            case 'fourth':
                this.tabType = 'INFO::AUDIT:ADOPT_____INFO::AUDIT:REJECT'
                break
            case 'five':
                this.tabType = 'INFO::REVOKE'
                break
            }
            this.reviewerList1 = []
            if (!isArray(this.reviewerList)) {
                return false
            }
            this.reviewerList.forEach(element => {
                if (this.tabType.includes(element.type)) {
                    this.reviewerList1.push(element)
                }
            });
        },
        getLog(id){
            this.getReviewerLog({id}).then(result => {
                this.reviewerList = result
            })
        },
        expandVersion(){
            if(this.historyArr.length>=5){
                this.ifexpand = !this.ifexpand
            }
        }
    }
};
</script>

<style lang="scss" scoped>
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
.add-custom-article {
    .el-dialog__header {
        padding-top: 10px;
    }

    .add_form {
        padding-bottom: 50px;
    }

    .el-dialog__body {
        padding: 10px 20px;
    }

    .extra-wrapper {
        padding: 0 25px;
    }

    .bottom-btn-wrapper {
        position: fixed;
        bottom: 0px;
        width: 100%;
        left: 0px;
        background: #f5f5f5;
        padding: 20px 100px;
        border-top: 1px solid $border-color;
        z-index: 998;
    }

    .title-select {
        .el-select {
            .el-input {
                width: 100px;
            }
        }
    }

    .title-color {
        margin-right: 15px;
        vertical-align: middle;
    }

    .title-extra {
        margin-left: 10px;

        .el-form-item__content {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-left: 0px !important;
        }

        .el-checkbox {
            margin-left: 15px;
            margin-right: 0;
        }
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 100%;
    }

    .upload-file {
        .el-upload {
            width: 100%;
        }
    }

    .btn-upload {
        position: relative;
        width: 100px;
        height: 100px;
        border: 1px dashed $border-color;
        border-radius: 5px;

        img {
            max-width: 100%;
            max-height: 100%;
        }

        .el-icon-plus {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 30px;
            transform: translate(-50%, -50%);
        }
    }

    .audit {
        height: 300px;
        border: 1px solid #dcdfe6;
        overflow: auto;
        margin: 0 auto;
        margin-bottom: 20px;
        border-radius: 5px;

        /deep/ .el-collapse-item__header {
            height: 36px !important;
        }

        /deep/ .el-collapse-item__content {
            padding-bottom: 10px;
        }
    }

    /deep/ .btn-upload {
        display: flex;
        align-items: center;
    }

    /deep/ .el-input__prefix {
        display: none;
    }

    .show-word-limit {
        /deep/ .el-input__inner {
            padding-right: 15px;
        }
    }

    .cke_widget_wrapper {
        /deep/ .cke_widget_drag_handler_container {
            width: 0 !important;
        }
    }

    .el-upload__tip {
        border: 1px solid #000;
        width: 800px;
        height: 30px;
    }
}
.qrcode{
    width: 140px;
    height: 140px;
    padding: 5px;
    border: 1px solid #DCDFE6;
    img{
        width: 100%;
    }
}
.upload-picture{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    font-size: 28px;
    color: #8c939d;
    line-height: 146px;
    text-align: center;
    outline: none;
    vertical-align: top;
}
.source-dialog {
    height: 600px;
}

.isActive {
    background: green !important;
    color: #fff !important;
}

/deep/ .el-form-item__error {
    position: relative;
}

/deep/ .el-form-item.is-error {
    margin-bottom: 5px;
}

.choose-source {
    /deep/ .table-row {
        height: 450px !important;
        overflow: auto !important;
    }

    .article-source-footer {
        border-top: 1px solid #999;
        padding-top: 15px;
    }
}

/deep/ .checkItem {
    .msgerr {
        font-size: 12px;
        color: #ff4949;
        position: absolute;
        margin-top: -5px;
    }

    > label {
        &::before {
            color: #ff4949;
            content: "*";
            margin-right: 4px;
        }

        &::after {
            color: #ff4949;
            position: absolute;
            top: 100%;
            left: 150px;
            line-height: 1;
            font-size: 12px;
            content: "";
        }
    }
}

.form_it {
    position: relative;

    .upload_img {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        width: 148px;
        height: 148px;

        > img {
            width: 100%;
            height: 100%;
            display: block;
        }

        > i {
            display: none;
        }

        &:hover {
            > img {
                opacity: .5;
                cursor: pointer;
            }

            > i {
                display: block;
                position: absolute;
                width: 100%;
                left: 0;
                top: 35%;
                cursor: pointer;
                text-align: center;
                font-size: 40px;
                color: #ff4949;
            }
        }
    }

    .upload_File {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > span {
            width: 270px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        > i {
            cursor: pointer;

            &:hover {
                color: #ff4949;
            }
        }
    }
}

/deep/ .el-input-number {
    width: 100%;

    input {
        text-align: left;
    }
}
.collect_ac,
.collect{
    position: relative;
    width: 100%;
    >div{
        position: absolute;
        cursor: pointer;
        user-select: none;
        left: -30px;
        top: 30vh;
        width: 20px;
        padding: 10px 0;
        text-align: center;
        background: #f5f7fa;
    }
}
.row_coll{
    width: 100%;
    padding-right: 20px;
    transition:width .5s;
}
.row_col{
    width: 0;
    transform: translateX(30px);
    transition:width .5s;
    margin: 0;
}
.historyBox{
    margin:15px 0px !important;
    display: flex;
}
.historyList{
    display:flex;
    flex-wrap: wrap;
    width:65%;
    margin-left:20px !important;
    align-items: center;
    height: 50px;
    overflow: hidden;
}
.historyActive{
    width:66%;
    height:100px;
    overflow-y: scroll;
}
.tips{
    font-size: 12px;
    span{
        color: #ff4949;
    }
}
</style>
<style lang="scss">
    .from-color-picker .el-color-predefine__color-selector > div {
        border: 1px dashed #ccc;
    }
</style>
