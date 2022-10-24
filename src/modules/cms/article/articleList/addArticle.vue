<!-- eslint-disable  -->
<template>
    <div>
    <Modal
        :visible="value"
        :title="title + (articleId ? articleId : '') +'　　'+ (currVersion?'当前版本：'+currVersion:'')"
        width="100%"
        fullscreen
        :close-on-press-escape="false"
        custom-class="article-add-wrapper"
        @close="_closeModal"
    >
        <el-form
            ref="editForm"
            :model="formModel"
            :rules="formRules"
            label-width="80px"
            size="mini"
        >
            <el-row class="content">
                <el-col :span="17" :class="collect?'row_coll':''">
                    <el-row>
                        <el-col :span="17">
                            <el-form-item
                                label="标题"
                                prop="title"
                            >
                                <el-input
                                    ref="titleInp"
                                    v-model="formModel.title"
                                    :readonly="isReadOnly"
                                    maxlength="100"
                                    show-word-limit
                                    class="title-select"
                                >
                                    <template #prepend>
                                        <el-select
                                            v-model="formModel.type"
                                            :disabled="isReadOnly"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item, index) in articleType"
                                                :key="index"
                                                :label="item"
                                                :value="+index"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                    <!--                                    <div slot="suffix" style="margin-left: 20px">{{formModel.title.length}}/100</div>-->
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col
                            :span="7"
                            justify="end"
                        >
                            <el-form-item
                                label=""
                                class="title-extra"
                                align="right"
                            >
                                <!-- <color-picker
                                    v-model="formModel.titleColor"
                                    :disabled="isReadOnly"
                                /> -->
                                <el-checkbox
                                    v-model="isShowSubTitle"
                                    :disabled="isReadOnly"
                                >副标题
                                </el-checkbox>
                                <el-checkbox
                                    v-model="isShowShortTitle"
                                    :disabled="isReadOnly"
                                >短标题
                                </el-checkbox>
                                <el-checkbox
                                    v-model="isShowViewTitle"
                                    :disabled="isReadOnly"
                                >显示标题
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="17">
                            <el-form-item
                                v-show="isShowSubTitle"
                                label="副标题"
                                prop="subTitle"
                            >
                                <el-input
                                    v-model="formModel.subTitle"
                                    maxlength="100"
                                    show-word-limit
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="17">
                            <el-form-item
                                v-show="isShowShortTitle"
                                label="短标题"
                                prop="shortTitle"
                            >
                                <el-input
                                    v-model="formModel.shortTitle"
                                    maxlength="50"
                                    show-word-limit
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="17">
                            <el-form-item
                                v-show="isShowViewTitle"
                                label="显示标题"
                                prop="showTitle"
                            >
                                <el-input
                                    v-model="formModel.showTitle"
                                    maxlength="100"
                                    show-word-limit
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item
                        v-if="formModel.type === 2"
                        label="附件"
                    >
                        <el-upload
                            action
                            class="upload-file"
                            :disabled="isReadOnly"
                            :multiple="false"
                            :show-file-list="false"
                            :on-change="_selectFile"
                            :http-request="_uploadFile"
                        >
                            <div v-if="formModel.attach">
                                <el-input slot="trigger" v-model="formModel.attach.url" readonly>
                                    <template #append>
                                        <a style="color: #606266;" :href="formModel.attach.url" target="_blank" rel="noopener noreferrer">浏览</a>
                                    </template>
                                </el-input>
                            </div>
                            <div v-else>
                                <el-button style="width:100%;">选择文件</el-button>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item
                        v-if="formModel.type === 3"
                        label="跳转链接"
                        prop="url"
                    >
                        <el-input
                            v-model="formModel.url"
                            :readonly="isReadOnly"
                        ></el-input>
                    </el-form-item>

                    <el-form-item
                        label="正文内容"
                        prop="content"
                    >
                        <CK-editor
                            v-if="value"
                            ref="ckeditor"
                            v-model="formModel.content"
                            :readonly="isReadOnly || formModel.type !== 1"
                            :config="editorConfig"
                            :upload-image-config="editorImageConfig"
                            @on-uploaded="_getContent"
                        >
                            <!-- <template #btn>
                                <el-button
                                    :disabled="hotword"
                                    @click="_replaceHotword"
                                >热词替换</el-button>
                            </template> -->
                        </CK-editor>
                    </el-form-item>
                    <!-- 历史版本-->
                    <div class="historyBox">
                       <span style="font-weight:bold;line-height:46px">历史版本</span>
                       <div :class="ifexpand?'historyList':'historyList historyActive'">
                           <el-button v-for="(item,index) in historyArr" :key="index" :style="!item.version?'':'margin:5px;width:200px'" :disabled="item.disable" @click="changeVesion(item,index)">{{!item.version?'无':item.version}}</el-button>
                        </div>
                        <el-tooltip v-if="historyArr.length>=5" class="item" effect="dark" :content="ifexpand?'点击展开历史版本数据':'点击收起历史版本数据'" placement="right-start">
                            <i :class="ifexpand?'el-icon-circle-plus':'el-icon-remove'" style="cursor:pointer;margin-top:17px" @click="expandVersion"></i>
                        </el-tooltip>
                    </div>
                    <el-form-item class="bottom-btn-wrapper" style="marginBottom: 80px;">
                        <el-button
                            v-if="title !== '新增文章' && title !== '修改文章' && title !== '查看文章'"
                            size="medium"
                            :disabled="isReadOnly"
                            style="margin-right:10px"
                            @click="_saveArticle(3)"
                        >保存并发布
                        </el-button>
                        <el-button size="medium" :disabled="isReadOnly" style="margin-right:10px" @click="_saveArticle(2)">保存并关闭</el-button>
                        <el-button size="medium" :disabled="isReadOnly" @click="_saveArticle(1)">保存草稿</el-button>
                        <!-- <el-button size="medium" @click="commonPrev">预览</el-button> -->
                        <el-button size="medium" @click="_closeModal">关闭</el-button>
                    </el-form-item>
                    <el-form-item v-if="articleId" label="操作记录">
                        <el-tabs v-model="activeName" @tab-click="tabsClick">
                            <el-tab-pane label="全部" name="first">
                                <el-table height="270" :data="reviewerList" style="width: 100%">
                                    <el-table-column label="日期" width="180">
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column prop="oper" label="操作人" width="180" />
                                    <el-table-column prop="description" label="描述" />
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="新增" name="second">
                                <el-table height="270" :data="reviewerList1" style="width: 100%">
                                    <el-table-column label="日期" width="180">
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column prop="oper" label="操作人" width="180" />
                                    <el-table-column prop="description" label="描述" />
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="发布" name="third">
                                <el-table
                                    height="270" :data="reviewerList1" style="width: 100%">
                                    <el-table-column label="日期" width="180">
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column prop="oper" label="操作人" width="180" />
                                    <el-table-column prop="description" label="描述" />
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="审核" name="fourth">
                                <el-table height="270" :data="reviewerList1" style="width: 100%">
                                    <el-table-column label="日期" width="180">
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column prop="oper" label="操作人" width="180" />
                                    <el-table-column prop="description" label="描述" />
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="撤稿" name="five">
                                <el-table height="270" :data="reviewerList1" style="width: 100%">
                                    <el-table-column label="日期" width="180">
                                        <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                    </el-table-column>
                                    <el-table-column prop="oper" label="操作人" width="180" />
                                    <el-table-column prop="description" label="描述" />
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form-item>
                </el-col>
                <!-- 右侧扩展属性 -->
                <el-col
                    :span="7"
                    :class="collect?'row_col':'extra-wrapper'"
                >
                    <div :class="collect?'collect_ac':'collect'">
                        <div @click="retract">
                            <i :class="collect?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"></i>
                            <span>{{collect?'展开':'收起'}}</span>
                        </div>
                    </div>
                    <el-collapse v-model="activeCollapse">
                        <el-collapse-item
                            title="基本属性"
                            name="1"
                        >
                            <el-form-item
                                label="作者"
                                prop="author"
                            >
                                <el-input
                                    v-model="formModel.author"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="主页面" prop="pageFlag">
                                <el-select
                                    v-model="formModel.pageFlag"
                                    placeholder="请选择"
                                    class="w100"
                                >   
                                    <el-option label="非主页面" :value="0"></el-option>
                                    <el-option label="主页面" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文章路径" prop="urlPart">
                                <el-input v-model="formModel.urlPart" maxlength="50"
                                :disabled="isReadOnly" @input="parturlChanges" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="完整路径" prop="urlMain">
                                <el-input v-model="formModel.urlMain" maxlength="300"
                                :disabled="isReadOnly" @input="mainurlChanges" show-word-limit></el-input>
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
                            
                            <el-form-item prop="keyword">
                                <template #label>
                                    关键词
                                    <el-tooltip content="每个关键词以英文逗号隔开">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </template>
                                <el-input
                                    v-model="formModel.keyword"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="summary">
                                <template #label>
                                    摘要
                                    <el-tooltip content="点击自动生成摘要">
                                        <i
                                            class="el-icon-circle-plus"
                                            @click="_createSummary"
                                        ></i>
                                    </el-tooltip>
                                </template>
                                <el-input
                                    v-model="formModel.summary"
                                    :readonly="isReadOnly"
                                    type="textarea"
                                    :rows="4"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                v-if="data.type !== 'add'"
                                label="创建时间"
                                prop="compileTime"
                            >
                                <el-date-picker
                                    v-model="formModel.compileTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    disabled
                                    value-format="timestamp"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item
                                label="显示时间"
                                prop="showTime"
                            >
                                <el-date-picker
                                    v-model="formModel.showTime"
                                    type="datetime"
                                    placeholder="选择显示时间"
                                    value-format="timestamp"
                                    :disabled="isReadOnly"
                                >
                                </el-date-picker>
                            </el-form-item>
                            
                            <el-form-item
                                label="下线时间"
                                prop="offlineTime"
                            >
                                <el-date-picker
                                    v-model="formModel.offlineTime"
                                    type="datetime"
                                    placeholder="选择下线时间"
                                    value-format="timestamp"
                                    :disabled="isReadOnly"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <!-- <el-form-item
                                label="来源"
                                prop="source"
                                class="source-wrapper"
                            >
                                <el-input
                                    v-model="formModel.source.name"
                                    :readonly="isReadOnly || isShowSource"
                                    @focus="!isReadOnly && (isShowSource = true)"
                                ></el-input>
                            </el-form-item> -->
                           
                            <el-form-item
                                label="所属频道"
                                prop="channelName"
                            >
                                <el-input
                                    v-model="formModel.channelName"
                                    disabled
                                ></el-input>
                            </el-form-item>
                            <!--
                            <el-form-item
                                label="部门"
                                prop="articleOrg"
                            >
                                <el-select
                                    v-model="formModel.org"
                                    placeholder="请选择"
                                    class="w100"
                                    :disabled="isReadOnly"
                                    clearable
                                >
                                    <el-option
                                        v-for="(text, key) in articleOrg"
                                        :key="key"
                                        :label="text"
                                        :value="Number(key)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            -->
                        </el-collapse-item>

                        <el-collapse-item
                            title="高级属性"
                            name="2"
                        >
                            <el-form-item
                                label="是否置顶"
                                prop="top"
                            >
                                <el-radio-group
                                    v-model="formModel.top"
                                    :readonly="isReadOnly"
                                    :disabled="topor"
                                >
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!-- <el-form-item label="排序位置" >
                                <el-radio
                                    v-model="formModel.sortFlag"
                                    :disabled="isReadOnly"
                                    label="null"
                                    @change="_selectRadio('null')"
                                >
                                    原始位置
                                </el-radio>
                                <div>
                                    <el-radio
                                        v-model="formModel.sortFlag"
                                        :disabled="isReadOnly"
                                        label="other"
                                        @change="_selectRadio('other')"
                                    >
                                        某一文章之前
                                    </el-radio>
                                    <el-select v-model="formModel.sortId" :disabled="sort" prop="sortId">
                                        <el-option
                                            v-for="item in list"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-form-item> -->
                            <el-form-item
                                label="选择模版"
                                prop="detailTemplateId"
                            >
                                <el-select
                                    v-model="formModel.detailTemplateId"
                                    placeholder="请选择"
                                    class="w100"
                                    :disabled="isReadOnly"
                                >
                                    <el-option
                                        v-for="item in detailTemplate"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="+item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="标题图片"
                            >
                                <el-upload
                                    action
                                    :disabled="isReadOnly"
                                    :multiple="false"
                                    :show-file-list="false"
                                    :on-change="_selectFile"
                                    :http-request="_uploadThumbnail"
                                >
                                    <div
                                        v-loading="loading"
                                        class="btn-upload"
                                    >
                                        <img
                                            v-if="formModel.photo"
                                            :src="formModel.photo.url"
                                            alt=""
                                        >
                                        <i
                                            v-else
                                            class="el-icon-plus"
                                        ></i>
                                    </div>
                                </el-upload>
                            </el-form-item>
                            <!--
                            <el-form-item
                                label="引用标记"
                                prop="code"
                            >
                                <div v-if="!isReadOnly">
                                    <el-input
                                        v-model="formModel.code"
                                        :disabled="isReadOnly"
                                        maxlength="50"
                                        show-word-limit
                                    ></el-input>
                                </div>
                                <div
                                    v-else
                                    class="show-word-limit"
                                >
                                    <el-input
                                        v-model="formModel.code"
                                        :disabled="isReadOnly"
                                    ></el-input>
                                </div>
                            </el-form-item>
                            -->
                        </el-collapse-item>

                        <el-collapse-item
                            title="扩展属性"
                            name="3"
                        >
                            <el-form-item
                                label="扩展字段1"
                                :prop="formModel.bak01"
                            >
                                <el-input
                                    v-model="formModel.bak01"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="扩展字段2"
                                :prop="formModel.bak02"
                            >
                                <el-input
                                    v-model="formModel.bak02"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="扩展字段3"
                                :prop="formModel.bak03"
                            >
                                <el-input
                                    v-model="formModel.bak03"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="扩展字段4"
                                :prop="formModel.bak04"
                            >
                                <el-input
                                    v-model="formModel.bak04"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="扩展字段5"
                                :prop="formModel.bak05"
                            >
                                <el-input
                                    v-model="formModel.bak05"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            <!-- <el-form-item
                                v-for="item in [1,2,3,4,5]"
                                :key="item"
                                :label="`扩展字段${item}`"
                                :prop="`bak0${item}`"
                            >
                                <el-input
                                    v-model="formModel[`bak0${item}`]"
                                    :readonly="isReadOnly"
                                ></el-input>
                            </el-form-item>
                            -->
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
            </el-row>
        </el-form>
        <Modal
            :visible="isShowSource"
            title="选择来源"
            width="80%"
            top="3%"
            append-to-body
            custom-class="source-dialog"
            @close="isShowSource = false"
        >
            <Source
                v-show="isShowSource"
                class="choose-source"
                selection
                :source-id="1"
                :ok="_chooseSource"
                :cancel="() => (isShowSource = false)"
            />
        </Modal>
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
import Source from '@/modules/cms/settings/article/source/index'
import {mapState, mapGetters, mapActions} from 'vuex'
import {showLoading, showMessage} from '@/utils/'
import {matchTemplateUrl, matchEmoji, pathUrl, pathUrlMain} from '@/utils/RegExpUtil'
import {isArray} from '@/utils/BaseUtil'
import {BASE64Helper} from '@/utils/CryptUtil'
import {showError} from '../../../../utils'
import mobileMoadel from "./mobileModel/mobileModel.vue"
import zhIcons from '../api/icondata'
/* eslint-disable */
export default {
    name: 'AddArticle',
    components: {
        Source,
        mobileMoadel
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: () => {
            }
        },
        // hotword: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data() {
        return {
            tabType: [],
            reviewerList: [],
            reviewerList1: [],
            activeName: 'first',
            auditPass: false,
            collect: false,
            record: ['1'],
            articleId: '',
            audit: '',
            idea: '',
            topor: false,
            sort: true,
            radio: 'null',
            loading: false,
            isShowSource: false, // 是否显示来源
            isReadOnly: false,
            isShowShortTitle: false,
            isShowSubTitle: false,
            isShowViewTitle: false,
            activeCollapse: ['1', '2','3', 'audit'], // 默认展开右侧基本属性、高级属性
            orgTemplate: [],
            file: {}, // 当前选中的文件
            editorConfig: {
                removeButtons: ['Paste', 'PasteText', 'PasteFromWord', 'Maximize'],
                height: '450px'
            },
            //上传图片
            editorImageConfig: {
                url: `${process.env.VUE_APP_REQUEST_BASE_API}/cms/attach/upload/file`,
                data: {
                    module: '13'
                }
            },
            formModel: {
                type: 1,
                title: '',
                titleColor: '#000000',
                showTitle: '',
                subTitle: '',
                shortTitle: '',
                author: '',
                source: {
                    id: '',
                    name: ''
                },
                keyword: '',
                summary: '',
                photo: {},
                top: 0,
                content: '',
                attach: {},
                url: '',
                pageFlag: 0,
                urlPart:'',
                urlMain:'',
                icon: '',
                description: '',
                bak01: '',
                bak02: '',
                bak03: '',
                bak04: '',
                bak05: '',
                compileTime: '',
                showTime: '',
                offlineTime: '',
                hasPicture: '',
                detailTemplateId: '',
                channelName: '',
                sortId: '',
                sortFlag: 'null',
                auditHistory: [],
                code: '',
                org: '',
            },
            currVersion:'',
            historyArr:[],
            ifexpand:true,
            formExtraData: {},
            contentIds: [],
            formRules: {
                title: [
                    {required: true, message: '请输入文章标题', trigger: 'blur'},
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb('不能输入非法字符') : cb()
                        },
                        trigger: 'blur'
                    }
                ],
                code: [
                    {
                        validator(rule, value, cb) {
                            return matchEmoji(value) ? cb('不能输入非法字符') : cb()
                        },
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            return value && !/^[0-9a-zA-Z]*$/g.test(value) ? callback(new Error('只能输入数字和英文字母')) : callback()
                        },
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        validator: (rule, value, cb) => {
                            if (this.formModel.type === 1) {
                                value = this.getEditorData()
                                if (value) {
                                    return matchEmoji(value) ? cb('不能输入非法字符') : cb()
                                } else {
                                    return cb('请输入文章正文')
                                }
                            } else {
                                return cb()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                pageFlag: [{required: true, message: '请选择是否主页面', trigger: 'blur'}],
                urlPart:[
                    // {required: true, message: '请输入文章路径', trigger: 'blur'},
                    {
                        validator: function (rule, value, callback) {
                            if (value && !pathUrl(value)) {
                                callback('路径以数字字母开头,允许数字字母下划线点-@#')
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                urlMain:[
                    // {required: true, message: '请输入完整路径', trigger: 'blur'},
                    {
                        validator: function (rule, value, callback) {
                            if (value && !pathUrlMain(value)) {
                                callback('路径以/开头,允许数字字母下划线点-@#=?')
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                attach: [{required: true, message: '附件不能为空', trigger: 'blur'}],
                url: [
                    {required: true, message: '链接不能为空', trigger: 'blur'},
                    {
                        validator(rules, value, cb) {
                            if(value.indexOf('/preview/')!=-1){
                                cb()
                            }
                            return matchTemplateUrl(value) ? cb() : cb(new Error('跳转链接格式以https://和http://开头'))
                        },
                        trigger: 'blur'
                    }
                ]
            },
            hotword: false,
            uuid:'',
            formUid:'',
            articalType:'',

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
            urlDisabled: false
        }
    },
    computed: {
        ...mapState('authen', ['userinfo']),
        ...mapState('cms/article', ['currentChannel']),
        ...mapState('cms/article/articleList', ['appid', 'list']),
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('cms/template', ['getTemplateById']),
        articleType() {
            return this.getDictionary('articleType')
        },
        detailTemplate() {
            return this.getTemplateById(4)
        },
        articleOrg() {
            return this.getDictionary("articleOrg");
        },
        icons() {
            return zhIcons
        },
    },
    watch: {
        value(v) {
            v && (this.formModel.author = this.userinfo.username)
        },
        'formModel.titleColor'(v) {
            this.$refs.titleInp.$el.querySelector('.el-input-group__prepend + input').style.color = v
        },
        'formModel.type'(v) {
            if (v === 2 || v === 3) {
                // this.formModel.content = ''
                this.$refs.ckeditor.setData('')
            }
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
                if (v.custom) {
                    return
                }
                this.articleId = v.id
                this.uuid = v.uuid
                this.formUid = v.formUid
                this.articalType = v.type
                // // 编辑文章时回显数据
                if (v.type === 'edit') {
                    this.activeCollapse = ['1', '2', '3']
                    showLoading(true, '文章数据加载中...')
                    this.viewArticle({id: v.id, channelId: this.currentChannel.id}).then(res => {
                        showLoading(false)
                        this.formModel = Object.assign({}, this.formModel, res)
                        this.isReadOnly = false
                        this.hotword = false
                        this.topor = false
                        let { icon } = this.formModel
                        this.isProduct = icon ? true : false
                        // this.urlDisabled = this.formModel.urlMain == '' ? false : true
                        this.isShowSubTitle = !!this.formModel.subTitle
                        if(!this.formModel.urlPart) {
                            this.formModel.urlPart = this.getLastItem(this.formModel.urlMain)
                        }
                            
                    })
                    this.getVersion()
                } else if (v.type === 'view') {
                    this.activeCollapse = ['1', '2', '3', 'audit']
                    showLoading(true, '文章数据加载中...')
                    this.viewArticle({id: v.id, channelId: this.currentChannel.id}).then(res => {
                        showLoading(false)
                        this.formModel = Object.assign({}, this.formModel, res)
                        this.isReadOnly = true
                        this.hotword = true
                        this.sort = true
                        this.topor = true
                        let { icon } = this.formModel
                        this.isProduct = icon ? true : false
                        this.isShowSubTitle = !!this.formModel.subTitle
                        // this.urlDisabled = true
                    })
                    this.getVersion()
                } else if (v.type === 'add') {
                    this.activeCollapse = ['1', '2', '3']
                    this.isReadOnly = false
                    this.formModel.channelName = this.currentChannel.name
                    this.hotword = false
                    this.topor = false
                    this.isShowSubTitle = !!this.formModel.subTitle
                    let params = {
                        channelId: this.currentChannel.id
                    }
                    this.getdefautChannel(params).then(res => { // 获取默认完整路径
                        if(res.success) {
                            this.formModel.urlMain = res.data
                            this.formModel.urlPart = this.getLastItem(res.data)
                        } else {
                            this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                        }
                    })
                    // this.urlDisabled = false
                } else if (v.type === 'audit') {
                    this.activeCollapse = ['1', '2', '3', 'audit']
                    showLoading(true, '文章数据加载中...')
                    this.viewArticle({id: v.id, channelId: this.currentChannel.id}).then(res => {
                        showLoading(false)
                        this.formModel = Object.assign({}, this.formModel, res)
                        this.isReadOnly = true
                        this.hotword = true
                        this.sort = true
                        this.topor = true
                        this.urlDisabled = true
                        this.isShowSubTitle = !!this.formModel.subTitle
                    })
                }

                if (v.type != 'add') {
                    this.getLog(v.uuid)
                }
            }
        }
    },

    methods: {
        ...mapActions('cms', ['imageUpload', 'fileUpload']),
        ...mapActions('authen', ['getReviewerLog']),
        ...mapActions('cms/article/articleList', [
            'getArticleList',
            'saveArticle',
            'viewArticle',
            'previewArticle',
            'collation',
            'replaceHotword',
            'articleAudit',
            'releaseArticle',
            'getVersionlist',
            'getdefautChannel'
        ]),
        getVersion(){
            this.getVersionlist({dataUid: this.uuid, formUid: "", channelId: this.currentChannel.id,formId:''}).then(res => {
                this.historyArr = res.data
                this.currVersion = res.data[0].version
                this.historyArr.forEach((item,index)=>{
                    if(index==0){
                        item.disable = true
                    }else{
                        item.disable = false
                    }
                })
            })
        },
        changeVesion(item,i){
            showLoading(true, '文章数据加载中...')
            this.viewArticle({id: item.id, channelId: this.currentChannel.id}).then(res => {
                this.currVersion = item.version
                this.formModel = Object.assign({}, this.formModel, res)
                if(this.articalType == 'view'){
                    this.isReadOnly = true
                }else{
                    this.isReadOnly = false
                }
                this.hotword = false
                this.topor = false
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
        // 获取审核记录列表
        getLog(id) {
            this.getReviewerLog({id}).then(result => {
                this.reviewerList = result
            })
        },
        getEditorData() {
            return this.$refs.ckeditor.getData()
        },
        setEditorData(data) {
            this.$refs.ckeditor.setData(data)
        },
        handleChange(val) {
        },
        // 修改文章路径
        parturlChanges(){
            let tmainPath = this.formModel.urlMain.split('/')
            let lastpath = tmainPath.at(-1)
            let othertmp = lastpath.indexOf('#') != -1 ? `#${lastpath.split('#')[1]}` : lastpath.indexOf('?') != -1 ? `?${lastpath.split('?')[1]}` : ''
            tmainPath.splice(tmainPath.length-1, 1, `${this.formModel.urlPart}${othertmp}`)
            // console.log('lastL', tmainPath)
            this.formModel.urlMain = tmainPath.join('/')
        },
        // 修改完整路径
        mainurlChanges() {
            let tmainPath = this.formModel.urlMain.split('/')
            let lastpath = tmainPath.at(-1)
            let othertmp = lastpath.indexOf('#') != -1 ? lastpath.split('#')[0] : lastpath.indexOf('?') != -1 ? lastpath.split('?')[0] : lastpath || ''
            console.log('othertmp',othertmp)
            this.formModel.urlPart = othertmp
        },
        getLastItem(thePath){
            return thePath ? thePath.substring(thePath.lastIndexOf('/') + 1) : thePath
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

        // 点击单选框发生的事件
        _selectRadio(type) {
            this.radio = type
            switch (type) {
                case 'null':
                    this.formModel.sortId = null
                    this.formModel.sortFlag = 'null'
                    this.sort = true
                    break
                case 'other':
                    this.formModel.sortFlag = 'other'
                    this.sort = false
                    break
            }
        },
        // 保存文章
        _saveArticle(saveType) {
            this.$refs.editForm.validate(valid => {
                if (!valid) {
                    return false
                }
                let { icon='', description='', pageFlag, urlMain } = this.formModel
                if(this.isProduct) {
                    if(icon == '') return showError('产品图标不能为空')
                    if(description == '') return showError('产品描述不能为空')
                }
                if(pageFlag == 1 && urlMain == '') return showError('完整路径不能为空')
                // var srcArr = []
                const _save = async () => {
                    let _List = false
                    // const content = this.getEditorData() // this.formModel.content
                    // content.replace(/<img [^>]*data-src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                    //     srcArr.push(capture)
                    // });
                    // var test = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                    //     return "<img src='https://img0.baidu.com/it/u=1783627040,2442271822&fm=26&fmt=auto&gp=0.jpg'"
                    // });
                    // console.log(test)
                    // this.setEditorData(test)
                    // var exp = /<img\b.*?(?:\>|\/>)/gi
                    // var src =  /\bdata-src\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i
                    // const imgArr = content.match(exp)
                    // for( var i = 0; i < imgArr.length; i++) {
                    //     srcArr.push(imgArr[i].match(src)[1])
                    // }
                    const content = this.getEditorData()
                    if (saveType !== 3) {
                        showLoading(true, '文章保存中...')
                        // 获取文章是否存在图片
                        let hasPicture = /<img/gi.test(content)
                        // 保存文章
                        await this.saveArticle({
                            ...this.formModel,
                            ...this.formExtraData,
                            content: content ? content.replace(/(<span\sstyle="color: #f00">)+([a-zA-Z\d\u4e00-\u9fa5]+)(<\/span>)+/g, '$2') : '',
                            contentId: this.contentIds.join(','),
                            source: this.formModel.source.id,
                            channelId: this.currentChannel.id,
                            id: this.data.id,
                            saveType,
                            hasPicture: +hasPicture
                        }).then(res => {
                            if (res.success) {
                                !this.data.id ? (this.data.id = res) : this.data.id
                                showMessage('文章保存成功！')
                                _List = true
                            } else {
                                showError(res.errMsg)
                            }
                        }).catch(function (err) {
                            console.error(err)
                        })
                    }
                    if (saveType === 3) {
                        showLoading(true, '文章保存中...')
                        // 获取文章是否存在图片
                        let hasPicture = /<img/gi.test(content)

                        // 保存文章
                        await this.saveArticle({
                            ...this.formModel,
                            ...this.formExtraData,
                            content: content ? content.replace(/(<span\sstyle="color: #f00">)+([a-zA-Z\d\u4e00-\u9fa5]+)(<\/span>)+/g, '$2') : '',
                            contentId: this.contentIds.join(','),
                            source: this.formModel.source.id,
                            channelId: this.currentChannel.id,
                            id: this.data.id,
                            saveType,
                            hasPicture: +hasPicture
                        }).then(res => {
                            if (res.success) {
                                !this.data.id ? (this.data.id = res) : this.data.id
                                showMessage('文章保存成功！')
                                _List = true
                            } else {
                                showError(res.errMsg)
                            }
                        })
                        // this.releaseArticle({
                        //     id: this.data.id,
                        //     channelId: this.currentChannel.id
                        // }).then(data => {
                        //     if (data.success) {
                        //         this.getArticleList({
                        //             channelId: this.currentChannel.id
                        //         })
                        //         showMessage('文章发布成功！')
                        //     } else {
                        //         this.$message({
                        //             message: `${data.errMsg}`,
                        //             type: 'warning'
                        //         })
                        //     }
                        // })
                    }

                    // 获取文章列表
                    if (_List) {
                        this._closeModal()
                        await this.getArticleList({
                            channelId: this.currentChannel.id,
                            page: 1,
                            limit: 30
                        })
                    }
                    showLoading(false)
                }
                _save()

            })
            // this.$refs.editForm.validate(async valid => {
            //     if (valid) {
            //         // 校对
            //         if (this.formModel.type === 1) {
            //             showLoading(true, '正在校对文章...')
            //             let collationResult = await this.collation({
            //                 content: this.formModel.content,
            //                 articleId: this.data.id,
            //                 appid: this.appid
            //             })

            //             // 判断是否存在错别字等
            //             if (collationResult && collationResult.length) {

            //                 // 遍历查找错别字并标记为红色
            //                 let content = this.formModel.content
            //                 collationResult.map(({ word }) => {
            //                     content = content.replace(new RegExp(`(${word})`, 'g'), '<span style="color: #f00">$1</span>')
            //                 })
            //                 this.formModel.content = content

            //                 this.$confirm('当前文章存在错别字或敏感词未修改，确认保存吗？', '警告', {
            //                     confirmButtonText: '确定',
            //                     cancelButtonText: '返回修改',
            //                     type: 'warning'
            //                 }).then(() => _save()).catch(() => showLoading(false))
            //             }else{
            //                 _save()
            //             }
            //         } else {
            //             _save()
            //         }
            //     }
            // })
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
                showLoading(true, '正在生成预览...')
                let data = await this.previewArticle({
                    ...this.formModel,
                    ...this.formExtraData,
                    contentId: this.contentIds.join(','),
                    source: this.formModel.source.id,
                    channelId: this.currentChannel.id,
                    id: this.data.id,
                    saveType: 2
                })
                if (data.success) {
                    this.previewShow = false
                    // 如果选择的是预览pc端， 走原来的逻辑
                    if(this.currActive == 'pc') {
                        const oLink = document.createElement('a')
                        oLink.href = data.data
                        oLink.target = '_blank'
                        oLink.click()
                    } else {
                        this.ylUrl = data.data
                        this.ylShow = true
                    }
                    showLoading(false)
                } else {
                    showError(data.errMsg)
                    showLoading(false)
                }
            })
        },

        // 获取文章正文的图片id
        _getContent(data) {
            this.contentIds = [...new Set([...this.contentIds, data.id])]
        },

        retract(){
            this.collect = !this.collect
        },

        // 生成摘要
        _createSummary() {
            if (this.isReadOnly || !this.getEditorData()) return
            const oDiv = document.createElement('div')
            oDiv.innerHTML = this.getEditorData()
            this.formModel.summary = oDiv.innerText.substring(0, 160).replace(/^\s*|\s*$/g, '')
        },

        // 选择文章来源
        _chooseSource({id, name}) {
            this.isShowSource = false
            this.formModel.source = {id, name}
        },

        // 选择文件
        _selectFile(file) {
            this.file = file
        },

        // 上传文章缩略图
        async _uploadThumbnail() {
            this.loading = true
            BASE64Helper.imgMd5(this.file.raw).then(async _file => {
                let {data} = await this.imageUpload({
                    file: _file,
                    type: '12',
                    appid: this.appid
                })
                if(data.success){
                    showMessage('上传成功')
                    this.formModel.photo = data.data.file
                    this.formModel.photo = {
                        flie: data.data.file,
                        url: data.data.url,
                        id: data.data.id,
                        origin: data.data.origin
                    }
                }else{
                    showError(data.errMsg)
                }
                this.loading = false
            })
        },

        // 上传附件
        async _uploadFile(param) {
            try {
                BASE64Helper.imgMd5(param.file).then(async _file => {
                    let response = await this.fileUpload({
                        file: _file,
                        type: '22',
                        appid: this.appid
                    })
                    const data = response.data
                    this.formModel.attach = data.data.file
                    this.formModel.attach = {
                        file: data.data.file,
                        url: data.data.url,
                        id: data.data.id,
                        origin: data.data.origin
                    }
                    // onSuccess(response)
                    console.error(response)
                })
            } catch (error) {
                // onError(error)
                console.error(error)
                alert(error)
            }
        },

        // 热词替换
        async _replaceHotword() {
            showLoading(true, '加载中...')
            let data = await this.replaceHotword({
                word: this.getEditorData(),
                appid: this.appid
            })
            showLoading(false)
            // this.formModel.content = data
            this.$refs.ckeditor.setData(data)
        },

        // 重置表单
        _resetForm() {
            this.idea = ''
            this.$refs.editForm.resetFields()
            this.isShowShortTitle = false
            this.isShowSubTitle = false
            this.isShowViewTitle = false
            this.collect = false;
            this.contentIds = []
            this.formModel = {
                type: 1,
                title: '',
                titleColor: '#000000',
                showTitle: '',
                subTitle: '',
                shortTitle: '',
                author: '',
                source: {
                    id: '',
                    name: ''
                },
                keyword: '',
                summary: '',
                photo: {},
                top: 0,
                content: '',
                attach: {},
                url: '',
                pageFlag: 0,
                urlPart:'',
                urlMain:'',
                icon: '',
                description: '',
                bak01: '',
                bak02: '',
                bak03: '',
                bak04: '',
                bak05: '',
                compileTime: '',
                hasPicture: '',
            }
            this.currVersion = ''
            this.historyArr = []
            this.formExtraData = {}
            this.isProduct = false
        },

        // 关闭弹框
        _closeModal() {
            this.$emit('input', false)
            this._resetForm()
        },
        // 展开版本
        expandVersion(){
            if(this.historyArr.length>=5){
                this.ifexpand = !this.ifexpand
            }
        }

    }
}
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
/deep/ .article-add-wrapper {
    /* top: 50%;
    left: 50%;
    height: 100%;
    margin: 0 !important;
    overflow-y: scroll;
    transform: translate(-50%, -50%); */

    .el-dialog__header {
        padding-top: 10px;
    }

    .el-dialog__body {
        padding: 10px 20px;
    }
    .collect_ac,
    .collect{
        position: relative;
        width: 100%;
        >div{
            position: absolute;
            cursor: pointer;
            user-select: none;
            left: -20px;
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
        transform: translateX(20px);
        transition:width .5s;
        margin: 0;
    }
    .extra-wrapper {
        padding: 0 25px;
    }

    .bottom-btn-wrapper {
        padding-top: 20px;
        border-top: 1px solid $border-color;
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
            margin-left: 0 !important;
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
            width: 0 !important
        }
    }

    .el-upload__tip {
        border: 1px solid #000;
        width: 800px;
        height: 30px;
    }
}
/deep/  .el-input--prefix .el-input__inner {
        padding-left: 30px !important;
    }
</style>

<style lang="scss">
.source-dialog {
    height: 600px;
    // overflow-y: scroll;
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

/deep/ .el-input__suffix {
    padding-left: 20px;
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
.historyBox{
    margin:15px 0px !important;
    display: flex;
}
.historyList{
    display:flex;
    flex-wrap: wrap;
    width:900px;
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
