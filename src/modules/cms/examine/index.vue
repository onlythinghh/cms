<!--文章审核-->
<template>
    <div>
        <div class="header">
            <el-form label-width="80px" class="from">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="文章名称">
                            <el-input v-model="form.name" placeholder="请输入查询文章名称" clearable style="width:80%"></el-input>
                        </el-form-item>
                        <el-form-item label="审核状态">
                            <el-select v-model="form.state" placeholder="请选择状态" style="width:80%">
                                <el-option label="待处理" :value="0"></el-option>
                                <el-option label="已处理" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                       <el-form-item label="提交时间">
                            <el-select v-model="form.time" placeholder="请选择状态" style="width:80%">
                                <el-option label="今天" :value="1"></el-option>
                                <el-option label="一周内" :value="2"></el-option>
                                <el-option label="一个月内" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节点状态">
                            <el-select v-model="form.pass" placeholder="请选择状态" style="width:80%">
                                <el-option v-if="passSow" label="未处理" :value="0"></el-option>
                                <el-option label="通过" :value="1"></el-option>
                                <el-option v-if="!passSow" label="驳回" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="流程ID">
                            <el-input v-model="form.inst" placeholder="请输入流程ID" @input="instChange" clearable style="width:80%"></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                         <el-form-item>
                            <el-checkbox v-model="form.all">所有站点</el-checkbox>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="pop">
            <el-dialog v-if="centerDialogVisible" :title="`审核${typeName[rowdata.type]}操作`" :visible.sync="centerDialogVisible" top="9vh" :width="dialogWidth" center>
                <el-form>
                    <el-row>
                        <el-col v-if="popForm" :span="13">
                            <div class="popform">
                                <p class="font_b">文章信息
                                    <img v-if="formModel.top"
                                        src="../article/images/icon-top2.png" 
                                        width="25" 
                                        style="vertical-align: middle;"
                                        class="icon_img"
                                    />
                                </p>
                                <el-form :model="formModel" label-width="80px" size="mini" class="add_form">
                                    <el-form-item
                                        v-for="(item, idx) in articleFields"
                                        :key="idx"
                                        :label="item.title"
                                        :prop="item.name"
                                        :style="item.widget === 'HIDDEN' || item.widget === 'SYSTEM' ? 'display:none;' : ''"
                                    >
                                        <template>
                                            <el-input
                                                v-if="item.widget === 'TEXT'"
                                                :key="idx"
                                                v-model="formModel[item.name]"
                                                :readonly="true"
                                                tyle="width: 100%;"
                                            />
                                            <el-select
                                                v-else-if="item.widget === 'SELECT'"
                                                v-model="formModel[item.name]"
                                                :disabled="true"
                                                style="width: 100%;"
                                            >
                                                <el-option v-for="it in item.enums" :key="it.key" :label="it.label" :value="it.key"></el-option>
                                            </el-select>
                                            <el-select
                                                v-else-if="item.widget === 'TAGS'"
                                                v-model="formModel[item.name]"
                                                :disabled="true"
                                                style="width: 100%;"
                                                multiple
                                            >
                                                <el-option v-for="it in item.enums" :key="it.key" :label="it.label" :value="it.key"> </el-option>
                                            </el-select>
                                            <el-select
                                                v-else-if="item.widget === 'CHECKBOX'"
                                                :key="idx"
                                                v-model="formModel[item.name]"
                                                :disabled="true"
                                                multiple
                                                size="mini"
                                                style="width: 100%;"
                                            >
                                                <el-option v-for="(it, index) in item.enums" :key="index" :label="it.label" :value="it.key" />
                                            </el-select>
                                            <el-radio-group
                                                v-else-if="item.type === 'BOOL'"
                                                :key="idx"
                                                v-model="formModel[item.name]"
                                                :disabled="true"
                                                size="mini"
                                            >
                                                <el-radio v-for="(it, index) in item.enums" :key="index" :label="it.key == 1 ? true : false">{{
                                                    it.label
                                                }}</el-radio>
                                            </el-radio-group>
                                            <el-radio-group
                                                v-else-if="item.widget === 'RADIO' && item.type !== 'BOLL'"
                                                :key="idx"
                                                v-model="formModel[item.name]"
                                                :disabled="true"
                                                size="mini"
                                            >
                                                <el-radio v-for="(it, index) in item.enums" :key="index" :label="it.key">{{ it.label }}</el-radio>
                                            </el-radio-group>
                                            <el-date-picker
                                                v-else-if="item.widget === 'DATE' || item.widget === 'DATETIME'"
                                                v-model="formModel[item.name]"
                                                placeholder="选择日期时间"
                                                :readonly="true"
                                                size="mini"
                                                :type="item.widget === 'DATE' ? 'date' : 'datetime'"
                                                @change="dateTime(item.name)"
                                            />
                                            <el-time-picker
                                                v-else-if="item.widget === 'TIME'"
                                                :key="idx"
                                                v-model="formModel[item.name]"
                                                placeholder="选择时间"
                                                :readonly="true"
                                                type="datetime"
                                                size="mini"
                                            />
                                            <div
                                                v-else-if="
                                                    (item.widget === 'TEXT' && item.type !== 'NUMBER') ||
                                                        item.widget === 'HIDDEN' ||
                                                        item.widget === 'SYSTEM'
                                                "
                                            >
                                                <div v-if="tagList.length !== 0 && item.name === 'tag'">
                                                    <el-select v-model="formModel[item.name]" :disabled="true" clearable style="width: 100%;">
                                                        <el-option v-for="(it, index) in tagList" :key="index" :label="it" :value="it"></el-option>
                                                    </el-select>
                                                </div>
                                                <div v-else>
                                                    <el-input
                                                        :key="idx"
                                                        v-model="formModel[item.name]"
                                                        :maxlength="item.len"
                                                        :readonly="true"
                                                        size="mini"
                                                    />
                                                </div>
                                            </div>
                                            <div v-else-if="item.widget === 'IMAGE'">
                                                <div v-for="(img, imgK) in formModel[item.name]" :key="imgK" class="tit_img">
                                                    <img :src="img.url" :alt="img.origin" />
                                                </div>
                                            </div>
                                            <div v-else-if="item.widget === 'ATTACH'">
                                                <p v-for="(img, val) in formModel[item.name]" :key="val" class="upload_File">
                                                    <a :href="img.url">{{ img.origin }}</a>
                                                </p>
                                            </div>
                                            <div v-else-if="item.widget === 'RICHTEXT'">
                                                <!--eslint-disable-next-line-->
                                                <div class="content" v-html="formModel[item.name]"></div>
                                            </div>
                                            <el-input
                                                v-else-if="item.widget === 'TEXTAREA'"
                                                :key="idx"
                                                v-model="formModel[item.name]"
                                                type="textarea"
                                                :readonly="true"
                                                :rows="3"
                                                size="mini"
                                            />
                                            <span
                                                v-if="item.required && (item.widget == 'ATTACH' || item.widget == 'IMAGE')"
                                                :ref="'msg_' + item.name"
                                                class="msgerr"
                                            ></span>
                                        </template>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-col>
                        <el-col v-else :span="13">
                            <div class="popform">
                                <p class="font_b">文章信息</p>   
                                <div class="tit">
                                    <span>标题：</span>
                                    <div class="poptitle">
                                        <div class="icon">
                                            <img v-if="batchdata.form.top" src="../article/images/icon-top2.png" width="25" class="icon_img" />
                                            <i v-if="batchdata.form.type === 1" style="color:#F00" class="icon_tit iconfont icon-HTML"></i>
                                            <i v-if="batchdata.form.type === 2" style="color: #CC9900" class="icon_tit iconfont icon-wenjianjia"></i>
                                            <i v-if="batchdata.form.type === 3" style="color: blue" class="icon_tit iconfont icon-share_link"></i>
                                        </div>
                                        <el-input
                                            v-model="batchdata.form.title"
                                            class="poptitle_input"
                                            :style="{ color: batchdata.form.titleColor }"
                                            :disabled="true"
                                        />
                                    </div>
                                </div>
                                <el-col :span="10">
                                    <!--eslint-disable-next-line-->
                                    <el-form-item label="图片:　" label-width="50px">
                                        <div class="tit_img"><img v-if="batchdata.form.photo" :src="batchdata.form.photo.url" /></div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="14">
                                    <el-form-item label="作者：" label-width="100px">
                                        <el-input v-model="batchdata.form.author" style="width:100%" disabled />
                                    </el-form-item>
                                    <el-form-item label="显示时间：" label-width="100px">
                                        <el-date-picker v-model="batchdata.form.showTime" style="width:100%" type="datetime" disabled />
                                    </el-form-item>
                                    <el-form-item label="附件：" label-width="100px">
                                        <span v-if="batchdata.form.attach">
                                            <a target="_blank" :href="batchdata.form.attach.url" >{{ batchdata.form.attach.origin }}</a></span>
                                    </el-form-item>
                                    <el-form-item label="链接：" label-width="100px">
                                        <span><a target="_blank" :href="batchdata.form.url">{{ batchdata.form.url }}</a></span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-collapse>
                                        <el-collapse-item title="其他属性">
                                            <el-form-item label="显示标题：" label-width="90px">
                                                <el-input v-model="batchdata.form.showTitle" placeholder="空" disabled />
                                            </el-form-item>
                                            <el-form-item label="副标题：" label-width="90px">
                                                <el-input v-model="batchdata.form.subTitle" placeholder="空" disabled />
                                            </el-form-item>
                                            <el-form-item label="短标题：" label-width="90px">
                                                <el-input v-model="batchdata.form.shortTitle" placeholder="空" disabled />
                                            </el-form-item>
                                            <el-col :span="12">
                                                <el-form-item label="所属频道：" label-width="90px">
                                                    <el-input v-model="batchdata.form.channelName" placeholder="空" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="关键词：" label-width="90px">
                                                    <el-input v-model="batchdata.form.keyword" placeholder="空" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <!-- <el-col :span="12">
                                                <el-form-item label="引用标记：" label-width="90px">
                                                    <el-input v-model="batchdata.form.code" placeholder="空" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-form-item label="来源：" label-width="90px"> -->
                                                <!--eslint-disable-next-line-->
                                                <!-- <el-input
                                                    v-if="batchdata.form.source"
                                                    v-model="batchdata.form.source.name"
                                                    placeholder="空"
                                                    disabled
                                                />
                                            </el-form-item> -->
                                            <el-col :span="24">
                                                <el-form-item label="摘要：" label-width="90px">
                                                    <el-input v-model="batchdata.form.summary" type="textarea" :rows="5" placeholder="空" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="扩展属性1：" label-width="90px">
                                                    <el-input v-model="batchdata.form.bak01" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="扩展属性2：" label-width="90px">
                                                    <el-input v-model="batchdata.form.bak02" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="扩展属性3：" label-width="90px">
                                                    <el-input v-model="batchdata.form.bak03" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="扩展属性4：" label-width="90px">
                                                    <el-input v-model="batchdata.form.bak04" disabled />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="扩展属性5：" label-width="90px">
                                                    <el-input v-model="batchdata.form.bak05" disabled />
                                                </el-form-item>
                                            </el-col>
                                        </el-collapse-item>
                                    </el-collapse>
                                </el-col>
                                <el-col :span="24">
                                    <p class="font_b">正文：</p>
                                    <!--eslint-disable-next-line-->
                                    <div class="content" v-html="batchdata.form.content"></div>
                                </el-col>
                            </div>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form>
                                <el-form-item label="操作记录" class="font_b">
                                    <el-tabs v-model="batchdata.activeName" @tab-click="tabsClick">
                                        <el-tab-pane label="全部" name="first">
                                            <el-table height="270" :data="batchdata.reviewerList" style="width: 100%">
                                                <el-table-column label="日期" width="180">
                                                    <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                                </el-table-column>
                                                <el-table-column prop="oper" label="操作人" width="100" />
                                                <el-table-column prop="description" label="描述" />
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane label="新增" name="second">
                                            <el-table height="270" :data="batchdata.reviewerList1" style="width: 100%">
                                                <el-table-column label="日期" width="180">
                                                    <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                                </el-table-column>
                                                <el-table-column prop="oper" label="操作人" width="100" />
                                                <el-table-column prop="description" label="描述" />
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane label="发布" name="third">
                                            <el-table height="270" :data="batchdata.reviewerList1" style="width: 100%">
                                                <el-table-column label="日期" width="180">
                                                    <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                                </el-table-column>
                                                <el-table-column prop="oper" label="操作人" width="100" />
                                                <el-table-column prop="description" label="描述" />
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane label="审核" name="fourth">
                                            <el-table height="270" :data="batchdata.reviewerList1" style="width: 100%">
                                                <el-table-column label="日期" width="180">
                                                    <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                                </el-table-column>
                                                <el-table-column prop="oper" label="操作人" width="100" />
                                                <el-table-column prop="description" label="描述" />
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane label="撤稿" name="five">
                                            <el-table height="270" :data="batchdata.reviewerList1" style="width: 100%">
                                                <el-table-column label="日期" width="180">
                                                    <template v-slot="{ row }">{{ row.operTime | dateFormat }}</template>
                                                </el-table-column>
                                                <el-table-column prop="oper" label="操作人" width="100" />
                                                <el-table-column prop="description" label="描述" />
                                            </el-table>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-form-item>
                                <div style="position: relative;">
                                    <p class="font_b">任务信息</p>
                                </div>
                                <el-row>
                                    <el-col :span="10">
                                        <el-form-item label="发布类型：" >
                                            <span>{{rowdata.publishType==1?'即时':'计划'}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-form-item v-if="batchdata.form.offlineTime" label="下线时间：" label-width="90px">
                                            <el-date-picker
                                                v-model="offlineTime"
                                                type="datetime"
                                                format="yyyy-MM-dd HH:mm:ss"
                                                value-format="timestamp"
                                                style="width:100%"
                                                :picker-options="offTimeOption"
                                                @change="showOffMsg"
                                            />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item v-if="attachList.length > 0" label="附件：">
                                    <div class="attach_cont">
                                        <p v-for="item in attachList" :key="item.id" @click="previewHandler(item)">
                                            {{item.origin}}
                                        </p>
                                        <el-button type="text" @click="annexDownload">下载全部附件</el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item v-if="rowdata.publishType==2" label="发布时间：" >
                                    <el-date-picker
                                        v-model="rowdata.publishDate"
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间"
                                        value-format="timestamp"
                                        :picker-options="expireTimeOption"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item :label="`审核${typeName[rowdata.type]}意见`" class="font_b" required>
                                    <el-input
                                        v-model="batchdata.desc"
                                        placeholder="请输入审核内容"
                                        type="textarea"
                                        :rows="5"
                                        maxlength="200"
                                        show-word-limit
                                    ></el-input>
                                    <span v-if="batchdata.showdesc" class="el-form-item__error">请填写{{typeName[rowdata.type]}}意见</span>
                                </el-form-item>
                            </el-form>
                            <div class="btn">
                                <el-button
                                    type="warning"
                                    icon="el-icon-view"
                                    style="margin:0 10px"
                                    @click="_preview" 
                                >预览</el-button>
                                <el-button type="primary" @click="adopt(true)">通过</el-button>
                                <el-button @click="notadopt">不通过</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
                <el-dialog width="30%" title="请注意!" top="10px" append-to-body :visible.sync="xxtsVisible">
                    <b style="color:#f56c6c">{{showOff}}</b>
                    <div slot="footer">
                        <el-button type="primary" @click="xxtsVisible = false">确定</el-button>
                    </div>
                </el-dialog>
            </el-dialog>
            <!-- 附件预览 -->
            <el-dialog
                v-if="iframeState"
                class="dialog"
                :before-close="closePreviewClick"
                :close-on-click-modal="false"
                :visible.sync="iframeState"
            >
                <div class="box" style="text-align: center;">
                    <!-- <iframe
                        :src="frameurl"
                        frameborder="0"
                        style=" z-index: 1000;height: 800px;width: 100%"
                    ></iframe> -->
                    <el-image :src="lkImg" style="width: 100%"></el-image>
                </div>
            </el-dialog>
            <el-dialog title="批量审核操作" :visible.sync="batchAdoptVisible" width="40%" center>
                <el-form ref="ruledatch" :model="forwardData" :rules="forwarRules" label-width="80px">
                    <el-form-item label="通过意见" prop="reason">
                        <el-input
                            v-model="forwardData.reason"
                            placeholder="请输入通过意见"
                            type="textarea"
                            :rows="3"
                            maxlength="300"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" @click="batchAdoptclick">提交</el-button>
                    <el-button @click="batchAdoptVisible = false">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog title="处理人转发" :visible.sync="forwardVisible" width="40%" center>
                <el-form ref="ruleForm" :model="forwardData" :rules="forwarRules" label-width="80px">
                    <el-form-item label="处理人" prop="reviewer" >
                        <el-select v-model="forwardData.reviewer" filterable placeholder="请选择处理人" style="width:100%" clearable>
                            <el-option v-for="(item, index) in userData" :key="index" :label="item.name" :value="item.account"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理理由" prop="reason">
                        <el-input
                            v-model="forwardData.reason"
                            placeholder="请输入处理理由"
                            type="textarea"
                            :rows="3"
                            maxlength="200"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" @click="forwardclick">提交</el-button>
                    <el-button @click="forwardVisible = false">关闭</el-button>
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
        <mobileMoadel :mobileVisible="ylShow" :mediaType="currActive" :url="ylUrl" @closed="mobileClose"></mobileMoadel>
        </div>
        <div class="Table">
            <el-button type="primary" :disabled="!passSow" @click="batchAdopt">批量审核通过</el-button>
            <!-- row-key="art" -->
            <el-table
                ref="Tabledata"
                tooltip-effect="dark"
                row-key="instId"
                :data="data"
                :row-style="{ height: '54px' }"
                :cell-style="{ padding: '0' }"
                :header-cell-style="{ 'text-align': 'center' }"
                @selection-change="selectionChange"
            >
                >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序列" width="60" type="index" align="center" />
                <el-table-column prop="appName" label="站点" align="center" />
                <el-table-column prop="channelName" label="频道" align="center" min-width="150" />
                <el-table-column prop="articleName" label="文章标题" align="center" min-width="250" />
                <el-table-column prop="type" label="类型" align="center" min-width="150">
                    <template slot-scope="scope">
                        <span>{{typeName[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核人" align="center" min-width="200" >
                    <template slot-scope="scope">
                        <div class="reviewers">
                            <span 
                                v-for="(i,k) in scope.row.reviewers" 
                                :key="k" 
                                :class="scope.row.currentStep-1>k?'succ':''"
                            >
                                <span v-if="scope.row.state==2&&k==scope.row.currentStep-2" class="err">{{i}}</span>
                                <span v-else>{{i}}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="进度" align="center" width="150">
                    <template slot-scope="scope">
                        <el-progress
                            :text-inside="true"
                            :stroke-width="25"
                            :status="scope.row.state==2?'exception':'success'"
                            :percentage="parseInt(scope.row.currentStep/scope.row.totalStep*100)>=100
                            ?100:parseInt(scope.row.currentStep/scope.row.totalStep*100)"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="stateName" label="状态" align="center" width="150" />
                <el-table-column label="提交时间" align="center" width="145">
                    <template slot-scope="scope">
                        <span>{{scope.row.submitReviewDate|dateFormat('YYYY-MM-DD HH:mm')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布类型" align="center" >
                    <template slot-scope="scope">
                        <span>{{scope.row.publishType===1?"即时": scope.row.publishType === 3 ? '紧急' : "计划"}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.perm.indexOf('audit') != -1"
                            type="primary" size="mini"
                            @click="batch(scope.row, 1)"
                        >审核</el-button>
                        <!-- <el-button 
                            v-if="scope.row.perm.indexOf('forward') != -1"
                            type="warning" size="mini"
                            @click="forward(scope.row)"
                        >转发</el-button> -->
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
import { showLoading, hideLoading ,showMessage} from "@/utils";
import { mapActions } from "vuex";
import { previewCustom, NewPreviewCustom, previewCustomMobile } from "../preview";
import { isArray, queryUrlString } from "../../../utils/BaseUtil.js";
import { downLoadFile } from '@/utils/FileDonwload'
import mobileMoadel from "../article/articleList/mobileModel/mobileModel.vue"
// import { showError } from '../../../utils/index.js';
export default {
    components:{
        mobileMoadel
    },
    data() {
        return {
            appid: null,
            form: {
                time:2,
                name: "",
                state: 0,
                pass: 0,
                all: true,
                inst: null
            },
            passSow:true,
            popForm: false,
            articleFields: null,
            formModel: null,
            data: [],
            id: [],
            flowid: [],
            total: 0,
            limit: 10,
            page: 1,
            currentPage: 1,
            centerDialogVisible: false,
            forwardVisible: false,
            userData: [],
            forwarRules: {
                reviewer: [
                    {
                        required: true,
                        message: "请选择处理人",
                        trigger: "blur"
                    }
                ],
                reason: [
                    {
                        required: true,
                        message: "请输入处理理由",
                        trigger: "blur"
                    }
                ]
            },
            forwardData: {
                reviewer: "",
                reason: ""
            },
            showOff:'',
            expireTimeOption: {
                disabledDate(date) {
                    return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            },
            offTimeOption:{
                disabledDate(date) {
                    return date.getTime() < Date.now();
                }
            },
            batchAdoptVisible: false,
            batchdata: {
                top: true,
                tabType: "",
                form: {},
                activeName: "first",
                reviewerList: [],
                reviewerList1: [],
                desc: "",
                showdesc: false
            },
            offlineTime:null,
            rowdata: {},
            xxtsVisible:false,
            typeName: {
                PUBLISH: '发布',
                REVOKE: '撤稿',
                RECYCLE: '删除'
            },
            attachList: [], // 附件列表

            previewShow: false,
            previewList: [
                {name:'手机', key: 'mobile', icon:'icon_phone'},
                {name:'平板', key: 'pad', icon: 'icon_iPad'},
                {name:'电脑', key: 'pc', icon: 'icon_pc'},
            ],
            currActive: 'pc',
            previewRow: null,
            ylShow: false,
            ylUrl: '',
            iframeState: false,
            frameurl: '',
            lkImg: '',
            typetxt: [],
            dialogWidth: '90%'
        };
    },
    watch: {
        forwardVisible(v) {
            if (!v) {
                this.forwardData.reason = "";
                this.forwardData.reviewer = "";
            }
        },
        batchAdoptVisible(v) {
            if (!v) {
                this.forwardData.reason = "";
                this.forwardData.reviewer = "";
            }
        },
        "form.state"(v){
            this.form.pass = v
            this.passSow = !v
        }
    },
    created() {
        if (JSON.parse(sessionStorage.getItem("SITE"))) this.appid = JSON.parse(sessionStorage.getItem("SITE")).id;
        this.form.inst = queryUrlString('inst')
        this.form.time = this.$route.params.time || 2
        this.searchList();
    },
    mounted(){
        window.onresize = () => {
            return (() => {
            this.setDialogWidth()
            })()
        }
    },

    methods: {
        ...mapActions("cms/pross", ["getUser"]),
        ...mapActions("authen", ["getReviewerLog"]),
        ...mapActions("cms/article/articleList", ["viewArticle", "customDetail", "getCurrent"]),
        ...mapActions("cms/examine", ["getlist", "exaudit", "exforward", "exadopt", "reviewDetail"]),
        setDialogWidth() {
            console.log(document.body.clientWidth)
            var val = document.body.clientWidth
            const def = 760
            if (val > def) {
                this.dialogWidth = '90%'
            } else {
                this.dialogWidth =  '750px'
            }
        },
        async searchList() {
            showLoading(true);
            let res = await this.getlist({
                ...this.form,
                appid: this.appid,
                page: this.page,
                limit: this.limit,
            });
            this.data = res.data;
            this.total = res.count;
            hideLoading();
        },
        getLog(id) {
            this.batchdata.activeName = "first";
            this.getReviewerLog({ id }).then(result => {
                this.batchdata.reviewerList = result;
                this.centerDialogVisible = true;
                this.batchdata.desc = "";
            });
        },
        // instChange(val) {
        //     this.form.inst = val ? val : null
        // },
        closePreviewClick() {
            this.iframeState = false
        },
        iconByType (row) {
        return row.origin.substring(row.origin.lastIndexOf('.') + 1, row.origin.length)
        },
        previewHandler(data) {
            console.log('data',data)
            let type = this.iconByType(data)
            if(type.indexOf('png') !== -1 ||
            type.indexOf('jpeg') !== -1 ||
            type.indexOf('jpg') !== -1 ||
            type.indexOf('gif') !== -1 ||
            type.indexOf('svg') !== -1) {
                this.lkImg = data.url
                this.iframeState = true
            } else if (type.indexOf('pdf') !== -1) {
                window.open(data.url, '_blank')
            } else {
                let link = document.createElement("a");
                link.href = data.url;
                link.download = data.origin;
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
            // let fileUrl = `http://hz-zh-tst.hz-serve.com${data.url}`
            // if (type.indexOf('xsl') !== -1 || type.indexOf('xslx') !== -1 || type.indexOf('xls') !== -1 ||
            //     type.indexOf('docx') !== -1 ||
            //     type.indexOf('doc') !== -1 ||
            //     type.indexOf('pdf') !== -1 ||
            //     type.indexOf('jpg') !== -1 ||
            //     type.indexOf('pptx') !== -1 || type.indexOf('ppt') !== -1) {
            //     this.iframeState = true
            //     this.frameurl = 'https://view.xdocin.com/xdoc?_xdoc=' + encodeURIComponent(fileUrl)
            // } else {
            //     console.log('当前文件暂不支持预览，请下载查看')
            //     window.open(data.url, '_blank')
            // }
        },
        // 预览
        _preview(){
            console.log('this.rowdata',this.rowdata)
            console.log('this.formModel',this.formModel)
            this.previewShow = true
            // this.previewRow = row
            return
            if(this.popForm){
                previewCustom(this.formModel.channel_id,this.rowdata.form,this.formModel.id);
            }else{
                previewCustom(this.batchdata.form.channelId,null,this.batchdata.form.id);
            }

        },
        // 选择预览设备关闭
        checkPreviewClose(){
            this.previewShow = false
            this.currActive = 'pc'
            this.previewRow = null
        },
        // 预览
        commonPrev() {
            this.previewShow = false
            // 如果选择的是预览pc端， 走原来的逻辑
            if(this.currActive == 'pc') {
                let params = {
                    channelId: this.popForm ? this.formModel.channel_id : this.batchdata.form.channelId,
                    formId: this.rowdata.form,
                    dataId: this.popForm ? this.rowdata.art : this.batchdata.form.id,
                    target : this.currActive,
                    parentId: ""
                }
                NewPreviewCustom(params)
            } else {
                let channel_id = this.popForm ? this.formModel.channel_id : this.batchdata.form.channelId
                let id = this.popForm ? id : this.batchdata.form.id
                previewCustomMobile(channel_id, this.rowdata.form, id, this.currActive).then(res => {
                    if(res.link) {
                        // 293, 296产品 和产品下的健康保障
                        let include = [293, 296, 412]
                        // this.ylUrl = include.includes(this.currentChannel.pid) ? `${res.link}?pid=${this.previewRow.id}&id=${this.currentChannel.pid}`: `${res.link}`
                        this.ylUrl = res.link
                        this.ylShow = true
                        console.log('this.ylUrl',this.ylUrl)
                    } else {
                        console.log('预览失败')
                    }
                })
            }
        },
        mobileClose(){
            this.ylShow = false
        },
        // 审核
        async batch(row) {
            // console.log('row',row)
            this.rowdata = row;
            this.rowdata.publishDate = this.rowdata.publishType==2?row.publishDate:null
            showLoading(true);
            let res = null;
            if (row.form) {
                res = await this.customDetail({
                    dataId: row.art,
                    channelId: row.channel,
                    formId: row.form
                });
                this.getLog(res.data.uuid);
                let _formData = await this.getCurrent({
                    channelId: row.channel,
                    formId: row.form
                });
                this.articleFields = _formData.data.articleFields;
                this.popForm = true;
                console.log('res.data',res.data)
                this.formModel = res.data;
                this.articleFields.forEach(ele => {
                    if (ele.widget == "CHECKBOX" || ele.widget == "TAGS") {
                        if(this.formModel[ele.name]){
                            this.formModel[ele.name] = this.formModel[ele.name].split(",");
                        }
                    }
                });
            } else {
                this.popForm = false;
                this.offlineTime = null;
                this.showOff = ''
                res = await this.viewArticle({
                    id: row.art,
                    channelId: row.channel,
                    appid: row.app
                });
                this.getLog(res.uuid);
                console.log('res111111111',res)
                this.batchdata.form = res;
                if(res.offlineTime){
                    this.offlineTime = res.offlineTime
                    this.showOffMsg(res.offlineTime)
                }
            }
            this.reviewDetail({id: row.instId}).then(res => {
                console.log('附件数据res', res)
                if(res.success && res.data != null) {
                    this.attachList = res.data.attachList
                }
            })
            hideLoading();
        },
        // 下载附件
        annexDownload(){
            let arr = []
            this.attachList.map(item => {
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
        showOffMsg(v){
            this.showOff = ''
            if(this.rowdata.publishDate>=v){
                this.xxtsVisible = true
                this.showOff = '下线时间早于发布时间，下线时间功能失效！'
            }else if(v <= new Date().getTime()){
                this.showOff = '当前时间已超过下线时间，下线时间功能失效！'
                this.xxtsVisible = true
                // showMessage({
                //     type: "warning",
                //     message: `当前时间已超过下线时间，下线时间功能失效！`
                // });
            }else if(v - new Date().getTime()<=7200000){
                this.xxtsVisible = true
                this.showOff = '当前时间距离下线时间不足2小时，可能影响该文章的线上展示'
                // showMessage({
                //     type: "warning",
                //     message: `当前时间距离下线时间不足2小时，可能影响该文章的线上展示！！`
                // });
            }
        },
        // 转发
        async forward(row) {
            this.rowdata = row;
            this.forwardVisible = true;
            let res = await this.getUser({limit:1000});
            this.userData = res.data;
        },
        forwardclick() {
            this.$refs.ruleForm.validate(async valid => {
                if (!valid) {
                    return false;
                }
                showLoading(true, "转发中...");
                let res = await this.exforward({
                    art: this.rowdata.art,
                    flow: this.rowdata.currNode,
                    reviewer: this.forwardData.reviewer,
                    reason: this.forwardData.reason
                });
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: res.data
                    });
                    this.forwardVisible = false;
                    this.searchList();
                } else {
                    this.$message.error("转发失败");
                }
                hideLoading();
            });
        },
        // 通过
        batchAdopt() {
            this.id.forEach((item)=>{
                if(item.publishType==2){
                    showMessage({
                        type: "warning",
                        message: `计划发布的文章不可批量操作！`
                    });
                    throw new Error('计划发布的文章不可批量操作！')
                }
            })
            if (this.id.length) {
                this.batchAdoptVisible = true;
            } else {
                this.$message({
                    type: "warning",
                    message: "请选择审核文章!"
                });
            }
        },
        batchAdoptclick() {
            this.$refs.ruledatch.validate(async valid => {
                if (!valid) {
                    return false;
                }
                let art = []
                this.id.forEach((item)=>{
                    art.push(item.art)
                })
                let res = await this.exadopt({
                    art,
                    reason: this.forwardData.reason,
                    flow: this.flowid
                });
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: "批量处理成功"
                    });
                    this.batchAdoptVisible = false;
                    this.searchList();
                } else {
                    this.$message.error("操作失败");
                }
            });
        },
        adopt(pass) {
            if (!this.batchdata.desc) {
                this.batchdata.showdesc = true;
                return;
            }
            // if(pass && this.offlineTime){
            //     if(this.offlineTime <= new Date().getTime()+600000){
            //         showError('下线时间过早!')
            //     }else{
            //         this.adoptOK(pass)
            //     }
            // }else{
            this.adoptOK(pass)
            // }
        },
        async adoptOK(pass){
            showLoading(true);
            let res = await this.exaudit({
                art: this.rowdata.art,
                publishType: this.rowdata.publishType,
                publishDate: this.rowdata.publishDate,
                offlineTime: this.offlineTime,
                flow: this.rowdata.currNode,
                reason: this.batchdata.desc,
                pass
            });
            if (res.success) {
                this.$message({
                    type: "success",
                    message: res.data
                });
                this.centerDialogVisible = false;
                this.searchList();
            } else {
                this.$message.error(res.errMsg||'操作失败!');
            }
            hideLoading();
        },
        // 不通过
        notadopt() {
            if (!this.batchdata.desc) {
                this.batchdata.showdesc = true;
            } else {
                this.batchdata.showdesc = false;
                this.adopt(false);
            }
        },
        // 选中
        selectionChange(val) {
            this.id = [...val];
            this.flowid = [];
            val.forEach(item => {
                this.flowid.push(item.currNode);
            });
        },
        // 操作记录切换
        tabsClick(tab) {
            var name = tab.name;
            switch (name) {
            case "second":
                this.batchdata.tabType = "INFO::EDIT:NEW";
                break;
            case "third":
                this.batchdata.tabType = "INFO::PUBLISH";
                break;
            case "fourth":
                this.batchdata.tabType = "INFO::AUDIT:ADOPT_____INFO::AUDIT:REJECT";
                break;
            case "five":
                this.batchdata.tabType = "INFO::REVOKE";
                break;
            }
            this.batchdata.reviewerList1 = [];
            if (!isArray(this.batchdata.reviewerList)) {
                return false;
            }
            this.batchdata.reviewerList.forEach(element => {
                if (this.batchdata.tabType.includes(element.type)) {
                    this.batchdata.reviewerList1.push(element);
                }
            });
        },
        // 分页limit改变
        handleSizeChange(val) {
            this.limit = val;
            this.searchList();
        },
        // 分页跳转
        handleCurrentChange(val) {
            this.page = val;
            this.searchList();
        }
    }
};
</script>
<style scoped>
.paganition {
    text-align: right;
    margin: 10px;
}

.reviewers>span:not(:last-child)::after{
    content: ',';
}
.reviewers>span.succ{
    color: #67c23a;
}
.reviewers>span>span.err{
    color: #f56c6c;
}
.font_b,
.el-collapse-item__header {
    vertical-align: top;
    font-weight: bold;
    color: #303133;
    font-size: 14px;
    margin-bottom: 20px;
}
.attach_cont{
    margin-left: 55px;
}
.attach_cont p{
    line-height: 25px;
    margin: 5px 0;
    cursor: pointer;
}
.popform > .tit {
    display: flex;
    margin-bottom: 10px;
}
.popform > .tit > span {
    width: 50px;
    margin-top: 2px;
}
.poptitle {
    flex: 1;
    position: relative;
}
.poptitle > .icon {
    position: absolute;
    z-index: 99;
}
.tit_img {
    max-width: 250px;
    /* width: 250px; */
    min-width: 100px;
    height: 250px;
    border: 1px solid #e6ebf5;
    overflow: hidden;
}
.tit_img > img {
    width: 100%;
    object-fit: cover;
}
.icon_img {
    margin-top: -3px;
}
.icon_tit::before {
    vertical-align: top;
}
.poptitle_input {
    width: 100%;
    margin-right: 3%;
    margin-top: -2rem;
}
.poptitle /deep/ .el-input__inner {
    margin-top: -0.5rem;
    padding-left: 45px;
    vertical-align: text-top;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.flex {
    display: flex;
    justify-content: space-between;
}
.el-col {
    margin-bottom: 5px;
}
.el-collapse-item__content {
    padding: 0;
}
.content {
    border: 1px solid #e7e6e6;
    padding: 5px;
}
.content /deep/ img{
    width:100%;
    height:auto;
}
.collapse {
    padding: 0 5px;
}
</style>
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
                    background: url('../../../assets/images/icon_phone.png');
                    background-size: 100%;
                }
                &.icon_iPad{
                    background: url('../../../assets/images/icon_iPad.png');
                    background-size: 100%;
                }
                &.icon_pc{
                    background: url('../../../assets/images/icon_pc.png');
                    background-size: 100%;
                }
            }
        }
    }
}
</style>
