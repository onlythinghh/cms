<template>
<!-- eslint-disable -->
    <div class="article-container">
        <el-tabs v-model="custom.activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="基础文章" name="basic">
                <TableRow has-form has-pagination :has-form-border="false">
                    <template #form>
                        <el-form ref="searchForm" inline :model="searchForm" :disabled="currentChannel.id === 0" label-position="left" size="mini">
                            <div class="search-wrapper">
                                <el-form-item label="类型" label-width="40px" prop="type">
                                    <el-select v-model="searchForm.type" class="w100" placeholder="请选择" clearable>
                                        <el-option v-for="(item, index) in articleType" :key="index" :label="item" :value="+index">
                                            <template>
                                                <div v-if="item === 'html'">
                                                    <i style="color: #f00" class="iconfont icon-HTML"></i>
                                                    HTML
                                                </div>
                                                <div v-if="item === '文件'">
                                                    <i style="color: #cc9900" class="iconfont icon-wenjianjia"></i>
                                                    文件
                                                </div>
                                                <div v-if="item === '链接'">
                                                    <i style="color: blue" class="iconfont icon-share_link"></i>
                                                    链接
                                                </div>
                                            </template>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="状态" label-width="40px" prop="status">
                                    <el-select v-model="searchForm.status" class="w100" placeholder="请选择" clearable>
                                        <!-- 数据字典中的状态 -->
                                        <!-- <el-option v-for="(item, index) in publishStatus"
                                        :key="index" :label="item" :value="+index"></el-option> -->
                                        <el-option label="未发布" value="1"></el-option>
                                        <el-option label="待审核" value="2"></el-option>
                                        <el-option label="已发布" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="标题" label-width="40px" prop="title" >
                                    <el-input v-model="searchForm.title" placeholder="请输入标题" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="作者" label-width="40px" prop="author" >
                                    <el-input v-model="searchForm.author" placeholder="请输入作者" clearable></el-input>
                                </el-form-item>
                                <el-form-item label-width="50px">
                                    <el-checkbox v-model="searchForm.offline">定时下线</el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" style="margin-right: 10px" @click="_search">搜索</el-button>
                                    <el-button @click="_resetSearch">重置</el-button>
                                </el-form-item>
                            </div>
                            <div>
                                <el-button
                                    v-if="hasPermission('ALL_INFO_ADD')"
                                    icon="el-icon-plus"
                                    size="small"
                                    style="margin-right: 10px"
                                    @click="_operationArticle(1)"
                                >
                                    新增
                                </el-button>
                                <el-button v-if="hasPermission('INFO_MOVE')" icon="el-icon-rank" size="small" @click="_move">
                                    移动
                                </el-button>
                                <el-button v-if="hasPermission('INFO_CLONE')" icon="el-icon-document-copy" size="small" @click="_copy">
                                    复制
                                </el-button>
                                <el-button v-if="hasPermission('INFO_SHARE')" icon="el-icon-document-copy" size="small" @click="_share">
                                    分享
                                </el-button>
                                <!-- <el-button v-if="hasPermission('INFO_SHARE')" icon="el-icon-document-copy" size="small" @click="_quote">
                                    共享
                                </el-button>
                                <el-button
                                    v-if="hasPermission('INFO_GLOBAL_SHARE')"
                                    icon="el-icon-document-copy"
                                    size="small"
                                    @click="_CrosssiteShared"
                                >
                                    跨站共享
                                </el-button> -->
                                <el-button
                                    v-if="hasPermission('INFO_PUBLISH')"
                                    icon="el-icon-position"
                                    size="small"
                                    @click="_directrelease(1)"
                                >
                                    直接发布
                                </el-button>
                                <el-button
                                    v-if="hasPermission('INFO_CHECK_PUBLISH')"
                                    icon="el-icon-position" 
                                    size="small" 
                                    @click="_Reviewrelease"
                                >
                                    审核发布
                                </el-button>
                                <!-- <el-button v-if="hasPermission('INFO_PREVIEW')" icon="el-icon-view" size="small" @click="_preview">
                                    预览
                                </el-button> -->
                                <el-button v-if="hasPermission('INFO_SORT')" icon="el-icon-sort" size="small" @click="_goSort">
                                    自定义排序
                                </el-button>
                                <el-button 
                                    v-if="hasPermission('INFO_DELETE')" 
                                    icon="el-icon-delete" 
                                    size="small" 
                                    type="danger" 
                                    style="margin-top: 10px" 
                                    @click="beforeAllDelOrRevise(null, 1)"
                                >
                                    删除
                                </el-button>
                                <el-button
                                    v-if="hasPermission('INFO_REVOKE')"
                                    icon="el-icon-error"
                                    size="small"
                                    type="primary"
                                    @click="beforeDelOrRevise(null, 0)"
                                >
                                    撤稿
                                </el-button>
                                <el-button
                                    v-if="hasPermission('ALL_INFO_RECYCLE')"
                                    icon="el-icon-delete"
                                    size="small"
                                    type="danger"
                                    @click="_goRecycle"
                                >
                                    回收站
                                </el-button>
                            </div>
                        </el-form>
                    </template>
                    <el-table 
                        ref="listTable" 
                        :data="list" 
                        row-key="id" 
                        :default-sort="{prop:channelOrder?channelOrder.prop:'showTime',
                        order:channelOrder?(channelOrder.asc?'ascending':'descending'):'ascending'}"
                        style="width:99%;"
                        border 
                        @selection-change="_handleSelectionChange" 
                        @sort-change="sortChange"
                    >
                        <el-table-column fixed type="selection" width="40"></el-table-column>
                        <el-table-column prop="type" label="类型" width="80">
                            <template v-slot="{ row }">
                                <div v-if="articleType[row.type] === 'html'" class="type">
                                    <i style="color: #f00" class="iconfont icon-HTML"></i>
                                </div>
                                <div v-if="articleType[row.type] === '文件'" class="type">
                                    <i style="color: #cc9900" class="iconfont icon-wenjianjia"></i>
                                </div>
                                <div v-if="articleType[row.type] === '链接'" class="type">
                                    <i style="color: blue" class="iconfont icon-share_link"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="标题" sortable prop="title">
                            <template v-slot="{ row }">
                                <el-link :title="row.title" type="primary" @click="_view(row)">
                                    <img v-if="row.top" src="../images/icon-top2.png" width="25" style="vertical-align: middle" alt=""/>
                                    <!-- <img v-if="!row.shareType" src="../images/icon-link.png" width="25" style="vertical-align: middle" alt=""/> -->
                                    <img v-if="row.hasPicture" src="../images/icon-picture.png" width="25" style="vertical-align: middle" alt=""/>
                                    <span class="title-text">{{ row.title | substringTitle }}</span>
                                </el-link>
                                <!-- <span v-else>
                            <img v-if="row.top" src="../images/icon-top.png" width="25" style="vertical-align:middle;">
                            <img v-if="!row.shareType" src="../images/icon-link.png" width="25" style="vertical-align:middle;">
                            <img v-if="row.hasPicture" src="../images/icon-picture.png" width="25" style="vertical-align:middle;">
                            <span class="title-text">{{ row.title | substringTitle }}</span>
                        </span> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="channel" label="所属频道">
                            <template v-slot="{ row }">
                                <span v-if="row.shareType === 2" :title="row.channel">{{ row.channel | substringChannel }}</span>
                                <span v-else style="color: #1890ff">当前频道</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="文章状态" width="100">
                            <template v-slot="{row}">
                                <span>{{row.statusName}}</span>
                                <i v-if="row.share&&row.shareType!=2" class="el-icon-share" style="color: #1890ff"></i>
                                <i v-if="row.shareType===2" class="el-icon-share"></i>
                            </template>
                        </el-table-column>
                        <el-table-column label="审核人" width="100" >
                            <template v-slot="{ row }">
                                <span v-if="row.reviewerType&&row.reviewerName" style="color: #ff4949;" >{{reviewerTxt[row.reviewerType]}}•</span>
                                <span v-if="row.reviewerType&&!row.reviewerName" style="color: #ff4949;" >{{reviewerTxt[row.reviewerType]}}</span>
                                <span>{{row.reviewerName}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="createBy" label="创建人" width="150"></el-table-column> -->
                        <el-table-column prop="author" label="作者" width="100"></el-table-column>
                        <!-- <el-table-column prop="reviewer" label="审核人" width="100"></el-table-column> -->
                        <el-table-column label="主页面" width="100" prop="pageFlag">
                            <template v-slot="{ row }">{{ row.pageFlag == 1 ? '主页面' : '非主页面' }}</template>
                        </el-table-column>
                        <el-table-column label="创建时间" width="180" sortable prop="createTime">
                            <template v-slot="{ row }">{{ row.createTime | dateFormat }}</template>
                        </el-table-column>
                        <el-table-column label="显示时间" width="180" sortable prop="showTime">
                            <template v-slot="{ row }">{{ row.showTime | dateFormat }}</template>
                        </el-table-column>
                        <el-table-column v-if="searchForm.offline" label="下线时间" width="180" prop="showTime">
                            <template v-slot="{ row }">{{ row.offlineTime | dateFormat }}</template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="300" align="center">
                            <template v-slot="{ row }">
                                
                                <el-button
                                    v-if="hasPermission('INFO_UPDATE')"
                                    :disabled="setDisabled(row.btnPermission)"
                                    type="primary"
                                    size="mini" 
                                    icon="el-icon-edit"
                                    @click="_operationArticle(0,false,row)"
                                >修改</el-button>
                                <el-button
                                    type="warning"
                                    size="mini"
                                    icon="el-icon-view"
                                    style="margin:0 10px"
                                    @click="_preview2(row)" 
                                >预览</el-button>
                                <template>
                                    <el-dropdown>
                                        <el-button type="primary" size="mini">更多菜单
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_MOVE')"
                                                :disabled="!row.btnPermission.includes('INFO_MOVE')"
                                            ><div @click="_move(row)">移动</div></el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_CLONE')"
                                                :disabled="!row.btnPermission.includes('INFO_CLONE')"
                                            ><div @click="_copy(row)">复制</div></el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_SHARE')"
                                                :disabled="!row.btnPermission.includes('INFO_SHARE')"
                                            ><div @click="_share(row)">分享</div></el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_PUBLISH')"
                                                :disabled="!row.btnPermission.includes('INFO_PUBLISH')"
                                            ><div @click="_directrelease(1,row)">直接发布</div></el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_CHECK_PUBLISH')"
                                                :disabled="!row.btnPermission.includes('INFO_PUBLISH')"
                                            ><div @click="_Reviewrelease(row)">审核发布</div></el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_REVOKE')"
                                                :disabled="!row.btnPermission.includes('INFO_REVOKE')"
                                            ><div @click="beforeDelOrRevise(row,0)">撤稿</div></el-dropdown-item>
                                            <el-dropdown-item
                                                :disabled="row.statusName == '审核中'? false : true"
                                            ><div @click="_withdraw(row)">审核撤回</div></el-dropdown-item>
                                            <el-dropdown-item
                                                :disabled="row.statusName == '审核中'? false : true"
                                            ><div @click="_articleUrge(row)">催办</div></el-dropdown-item>
                                            <el-dropdown-item
                                                :disabled="row.statusName == '已发布'? false : true"
                                            >
                                                <div @click="beforeselectForm(row)">配置表单</div>
                                            </el-dropdown-item>
                                            <!-- v-if="currentChannel.id == 65818" -->
                                            <el-dropdown-item>
                                                <div @click="setRecommend(row)">推荐产品</div>
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="hasPermission('INFO_DELETE')"
                                                :disabled="!row.btnPermission.includes('INFO_DELETE')"
                                            ><div style="color:#f56c6c" @click="beforeDelOrRevise(row,1)">删除</div></el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <template #pagination>
                        <Pagination
                            :current-page="currentPage"
                            :page-size="limit"
                            layout="sizes, prev, pager, next"
                            :total="totalPage"
                            @size-change="_changeactPagsize"
                            @current-change="_changePagination"
                        ></Pagination>
                    </template>
                </TableRow>
                <add-article v-model="isShowEditArticleWrapper" :title="articleWrapperTitle" :data="currentArticleData" />
            </el-tab-pane>
            <el-tab-pane v-for="tab in currentChannel.formList" :key="tab.formId" :label="tab.showName" :name="tab.showName">
                <el-form inline :model="custom.searchForm" size="mini">
                    <el-form-item label="标题" label-width="40px" prop="title" clearable>
                        <el-input v-model="custom.searchForm.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" label-width="40px">
                        <el-select v-model="custom.searchForm.status" class="w100" placeholder="请选择" clearable>
                            <el-option label="未发布" value="1"></el-option>
                            <el-option label="待审核" value="2"></el-option>
                            <el-option label="已发布" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="custom.tagList.length > 0" label="标签" label-width="70px">
                         <el-select v-model="custom.searchForm.tag" class="w100" placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in custom.tagList" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="(item, key) in custom.trendsForm" :key="key" :label="item.title" clearable>
                        <el-select v-if="item.type=='BOOL'" v-model="custom.searchForm[item.name]" class="w100" placeholder="请选择" clearable>
                            <el-option v-for="(i, k) in item.enums" 
                                :key="k" :label="i.label" :value="i.key"
                            ></el-option>
                        </el-select>
                        <el-input v-else v-model="custom.searchForm[item.name]" :placeholder="'请输入'+item.title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="custom_search(1)">搜索</el-button>
                        <el-button @click="_resetSearch2">重置</el-button>
                    </el-form-item>
                </el-form>
                <div v-if="custom.formId == 22" class="btn">
                    <el-button
                        v-if="hasPermission('ALL_INFO_ADD')"
                        icon="el-icon-plus"
                        size="small"
                        style="margin-right: 10px"
                        @click="_operationArticle(1, true)"
                    >
                        新增
                    </el-button>
                    <el-button v-if="hasPermission('INFO_SORT')" icon="el-icon-sort" size="small" @click="_goSort1">
                        自定义排序
                    </el-button>
                    <el-button v-if="hasPermission('INFO_DELETE')" icon="el-icon-delete" size="small" type="danger" @click="beforeAllDelOrRevise(null, 1)">
                        删除
                    </el-button>
                    <el-button v-if="hasPermission('ALL_INFO_RECYCLE')" icon="el-icon-delete" size="small" type="danger" @click="_goRecycle">
                        回收站
                    </el-button>
                </div>
                <div v-else class="btn">
                    <el-button
                        v-if="hasPermission('ALL_INFO_ADD')"
                        icon="el-icon-plus"
                        size="small"
                        style="margin-right: 10px"
                        @click="_operationArticle(1, true)"
                    >
                        新增
                    </el-button>
                    <el-button
                        v-if="hasPermission('INFO_MOVE')"
                        icon="el-icon-rank"
                        size="small"
                        @click="handleMoveClick"
                    >
                        移动
                    </el-button>
                    <el-button v-if="hasPermission('INFO_PUBLISH')" icon="el-icon-position" size="small" @click="_directrelease(2)">
                        直接发布
                    </el-button>
                    <el-button v-if="hasPermission('INFO_CHECK_PUBLISH')" icon="el-icon-position" size="small" @click="_Reviewrelease">
                        审核发布
                    </el-button>
                    <el-button v-if="hasPermission('INFO_SORT')" icon="el-icon-sort" size="small" @click="_goSort1">
                        自定义排序
                    </el-button>
                    <el-button v-if="hasPermission('INFO_DELETE')" icon="el-icon-delete" size="small" type="danger" @click="beforeAllDelOrRevise(null, 1)">
                        删除
                    </el-button>
                    <el-button
                        v-if="hasPermission('INFO_REVOKE')"
                        icon="el-icon-error"
                        size="small"
                        type="primary"
                        @click="beforeDelOrRevise(null, 0)"
                    >
                        撤稿
                    </el-button>
                    <el-button v-if="hasPermission('ALL_INFO_RECYCLE')" icon="el-icon-delete" size="small" type="danger" @click="_goRecycle">
                        回收站
                    </el-button>
                </div>
                <el-table :data="list" row-key="id" border @selection-change="_handleSelectionChange" style="width:99%">
                    <el-table-column fixed type="selection" width="40" />
                    <div v-for="(label, key) in custom.trendsTabale" :key="key" >
                        <el-table-column v-if="label.key!='top'&&label.key!='reviewer_type'&&label.key!='id'&&label.key!='is_web'&&label.key!='is_new'&&label.key!='version'" :label="label.label" :prop="label.key">
                            <template v-if="label.key=='name'" v-slot="{ row }">
                                <img v-if="row.top" src="../images/icon-top2.png" width="25" style="vertical-align: middle" alt=""/>
                                <el-link :title="row.title" type="primary" @click="_view(row,true)">
                                    <span class="title-text">{{ row.name }}</span>
                                </el-link>
                            </template>
                            <template v-else-if="label.key=='body'" v-slot="{ row }" >
                                <!-- eslint-disable -->
                                <span v-html="row[label.key]"></span>
                            </template>
                            <template v-else-if="label.key=='reviewer_name' && custom.formId != 22" v-slot="{ row }">
                                <span v-if="row.reviewer_type && row.reviewer_name" style="color: #ff4949;">{{reviewerTxt[row.reviewer_type]}}•</span>
                                <span v-if="row.reviewer_type && !row.reviewer_name" style="color: #ff4949;">{{reviewerTxt[row.reviewer_type]}}•</span>
                                <span>{{row.reviewer_name}}</span>
                            </template>
                            <template v-else v-slot="{ row }">
                                {{ row[label.key+'~label']?row[label.key+'~label']:row[label.key]}}
                            </template>
                        </el-table-column>
                    </div>
                    <el-table-column label="操作" fixed="right" width="300" align="center">
                        <template v-slot="{ row }">
                            <el-button
                                v-if="hasPermission('INFO_UPDATE')"
                                :disabled="setDisabled(row.btnPermission)"
                                type="primary"
                                size="mini" 
                                icon="el-icon-edit"
                                @click="_operationArticle(0,true,row)"
                            >修改</el-button>
                            <el-button
                                v-if="custom.formId != 22"
                                type="warning"
                                size="mini"
                                icon="el-icon-view"
                                style="margin:0 10px"
                                @click="_preview2(row)" 
                            >预览</el-button>
                            <template v-if="custom.formId != 22">
                                <el-dropdown>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                    >更多菜单
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            v-if="hasPermission('INFO_CLONE')"
                                            :disabled="!row.btnPermission.includes('INFO_CLONE')"
                                        ><div @click="_copy(row)">复制</div></el-dropdown-item>
                                        <el-dropdown-item
                                            v-if="hasPermission('INFO_SHARE')"
                                            :disabled="!row.btnPermission.includes('INFO_SHARE')"
                                        ><div @click="_share(row)">分享</div></el-dropdown-item>
                                        <el-dropdown-item
                                            v-if="hasPermission('INFO_PUBLISH')"
                                            :disabled="!row.btnPermission.includes('INFO_PUBLISH')"
                                        ><div @click="_directrelease(1,row)">直接发布</div></el-dropdown-item>
                                        <el-dropdown-item
                                            v-if="hasPermission('INFO_CHECK_PUBLISH')"
                                            :disabled="!row.btnPermission.includes('INFO_PUBLISH')"
                                        ><div @click="_Reviewrelease(row)">审核发布</div></el-dropdown-item>
                                        <el-dropdown-item
                                            v-if="hasPermission('INFO_REVOKE')"
                                            :disabled="!row.btnPermission.includes('INFO_REVOKE')"
                                        ><div @click="beforeDelOrRevise(row,0)">撤稿</div></el-dropdown-item>
                                        <el-dropdown-item
                                            :disabled="row.reviewer_type == 1? false : true"
                                        ><div @click="_withdraw(row)">审核撤回</div></el-dropdown-item>
                                        <el-dropdown-item
                                            :disabled="row.reviewer_type == 1? false : true"
                                        ><div @click="_articleUrge(row)">催办</div></el-dropdown-item>
                                        <el-dropdown-item
                                            :disabled="row.reviewer_type == 2 ? false : true"
                                        >
                                            <div @click="beforeselectForm(row)">配置表单</div>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="custom.formId == 32 && showChannle.includes(custom.form.channelId) ">
                                            <div @click="setRecommend(row)">推荐产品</div>
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            v-if="hasPermission('INFO_DELETE')"
                                            :disabled="!row.btnPermission.includes('INFO_DELETE')"
                                        ><div style="color:#f56c6c" @click="beforeDelOrRevise(row,1)">删除</div></el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <!--eslint-disable-->
                <div class="pagination">
                    <el-pagination
                        :current-page="currentPage"
                        layout="sizes, prev, pager, next"
                        :page-size="limit"
                        :total="totalPage"
                        @size-change="_changePagsize"
                        @current-change="_changePagCustom2">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- <Modal
            :visible="isShowSource"
            title="流程跟踪"
            width="80%"
            top="5%"
            append-to-body
            custom-class="source-dialog"
            @close="(isShowSource = false,xml=null,completedIds=[],runningIds=[])"
        >
            <Viewer :completed-ids="completedIds" :running-ids="runningIds" :xml="xml" class="flow"/>
        </Modal> -->
        <tree-select-channel v-model="isShowPlainList" title="选择频道" :is-select-self="true" @on-change="getChannelId" />

        <!-- 发布 -->
        <PublishModal
            v-bind="publish"
            :custom-form-id="customFormId"
            :articleId="articleId"
            :active_Name="custom.activeName"
            :cur-channel-id="curChannelId"
            :type="publishType"
            :people="people"
            @searchTwo="_search_two"
            @closePublishModal="closePublishModal"
        />
        
        <el-dialog :title="reviseType == 0?'撤稿':'删除'" z-index="1000" :visible.sync="reviseVisible" :before-close="closeRevise">
            <el-form>
                <el-form-item :label="reviseType == 0?'撤稿流程：':'删除流程：'" prop="flowId" >
                    <el-select
                        v-model="reviseform.flowId"
                        placeholder="请选择"
                        style="width:40%"
                        clearable
                    >
                        <el-option
                            v-for="item in flowchannel"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item :label="reviseType == 0?'撤稿原因：':'删除原因：'" prop="reason">
                     <el-input v-model="reviseform.reason" type="textarea" :rows="6" maxlength="100" show-word-limit ></el-input>
                 </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="this.custom.curIndex == '0'" type="primary" @click="comitRevise">确 定</el-button>
                <el-button v-else-if="this.custom.curIndex != '0'" type="primary" @click="comitRevise2">确 定</el-button>
                <el-button style="margin-left:10px" @click="closeRevise">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分享" :visible.sync="sharedialog2" :before-close="sharedialogClose2">
            <el-form :model="form">
                <div class="shareBox">
                    <div class="shareLeft">
                        <el-form-item label="站点" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="请选择站点" @change="changeSite">
                                <el-option v-for="(site, index) in siteOptions" :key="index" :label="site.label" :value="site.value"></el-option>
                            </el-select>
                            <el-input
                                v-model="filterText"
                                clearable
                                placeholder="输入关键字进行过滤"
                                style="margin: 20px 0px 0px 0px;width:60%"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="频道" :label-width="formLabelWidth" style="height: 47vh;overflow: auto;">
                            <el-tree
                                ref="tree"
                                :data="linkChannelList"
                                show-checkbox
                                node-key="id"
                                :default-checked-keys="[checkedkey]"
                                :props="defaultProps"
                                default-expand-all
                                is-select-self
                                check-strictly
                                :filter-node-method="filterNode"
                                @check="getsharename"
                            >
                            </el-tree>
                        </el-form-item>
                    </div>
                    <div class="shareRight">
                        <span>默认分享频道：</span>
                        <div style="display:flex;justify-content:space-between; margin: 10px 0;flex-wrap: wrap;">
                            <el-tag
                               v-for="tag in defalutShareTag"
                               :key="tag.channels"
                               style="margin-bottom:10px;"
                            >
                                {{tag.channels}}
                            </el-tag>
                            <el-tag v-if="!defalutShareTag" type="danger">暂无分享频道</el-tag>
                        </div>
                        <span>已分享频道：</span>
                        <div v-for="(tag,indexs) in shareTag" :key="tag.id">
                            <p style="margin:10px 0px">文章标题：{{tag.name}}</p>
                            <div  v-for="(channel,index) in tag.channels" :key="channel.key">
                                <div class="tagbox" v-if="channel.value">
                                    <span>{{channel.value}}</span>
                                    <span style="margin-left:8px;cursor:pointer" @click="closeSharetag(indexs,index)">x</span>
                                </div>
                            </div>
                            <el-tag v-if="shareTag.length==0||!shareTag" type="danger">暂无分享频道</el-tag>
                        </div>
                        
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitaddShare">确 定</el-button>
                <el-button style="margin-left:10px" @click="sharedialogClose2">取 消</el-button>
            </div>
        </el-dialog>
        <!-- <el-dialog title="跨站共享" :visible.sync="sharedialog" :before-close="sharedialogClose">
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
        </el-dialog> -->
        <el-dialog title="自定义排序" :visible.sync="sortDialog" selection center width="80%" >
            <el-form ref="form" :model="form" style="height: 60vh;overflow: auto;">
                <el-table :data="sortData">
                    <el-table-column label="序号">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" prop="title" />
                    <el-table-column label="排序值" prop="sort" width="200">
                        <template slot-scope="scope">
                            <el-input
                                v-model="scope.row.sort"
                                onkeyup="value=value.replace(/[^\d]/g,'')"
                                @focus="inpuFocus(scope.row.id, scope.row.sort,scope.row.top)"
                                @blur="inpuBtlur(scope.row.sort)"
                                maxlength="6"
                            />
                            <!-- <el-input :id="scope.$index+'rowkeY'" size="mini" style="width:120px;" v-model="scope.row.sort"></el-input> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="置顶" >
                         <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.top"
                                active-color="#13ce66"
                                inactive-color="#DCDFE6"
                                @change="changeTop(scope.row.id, scope.row.sort,scope.row.top)"
                            />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer">
                <el-button type="primary" style="margin-right: 10px" @click="SortPreservation(false)">保存</el-button>
                <el-button type="warning" @click="SortPreservation(true)">保存并反转</el-button>
                <el-button @click="sortDialog = false">取消</el-button>
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
        <el-dialog
            title="催办"
            :visible.sync="urgeShow"
            width="30%"
            :before-close="urgeClose"
        >
            <el-form>
                <el-form-item label="催办人" >
                    <el-select
                        v-model="urgeNotice"
                        placeholder="请选择"
                        clearable
                    >
                        <el-option
                            v-for="item in urgeList"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="urgeClose">取 消</el-button>
                <el-button type="primary" @click="urgeConfirm" style="margin-left:10px">确 定</el-button>
            </div>
        </el-dialog>
        <AddCustom
            ref="edit"
            v-model="custom.ShowArticleWrapper"
            :from="custom.form"
            :title="articleWrapperTitle"
            :articleFields="custom.articleFields"
            :data="currentArticleData"
            :tagList="custom.tagList"
            @checkFormTab="checkFormTab"
        />
        <el-dialog
            title="配置表单"
            :visible.sync="configDlog"
            width="40%"
            :before-close="configDlogClose"
        >
            <el-form>
                <el-form-item label="配置目标" >
                    <el-select
                        v-model="configType"
                        placeholder="请选择"
                        clearable
                        @change="checkConfig"
                    >
                        <!-- <el-option label="留资表单" value="0"></el-option> -->
                        <el-option label="用户画像" value="1"></el-option>
                        <el-option label="AB测试" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择表单" >
                    <el-select
                        v-model="configIds"
                        placeholder="请选择"
                        clearable
                    >
                        <el-option
                            v-for="item in configOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="configDlogClose">取 消</el-button>
                <el-button type="primary" @click="configConfirm" style="margin-left:10px">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="配置推荐产品"
            :visible.sync="recommendShow"
            width="700px"
            :before-close="recommendDlogClose"
        >
            <el-form>
                <el-form-item label="选择推荐产品" >
                    <el-select
                        v-model="selectRecomd"
                        multiple
                        filterable
                        :multiple-limit="3"
                        placeholder="请选择"
                        @change="checkRecomd"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in recomdProductList"
                            :key="item.productId"
                            :label="item.name"
                            :value="item.productId"
                        ></el-option>
                    </el-select>
                    <div class="prduct-list">
                        <div class="prduct-had">
                            <div class="had-name">产品名称</div>
                            <div class="had-sort">排序</div>
                        </div>
                        <ul>
                            <li v-for="(ele, idx) in selectRecomdList" :key="ele.id">
                                <p class="prd-name">{{ele.name}}</p>
                                <el-input class="prd-sort" v-model="ele.sortIndex" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入"></el-input>
                            </li>
                        </ul>
                    </div>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="recommendDlogClose">取 消</el-button>
                <el-button type="primary" @click="recommendConfirm" style="margin-left:10px">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import {Viewer} from '@/modules/flowable/modeler'
import AddArticle from "./addArticle";
import AddCustom from "./addCustom";
import TreeSelectChannel from "../../channel/components/TreeSelectChannel";
import { mapState, mapGetters, mapActions } from "vuex";
import { showMessage, showLoading, confirm } from "@/utils";
import { previewArticle,previewCustom, NewPreviewCustom, previewCustomMobile } from "../../preview";
import siteMixin from "../../cmsmixins/siteMixin";
import PublishModal from "./publish";
import mobileMoadel from "./mobileModel/mobileModel.vue"
import "@/assets/icon/iconfont.css";
export default {
    name: "ArticleList",
    components: {
        AddArticle,
        AddCustom,
        TreeSelectChannel,
        PublishModal,
        mobileMoadel
        // Viewer
    },

    filters: {
        substringTitle(value) {
            if (!value) return "";
            // if (value.length > 12) {
            //     return value.substring(0, 12) + "...";
            // }
            return value;
        },
        substringChannel(value) {
            if (!value) return "";
            if (value.length > 8) {
                return value.substring(0, 8) + "...";
            }
            return value;
        }
    },

    mixins: [siteMixin],
    // props: {
    //     limit: {
    //         type: Number,
    //         default: 10
    //     },
    // },
    data() {
        return {
            custom: {
                addCustomArticle:false,
                CustomArticleTitle:'新增文章',
                formId: null,
                form: {},
                data:{},
                ShowArticleWrapper: false,
                activeName: 'basic',
                searchForm: {
                    status: "",
                    title: ""
                },
                trendsForm: [],
                trendsTabale: [],
                articleFields: [],
                tagList:[],
                curIndex: '0',
            },
            searchForm: {
                type: "",
                title: "",
                author: "",
                status: "",
                offline:false
            },
            channelOrder:null,
            Enable: false,
            sortData: [],
            sort_Form: {},
            sortForm: [],
            sortDialog: false,
            publish: {
                visible: false
            },
            publishCustom:false,
            customFormId: null,
            isShowEditArticleWrapper: false,
            multipleSelected: [],
            articleWrapperTitle: "新增文章",
            currentArticleData: {},
            isShowPlainList: false,
            operationType: "",
            completedIds: [],
            runningIds: [],
            xml: "",
            isShowSource: false,
            showPermission: false,
            articleId: null,
            curChannelId: null,
            // showGet: false
            // showArticle: false
            sharedialog: false,
            sharedialog2:false,
            filterText:'',
            form: {
                region: ""
            },
            formLabelWidth: "120px",
            linkChannelList: [],
            defaultProps: {
                label: "name",
                children: "children"
            },
            selectOrg: {
                orgsid: []
            },
            appid: "",
            channelId: "",
            checkedkey: [],
            publishType:'发布',
            people:false,
            //默认分享的频道
            defalutShareTag:[],
            //以分享的频道
            shareTag:[],
            ifPush:true,
            reviseVisible: false,
            reviseType: 0, // 0:撤稿  1：删除
            tabitem: null,
            reviseform: {
                type: 1,
                flowId: null,
                reason: '',
            },
            flowchannel:[],
            reviewerTxt: ['-', '审发', '直发', '审撤', '审删'], //  1 审发 ； 2 直发； 3 审撤； 4 审删 
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
            urgeShow: false,
            urgeList: [], // 催办数据
            urgeNotice: '',
            UrgeRowId: '',
            configDlog: false,
            configType: '0', // 0留资表单 1用户画像 2ab测试
            configIds: '',
            configOpt: [],
            configCapitalId: '',
            onlyvals: '',
            islookts: false,
            page: 1,
            limit: 30,
            isDel: false,
            isPaneNames: false,
            recommendShow: false, // 推荐产品弹框
            recommendArt: {},
            recomdProductList: [],
            selectRecomd: [], // 选中的推荐产品id
            selectRecomdList: [], //选中的推荐产品
            showChannle: [294, 295, 65442, 65443, 297, 298, 65446]
        };
    },

    computed: {
        // ...mapGetters('cms/site', ['site']),
        ...mapState("authen", ["userinfo","dictionary", "roles"]),
        ...mapState("cms/article", ["currentChannel"]),
        ...mapState("cms/article/articleList", [
            "list",
            "totalPage",
            // 'limit',
            "currentPage"
        ]),
        ...mapGetters("cms/site", {
            sites: "normalizeSites",
            site: "site"
        }),
        ...mapGetters("authen", ["getDictionary"]),
        articleType() {
            return this.getDictionary("articleType");
        },
        articleStatus() {
            return this.getDictionary("articleStatus");
        },
        publishStatus() {
            return this.getDictionary("publishStatus");
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
        currentChannel(v) {
            this._reset();
            this.init(v.id);
            this.custom.activeName = 'basic',
            this.$refs.listTable.clearSort();
        },
        sortDialog(v){
            if(!v){
                this.sort_Form = {}
                this.sortForm = []
            }
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        configDlog(val) {
            if(val) {
                this.querylzbd()
            }
        }
    },
    created() {
        if (!this.site.id) this.site.id = localStorage.getItem("siteId");
        this.$store.commit("cms/article/articleList/CUSTOMER_FORM", false);
        this.custom.activeName = 'basic';
        this.loadSites();
        this.init();
        //  
        if (this.hasPermission("INFO_VIEW")) {
            if (this.currentChannel.id) {
                this.getArticleList({
                    channelId: this.currentChannel.id,
                    page: 1,
                    count: this.totalPage,
                    limit:this.limit
                });
            }
        }
    },
    destroyed: function() {
        this.currentChannel.formList = [];
        this.$store.commit("cms/article/articleList/CUSTOMER_FORM", false);
    },
    mounted() {
        console.log('用户信息userinfo', this.userinfo)
        this.isDel = this.userinfo.roleCodes.includes("Taskprocessing") ? true : false
        console.log('this.isDel',this.isDel)
    },
    methods: {
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("cms/article/articleList", [
            "getArticleList",
            "moveArticle",
            "copyArticle",
            "quoteArticle",
            "releaseArticle",
            "deleteArticle",
            "processTrace",
            "revoke",
            "dataRevoke",
            "crossShare",
            "customArticle",
            "Sort",
            "SortCustom",
            "getSortList",
            "getCurrent",
            "currenDel",
            "getChannel",
            "sortingB",
            "sortingF",
            "directPublish",
            "getSharelist",
            "addShare",
            "getChanneldata",
            "setUditCancel",
            "setauditeViewer",
            "setauditNotice",
            "GrpupUserBindChannel",
            "ABtestBindChannel",
            "getProductList",
            "getProductCurrentList",
            "getProductCurrentSave",
            "moveFormArticle"
        ]),
        ...mapActions('cms/dataform',[
            'getlzCapitalList',
            'getlzCapitalBindChannel',
        ]),
        ...mapActions("cms/settings/userGroup", [
            "getUserGroupList",
        ]),
        ...mapActions('cms/settings/abtest', ['getABtestList']),
        

        async init(id) {
            let channelData = JSON.parse(localStorage.getItem("channelData"));
            this.custom.formId = null
            this.channelOrder = channelData.order || null;
            if (this.hasPermission("INFO_VIEW")) {
                if (id) {
                    showLoading(true, "文章列表加载中...");
                    await this.getArticleList({
                        channelId: id,
                        limit:this.limit
                    });
                    showLoading(false);
                }
            }
        },
        setDisabled(status) {
            let bol = this.isDel ? false : !status.includes('INFO_UPDATE') && this.userinfo.account != 'Micro'
            
            return bol
        },
        //模糊查询过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        checkFormTab(data, val){
            // console.log('data',data)
            this.custom.activeName = data.showName
            this.onlyvals = val
            this.islookts = true
            this.handleClick({index:'1', name: data.showName})
        },
        // tab 切换
        async handleClick(tab) {
            console.log('custom.form.channelId',this.custom)
            console.log('tab',tab)
            let lens = Object.keys(tab).length
            if(lens > 2) {
                this.onlyvals = ''
                this.islookts = false
                this.custom.searchForm.weiyits = ''
            }
            console.log('kens',lens)
            showLoading(true, "文章加载中...");
            this.custom.curIndex = tab.index
            this.isPaneNames = tab.name == 'basic'
            this.$store.commit("cms/article/articleList/SET_ARTICLE_LIST", [])
            if (tab.index != "0") {
                this.custom.searchForm = {
                    status: "",
                    title: ""
                }
                // console.log('this.currentChannel',this.currentChannel)
                this.$store.commit("cms/article/articleList/CUSTOMER_FORM", true);
                this.multipleSelected = [];
                this.currentChannel.formList.forEach(ele => {
                    if (ele.showName == tab.name) {
                        this.custom.formId = ele.formId;
                        this.custom.form = ele;
                    }
                });
                var res = await this.getCurrent({ channelId: this.currentChannel.id, formId: this.custom.formId });
                this.custom.trendsForm = res.data.queryFields;
                if(this.custom.formId == 22) { // 如果是产品特色需要删除审核人和状态
                    res.data.listFields.forEach((item, idx) => {
                        if (item.key == 'status'|| item.key == 'reviewer_name') {
                            res.data.listFields.splice(idx, 1)
                        }
                    })
                
                }
                console.log('res.data.listFields',res.data.listFields)
                this.custom.trendsTabale = res.data.listFields;
                this.custom.articleFields = res.data.articleFields;
                this.custom.tagList = res.data.tagList
                this.custom.trendsForm.forEach((i)=>{
                    this.custom.searchForm[i.name] = ''
                })
                this.custom.searchForm = JSON.parse(JSON.stringify(this.custom.searchForm))
                this.custom_search();
            } else {
                this.custom.formId = null
                this.$store.commit("cms/article/articleList/CUSTOMER_FORM", false);
                this._search();
            }
        },
        // 判断是否有按钮操作权限,并且不是管理员
        hasPermission(permission) {
            return (this.currentChannel.permissions || []).indexOf(permission) != -1;
        },

        _reset() {
            this.$store.commit("cms/article/articleList/SET_ARTICLE_LIST", []);
            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
            this.$store.commit("cms/article/articleList/UPDATE_TOTAL_PAGE", 0);
            this.$refs.searchForm.resetFields();
            this.searchForm.offline = false;
        },

        reloadWhenSiteChange() {
            this._reset();
        },

        checkConfig(val){
            switch(val) {
            case '0':
                this.querylzbd()
                break
            case '1':
                this.queryUserGroup()
                break
            case '2':
                this.queryABtest()
                break
            }
        },

        // 获取留资表单数据
        querylzbd() { 
            // displayName: ""
            // formName: ""
            showLoading(true, "加载中...");
            this.getlzCapitalList({ limit: 999, page: 1 }).then(res=> {
                showLoading(false)
                if(res.success) {
                    this.filterlist(res.data, '0')
                }
            }).catch(err => {
                showLoading(false)
            })
        },
        queryUserGroup(){
            showLoading(true, "加载中...");
            this.getUserGroupList({page: 0, size: 1000}).then(res => {
                showLoading(false)
                if(res.success) {
                    this.filterlist(res.data.content, '1')
                }
            }).catch(err => {
                showLoading(false)
            })
        },
        queryABtest(){
            showLoading(true, "加载中...");
            this.getABtestList({page: 0, size: 1000}).then(res => {
                showLoading(false)
                // 和用画像字段一样
                if(res.success) {
                    this.filterlist(res.data.content, '1')
                }
                
            }).catch(err => {
                showLoading(false)
            })
        },
        filterlist(list=[], type) {
            // type 0 留资表单  1用户画像 ab测试
            this.configOpt = list.map(item => {
                return {
                    value: item.id,
                    label: type == '0' ? item.formName : item.name
                }
            })
            console.log('this.configOpt', this.configOpt)
        },

        // 获取当前选中行
        _handleSelectionChange(val) {
            this.multipleSelected = val;
        },
        queryProductList() {
            showLoading(true, "数据加载中...");
            // console.log('this.custom',this.custom)
            let { id,uuid } = this.recommendArt
            let params = {
                articleId: id
            }
            this.getProductList(params).then(res => {
                // console.log('111111111', res)
                if(res.success) {
                    let list = res.data.map(item => {
                        item.sortIndex = null
                        return item
                    })
                    // console.log('list', list)
                    this.recomdProductList = list
                } else {
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
                
            }).then(() => {
                let param = {
                    articleId: uuid
                }
                this.getProductCurrentList(param).then(res => {
                    if(res.success) {
                        this.selectRecomdList = res.data
                        this.selectRecomd = res.data.length && res.data.map(item => item.productId)
                        this.selectRecomdList.forEach((item, index) => {
                            this.recomdProductList.forEach((obj) => {
                                if(item.productId == obj.productId) {
                                    obj.sortIndex = item.sortIndex
                                }
                            })
                        })
                    }
                })
            }).finally(() => {
                showLoading(false);
            })
            
        },
        // 设置推荐产品
        setRecommend(row) {
            console.log('推荐', row)
            this.recommendArt = row
            this.recommendShow = true
            
            this.queryProductList()
        },
        checkRecomd(v){
            // console.log('选择的产品', v)
            this.selectRecomdList = this.recomdProductList.filter(item => v.includes(item.productId))
            console.log('选择产品====', this.selectRecomdList)
        },
        recommendDlogClose(){
            console.log('取消修改')
            this.recommendShow = false
            this.selectRecomdList = []
            this.selectRecomd = []
        },
        recommendConfirm() {
            showLoading(true, "数据加载中...");
            console.log('保存推荐', this.selectRecomdList)
            let list = JSON.parse(JSON.stringify(this.selectRecomdList))
            list.forEach(item => {
                item.formId = this.custom.formId || null
                item.isForm = this.isPaneNames ? 0 : 1
                item.articleId = this.recommendArt.uuid
            })
            // console.log('listlist',list)
            this.getProductCurrentSave(list).then(res => {
                console.log('保存res', res)
                if(res.success) {
                    this.recommendShow = false
                    this.$message.success(res.data || '操作成功!')
                } else {
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
            }).finally(() => {
                showLoading(false);
            })
            
        },
        // 撤稿
        revokeArticle(row) {
            showLoading(true, "文章撤稿中...");
            let ids = []
            if(row.id){
                ids = [row.id]
            }else{
                this.multipleSelected.forEach((item)=>{
                    ids.push(item.id)
                })
            }
            if(!ids.length){
                showMessage({
                    type: "warning",
                    message: `请选择一篇需要撤稿的文章！`
                });
                showLoading()
            }else{
                let {flowId, reason} = this.reviseform
                this.dataRevoke({
                    id: ids.join(','),
                    formId:this.custom.formId,
                    channelId: this.currentChannel.id,
                    flowId: flowId,
                    reason: reason
                }).then(res => {
                    if (res.success) {
                        this._search_two()
                        this.closeRevise()
                        showMessage(res.errMsg||"提交成功");
                    } else {
                        showMessage({
                            type: "warning",
                            message: `${res.errMsg}`
                        });
                        showLoading()
                    }
                });
            }
        },

        // 搜索文章
        async _search() {
            this.$refs.listTable.clearSort();
            if (this.hasPermission("INFO_VIEW")) {
                showLoading(true, "文章查询中...");
                this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
                await this.getArticleList({
                    ...this.searchForm,
                    channelId: this.currentChannel.id,
                    page: 1,
                    limit:this.limit
                });
                showLoading(false);
            }
        },
        // 排序后搜索文章
        async _sortSearch() {
            // this.$refs.listTable.clearSort();
            if (this.hasPermission("INFO_VIEW")) {
                showLoading(true, "文章查询中...");
                this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
                await this.getArticleList({
                    ...this.searchForm,
                    channelId: this.currentChannel.id,
                    page: 1,
                    limit:this.limit
                });
                showLoading(false);
            }
        },
        // 搜索文章
        _search_two(){
            if(this.custom.activeName=='basic'){
                this._search()
            }else{
                this.custom_search()
            }
        },
        _resetSearch() {
            this.$refs.searchForm.resetFields();
            this.searchForm.offline = false;
            this.$refs.listTable.clearSort();
            this.init(this.currentChannel.id);
        },
        _resetSearch2(){
            Object.keys(this.custom.searchForm).forEach((i)=>{
                this.custom.searchForm[i] = ""
            })
            this._changePagCustom2(1)
        },
        _vCurrentSelected(mark) {
            if (!this.multipleSelected.length) {
                showMessage({
                    type: "warning",
                    message: `请选择一篇需要${mark}的文章！`
                });
                return false;
            } else {
                if (this.multipleSelected.length > 1) {
                    showMessage({
                        type: "warning",
                        message: `只能选择一篇需要${mark}的文章！`
                    });
                    return false;
                } else {
                    return true;
                }
            }
        },

        // 增加、修改文章
        _operationArticle(flag, v = false, row) {
            if (!v) {
                if (flag) {
                    if (this.hasPermission("INFO_VIEW") || this.userinfo.account == 'Micro') {
                        this.isShowEditArticleWrapper = true;
                        this.articleWrapperTitle = "新增文章";
                        this.currentArticleData = {
                            type: "add"
                        };
                    }
                } else {
                    // if(row.id){
                    this.articleWrapperTitle = "修改文章";
                    this.isShowEditArticleWrapper = true;
                    this.currentArticleData = {
                        type: "edit",
                        id: row.id,
                        uuid:row.uuid,
                        formUid:""
                    };
                    // }else if(this._vCurrentSelected("修改")) {
                    //     this.articleWrapperTitle = "修改文章";
                    //     this.isShowEditArticleWrapper = true;
                    //     this.currentArticleData = {
                    //         type: "edit",
                    //         id: this.multipleSelected[0].id
                    //     };
                    // }
                }
            } else {
                // 自定义
                if (flag) {
                    if (this.hasPermission("INFO_VIEW") || this.userinfo.account == 'Micro') {
                        this.custom.ShowArticleWrapper = true;
                        this.articleWrapperTitle = "新增文章";
                        this.currentArticleData = {
                            type: "add",
                            custom: true,
                        };
                    }
                } else {
                    // if(row.status.indexOf('PUBLISHING')!=-1 ||
                    //     row.status.indexOf('READY')!=-1||status.indexOf('AUDIT_')!=-1){
                    //     showMessage({
                    //         type: "warning",
                    //         message: `文章审核中不可修改！`
                    //     });
                    //     throw new Error('文章审核中不可修改！')
                    // }
                    this.articleWrapperTitle = "修改文章";
                    this.custom.ShowArticleWrapper = true;
                    this.currentArticleData = {
                        type: "edit",
                        id: row.id,
                        custom: true,
                        formId: this.custom.formId,
                        formUid:row.uuid
                    };
                }
            }
        },

        // 查看文章
        _view(row, v = false) {
            if (!v) {
                if (row.id) {
                    this.isShowEditArticleWrapper = true;
                    this.articleWrapperTitle = "查看文章";
                    this.currentArticleData = {
                        type: "view",
                        id:row.id,
                        hotword: false,
                        uuid:row.uuid
                    };
                } else {
                    if (this._vCurrentSelected("查看")) {
                        this.isShowEditArticleWrapper = true;
                        this.articleWrapperTitle = "查看文章";
                        this.currentArticleData = {
                            type: "view",
                            id: this.multipleSelected[0].id
                        };
                    }
                }
            } else {
                if (row.id) {
                    this.custom.ShowArticleWrapper = true;
                    this.articleWrapperTitle = "查看文章";
                    this.currentArticleData = {
                        type: "view",
                        id:row.id,
                        custom: true,
                        formId: this.custom.formId,
                        formUid:row.uuid
                    };
                } else {
                    if (this._vCurrentSelected("查看")) {
                        this.custom.ShowArticleWrapper = true;
                        this.articleWrapperTitle = "查看文章";
                        this.currentArticleData = {
                            type: "view",
                            id: this.multipleSelected[0].id,
                            custom: true,
                        };
                    }
                }
            }
        },

        // 移动文章
        _move(row) {
            if(!row.id){
                if (this._vCurrentSelected("移动")) {
                    this.isShowPlainList = true;
                    this.self = true;
                    this.operationType = {
                        type: "move",
                        mark: "移动",
                    };
                }
                // else{
                //     showMessage({
                //         type: "warning",
                //         message: `请选择需要移动的文章！`
                //     });
                // }
            }else{
                this.isShowPlainList = true;
                this.multipleSelected = [row]
                this.self = true;
                this.operationType = {
                    type: "move",
                    mark: "移动",
                    row:row
                };
            }
        },

        // 自定义表单移动
        handleMoveClick() {
            if (this.multipleSelected.length) {
                this.isShowPlainList = true;
                this.self = true;
                this.operationType = {
                    type: "formMove",
                    mark: "移动",
                };
            } else {
                this.$message({
                    message: '请选择一篇需要移动的文章',
                    type: 'warning'
                });
            }
        },

        // 复制文章
        _copy(row) {
            if(!row.id){
                if (this.multipleSelected.length>0) {
                    this.isShowPlainList = true;
                    this.operationType = {
                        type: "copy",
                        mark: "复制"
                    };
                }else{
                    showMessage({
                        type: "warning",
                        message: `请选择需要复制的文章！`
                    });
                }
            }else{
                this.isShowPlainList = true;
                this.self = true;
                this.multipleSelected = [row]
                this.operationType = {
                    type: "copy",
                    mark: "复制",
                };
            }
        },

        // 共享文章
        _quote() {
            if (this._vCurrentSelected("共享")) {
                this.isShowPlainList = true;
                this.operationType = {
                    type: "quote",
                    mark: "共享"
                };
            }
        },

        async getChannelId(channelId) {
            this.showPermission = true;
            showLoading(true, `${this.operationType.mark}文章中...`);
                
            // if (this.operationType.type === "formMove") {
            //     let fromArticleIdList = this.multipleSelected.map(item => item.id)
            //     await this.moveFormArticle({
            //         targetChannelId: channelId,
            //         oldChannelId: this.custom.form.channelId,
            //         fromArticleIdList: fromArticleIdList,
            //         formId: this.custom.form.formId
            //     })
            // } else {

            // }

            if (this.operationType.type === "move") {
                await this[`${this.operationType.type}Article`]({
                    channelId,
                    id: this.multipleSelected[0].id,
                    isRef: this.multipleSelected[0].shareType
                });
            } else if (this.operationType.type === "formMove") {
                let fromArticleIdList = this.multipleSelected.map(item => item.id)
                await this.moveFormArticle({
                    targetChannelId: channelId,
                    oldChannelId: this.custom.form.channelId,
                    fromArticleIdList: fromArticleIdList,
                    formId: this.custom.form.formId
                })
            } else {
                let ids = [];
                this.multipleSelected.map(item => ids.push(item.id));
                await this[`${this.operationType.type}Article`]({
                    channelId,
                    currentChannelId:this.currentChannel.id,
                    ids: ids.join(",")
                });
            }
            showLoading(false);
            showMessage(`${this.operationType.mark}成功！`);
            this.isShowPlainList = false;
            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);

            this.getArticleList({
                channelId: this.currentChannel.id,
                formId: this.operationType.type === "formMove" ? this.custom.form.formId : null,
                page: 1,
                limit:this.limit
            });
        },

        // 发布文章
        async _release() {
            if (this._vCurrentSelected("发布")) {
                this.curChannelId = this.currentChannel.id;
                this.articleId = this.multipleSelected[0].id;
                // this.publish.visible = true;
                // await this.releaseArticle({
                //     id: this.multipleSelected[0].id,
                //     channelId: this.currentChannel.id
                // }) .then(data =>{
                //     if(data.success) {
                //          this.getArticleList({
                //          channelId: this.currentChannel.id,
                //          limit:this.limit
                //         })
                //         showMessage('文章发布成功！')
                //     } else {
                //         this.$message({
                //             message: `${data.errMsg}`,
                //             type: 'warning'
                //         });
                //     }

                // })
            }
        },
        // 直接发布
        async _directrelease(index,row) {
            if(!row){
                if (!this.multipleSelected.length) {
                    showMessage({
                        type: "warning",
                        message: `请选择一篇需要发布的文章！`
                    });
                } else {
                    var ids = []
                    this.multipleSelected.forEach((item)=>{
                        if(item.status!='PUBLISH'){
                            showMessage({
                                type: "warning",
                                message: `请选择待发布状态的文章！`
                            });
                            throw new Error('请选择待发布状态的文章！')
                        }
                        ids.push(item.id)
                    })
                    this.articleId =ids.join(',');
                    this.curChannelId = this.currentChannel.id;
                    this.customFormId = this.custom.formId;
                    this.publishType = '直接发布';
                    this.people = this.dictionary.simpleFlowMode
                    this.publish.visible = true;
                }
            }else{
                this.articleId =row.id;
                this.curChannelId = this.currentChannel.id;
                this.customFormId = this.custom.formId;
                this.publishType = '直接发布';
                this.people = this.dictionary.simpleFlowMode
                this.publish.visible = true;
            }
            
        },
        // 审核发布
        async _Reviewrelease(row){
            // if (this._vCurrentSelected("审核发布")) {
            if(!row.id){
                if (!this.multipleSelected.length) {
                    showMessage({
                        type: "warning",
                        message: `请选择一篇需要发布的文章！`
                    });
                } else {
                    var ids = []
                    this.multipleSelected.forEach((item)=>{
                        var type = item['status~label']||item.statusName
                        if(type!='待发布'){
                            showMessage({
                                type: "warning",
                                message: `请选择待发布状态的文章！`
                            });
                            throw new Error('请选择待发布状态的文章！')
                        }
                        
                        ids.push(item.id)
                    })
                    this.articleId =ids.join(',');
                    this.curChannelId = this.currentChannel.id;
                    this.customFormId = this.custom.formId;
                    this.publishType = '审核发布';
                    this.people = this.dictionary.simpleFlowMode
                    this.publish.visible = true;
                }
            }else{
                this.articleId =row.id;
                this.curChannelId = this.currentChannel.id;
                this.customFormId = this.custom.formId;
                this.publishType = '审核发布';
                this.people = this.dictionary.simpleFlowMode
                this.publish.visible = true;
            }
            

        },
        async _release2(){
            showLoading('正在发布')
            this.customArticle(
                {
                    channelId:this.currentChannel.id,
                    formId:this.custom.formId,
                    dataId:this.multipleSelected[0].id
                }
            ).then((data)=>{
                showLoading(false)
                showMessage(data.data)
            }) .catch(error=>{
                showLoading(false)
                // showError(error.message)
            })
        },
        closePublishModal(needReload) {
            this.publish.visible = false;
            needReload && this.reloadSites();
        },
        async closeStatusName() {
            // this.multipleSelected[0].statusName = "发布中";
            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
            this.getArticleList({
                channelId: this.currentChannel.id,
                page: 1,
                limit:this.limit
            });
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
                    channelId: this.currentChannel.id,
                    formId: this.custom.formId,
                    dataId: this.previewRow.id,
                    target : this.currActive,
                    channlelName: this.currentChannel.viewName,
                    parentId: this.currentChannel.name == "合作渠道" ? this.currentChannel.id : this.currentChannel.pid
                }
                NewPreviewCustom(params)
                // previewCustom( this.currentChannel.id, this.custom.formId, this.previewRow.id, this.currActive);
            } else {
                previewCustomMobile(this.currentChannel.id,this.custom.formId, this.previewRow.id, this.currActive).then(res => {
                    if(res.link) {
                        // 293, 296产品 和产品下的健康保障
                        let include = [293, 296, 412]
                        this.ylUrl = `${res.link}` // include.includes(this.currentChannel.pid) ? `${res.link}?pid=${this.previewRow.id}&id=${this.currentChannel.pid}`: 
                        this.ylShow = true
                        console.log('this.ylUrl',this.ylUrl)
                    } else {
                        console.log('预览失败')
                    }
                })
                
                // this.$router.push({ name: "articleRecycle"});
            }
        },
        mobileClose(){
            this.ylShow = false
        },
        // 预览文章
        _preview() {
            this._vCurrentSelected("预览") && previewArticle(this.currentChannel.id, this.multipleSelected[0].id);
        },
        _preview2(row) {
            this.previewShow = true
            this.previewRow = row
            // previewCustom(this.currentChannel.id,this.custom.formId, row.id);
        },
        async getinitChannel(types){
            let param = {
                channel: this.currentChannel.id,
                type: types
            }
            const flow = await this.getChanneldata(param)
            if(flow.success) {
                this.reviseform.flowId = flow.data.length > 0 ? flow.data[0].id : null
                this.flowchannel = flow.data || []
            } else {
                this.$message.error(flow.errMsg|| '服务器繁忙！请稍后再试！');
            }
        },
        comitRevise(){
            if(this.reviseType == 1){
                // this._delete(this.tabitem) // 删除接口和自定义删除接口合并
                this._deleteAll2(this.tabitem, 'jc')
            } else {
                this.revokeArticle(this.tabitem)
            }
        },
        comitRevise2(){
            if(this.reviseType == 1) {
                this._deleteAll2(this.tabitem, 'diy')
            } else {
                this.revokeArticle(this.tabitem)
            }
        },
        closeRevise() {
            this.reviseVisible = false
            this.reviseform = this.$options.data().reviseform
            this.tabitem = null
        },
        beforeAllDelOrRevise(row, type){
            if (!this.multipleSelected.length) {
                return showMessage({
                    type: "warning",
                    message: `请选择需要删除的文章！`
                });
            }
            let result = this.multipleSelected.every(item => {
                return item.statusName != '审核中'
            })
            if(!result) {
                return showMessage({
                    type: "warning",
                    message: `删除所选文章中不能有在审核中的文章！`
                });
            }
            this.beforeDelOrRevise(row, type)
        },
        beforeDelOrRevise(row, type){
            this.reviseType = type
            this.reviseVisible = true
            this.tabitem = row == null ? {} : row
            let str = type == 1 ? 'RECYCLE' : 'REVOKE'
            this.getinitChannel(str)
        },
        // 审核撤回
        _withdraw(row){
            console.log('审核撤回',row)
            showLoading(true, "撤回中...");
            let streData = JSON.parse(localStorage.getItem("channelData"));
            let params = {
                // appId 站点ID； channelId 频道ID； formId表单ID ； ids  文章ID 多个字符串英文逗号分割
                appId: streData.appid,
                channelId: this.currentChannel.id,
                formId: this.custom.formId,
                ids: row.id
            }
            this.setUditCancel(params).then(res => {
                console.log('撤回res',res)
                if(res.success) {
                    showMessage(res.data||'操作成功!');
                    this.getArticleList({
                        channelId: this.currentChannel.id,
                        page: 1,
                        limit:this.limit
                    });
                } else {
                    showMessage(res.errMsg||'操作失败!');
                }
                
                showLoading(false);
            }).catch(err => { showLoading(false) })
            
        }, 

        //配置表单
        beforeselectForm(row){
            // if (!this.multipleSelected.length) {
            //     return showMessage({
            //         type: "warning",
            //         message: `请选择一篇需要配置的文章！`
            //     });
            // }
            this.configCapitalId = row.id
            this.configDlog = true
        },
        // 配置表单关闭
        configDlogClose() {
            this.configDlog = false
            this.configType = '0'
            this.configIds = ''
        },
        configConfirm(){
            if(this.configType &&  this.configIds) {
                // let capital = this.multipleSelected.map(ele => ele.id)
                let params = {
                    ids: [this.configCapitalId],
                    formId: this.custom.formId,
                    channelId: this.currentChannel.id,
                    isForm: this.custom.formId ? 1 : 0, 
                    capitalFromId: this.configIds,
                }
                if(this.configType == '0') {
                    // 留资配置
                    this.getlzCapitalBindChannel(params).then(res => {
                        if(res.success) {
                            showMessage(res.data)
                            this.configDlogClose()
                        } else {
                            showMessage(res.errMsg|| '服务异常，稍后再试!')
                        }
                    })
                }
                if(this.configType == '1') {
                    // 用户画像配置
                    let params = {
                        groupId: this.configIds,
                        pageId: this.configCapitalId,
                        channelId: this.currentChannel.id
                    }
                    this.GrpupUserBindChannel(params).then(res => {
                        if(res.success) {
                            showMessage(res.data)
                            this.configDlogClose()
                        } else {
                            showMessage.error(res.errMsg|| '服务异常，稍后再试!')
                        }
                    })
                }
                if(this.configType == '2') {
                    // AB测试配置
                    let params = {
                        testId: this.configIds,
                        pageId: this.configCapitalId,
                        channelId: this.currentChannel.id
                    }
                    this.ABtestBindChannel(params).then(res => {
                        if(res.success) {
                            showMessage(res.data)
                            this.configDlogClose()
                        } else {
                            showMessage.error(res.errMsg|| '服务异常，稍后再试!')
                        }
                    })
                }
                
            } else {
                showMessage({
                    type: "warning",
                    message: `配置目标表单为必选!`
                });
            }
        },
        // 催办文章
        _articleUrge(row){
            console.log('催办row',row)
            showLoading(true, "加载中...");
            let params = {
                channelId: this.currentChannel.id,
                formId: this.custom.formId,
                id: row.id
            }
            this.UrgeRowId = row.id
            this.setauditeViewer(params).then(res => {
                console.log('催办数据', res)
                if(res.success) {
                    this.urgeShow = true
                    this.urgeList = res.data
                } else {
                    showMessage(res.errMsg||'操作失败!');
                }
                showLoading(false)
            }).catch(err => { showLoading(false) })
        },
        // 催办确认
        urgeConfirm(){
            if(this.urgeNotice == '') {
                showMessage({
                    type: "warning",
                    message: `请选择一个催办人！`
                });
            } else {
                showLoading(true, "催办中...");
                // channelId 频道ID ，formId 表单ID， id 文章ID ,  notice 用户账号
                let params = {
                    channelId: this.currentChannel.id,
                    formId: this.custom.formId,
                    id: this.UrgeRowId,
                    notice: this.urgeNotice
                }
                this.setauditNotice(params).then(res => {
                    console.log('催办确认res',res)
                    if(res.success) {
                        showMessage(res.data||'操作成功!');
                        this.urgeClose()
                        this.getArticleList({
                            channelId: this.currentChannel.id,
                            page: 1,
                            limit:this.limit
                        });
                    } else {
                        showMessage(res.errMsg||'操作失败!');
                    }
                    showLoading(false)
                }).catch(err => { showLoading(false) })
            }
        },
        // 催办取消
        urgeClose(){
            this.urgeList = []
            this.urgeNotice = ''
            this.urgeShow = false
            this.UrgeRowId = ''
        },
        // 删除文章
        _delete(row) {
            if(!row.id){
                if (!this.multipleSelected.length) {
                    showMessage({
                        type: "warning",
                        message: `请选择一篇需要删除的文章！`
                    });
                } else {
                    confirm("确定删除这些文章吗？", "警告", {
                        ok: async () => {
                            showLoading(true, "文章删除中...");
                            let ids = [];
                            this.multipleSelected.map(item => ids.push(item.id));
                            let {flowId, reason} = this.reviseform
                            let streData = JSON.parse(localStorage.getItem("channelData"));
                            await this.deleteArticle({
                                ids: ids.join(","),
                                channelId: this.currentChannel.id,
                                shareType: this.multipleSelected[0].shareType,
                                formId: this.custom.formId == null ? 0 : this.custom.formId,
                                appId: streData.appid,
                                flowId: flowId,
                                reason: reason
                            });
                            showLoading(false);
                            showMessage("文章删除成功！");
                            this.closeRevise()
                            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
                            this.getArticleList({
                                channelId: this.currentChannel.id,
                                page: 1,
                                limit:this.limit
                            });
                        }
                    });
                }
            }else{
                confirm("确定删除这些文章吗？", "警告", {
                    ok: async () => {
                        showLoading(true, "文章删除中...");
                        await this.deleteArticle({
                            ids:row.id,
                            channelId: this.currentChannel.id,
                            shareType: row.shareType
                        });
                        showLoading(false);
                        showMessage("文章删除成功！");
                        this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
                        this.getArticleList({
                            channelId: this.currentChannel.id,
                            page: 1,
                            limit:this.limit
                        });
                    }
                });
            }
           
        },

        // 回收站
        _goRecycle() {
            this.$router.push({ name: "articleRecycle" ,query:{formId:this.custom.formId}});
        },
        // 基础文章设置每页数量
        async _changeactPagsize(v) {
            this.limit = v
            await this.getArticleList({
                channelId: this.currentChannel.id,
                page: this.limit,
                limit: v,
                ...this.searchForm
            });
            showLoading(false);
        },
        // 翻页
        async _changePagination(v) {
            showLoading(true, "文章列表加载中...");
            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", v);
            this.page = v
            await this.getArticleList({
                channelId: this.currentChannel.id,
                page: v,
                limit:this.limit,
                ...this.searchForm
            });
            showLoading(false);
        },
        async _changePagCustom(v) {
            showLoading(true, "文章列表加载中...");
            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", v);
            await this.getArticleList({
                channelId: this.currentChannel.id,
                page: v,
                limit:this.limit,
                ...this.searchForm
            });
            showLoading(false);
        },
        // 自定义表单设置每页数量
        async _changePagsize(v) {
            showLoading(true, "文章列表加载中...");
            // this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", v);
            this.limit = v
            await this.getArticleList({
                param: JSON.stringify(this.custom.searchForm),
                channelId: this.currentChannel.id,
                formId: this.custom.formId,
                page: this.limit,
                limit: v
            });
            showLoading(false);
        },
        // 自定义表单翻页
        async _changePagCustom2(v){
            console.log('当前页面', v)
            showLoading(true, "文章列表加载中...");
            this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", v);
            this.page = v
            await this.getArticleList({
                param: JSON.stringify(this.custom.searchForm),
                channelId: this.currentChannel.id,
                formId: this.custom.formId,
                page: v,
                limit: this.limit
            });
            showLoading(false);
        },
        //分享
        async _share(row) {
            if(!row.id){
                if(this.multipleSelected.length==0){
                    showMessage({
                        type: "warning",
                        message: `请选择一篇需要分享的文章！`
                    });
                    return
                }
                let ids = [];
                for(let i = 0 ;i<this.multipleSelected.length;i++){
                    ids.push(this.multipleSelected[i].id)
                    let obj ={}
                    obj.id = this.multipleSelected[i].id,
                    obj.name = this.multipleSelected[i].title
                    let channels = []
                    obj.channels = channels
                    this.shareTag.push(obj)
                }
                this.articleId = this.multipleSelected[0].id;
                showLoading(true)
                this.sharedialog2 = true;
                let data = await this.getSharelist({
                    channelId: this.currentChannel.id,
                    ids:ids.join(","),
                });
                showLoading(false);
                this.shareTag = data.data.channelShare
                this.defalutShareTag = data.data.defaultShare
            }else{
                let obj ={}
                obj.id = row.id,
                obj.name = row.title
                let channels = []
                obj.channels = channels
                this.shareTag.push(obj)
                showLoading(true)
                this.articleId = row.id
                this.sharedialog2 = true;
                let data = await this.getSharelist({
                    channelId: this.currentChannel.id,
                    ids:row.id
                });
                showLoading(false);
                this.shareTag = data.data.channelShare
                this.defalutShareTag = data.data.defaultShare
            }
            this.shareTag.forEach(item=>{
                item.channels.forEach(item2=>{
                    this.checkedkey.push(item2.key)
                })
            })
            this.curChannelId = this.currentChannel.id;
        },
        //跨站共享
        _CrosssiteShared() {
            if (this._vCurrentSelected("跨站共享")) {
                this.articleId = this.multipleSelected[0].id;
                this.curChannelId = this.currentChannel.id;
                this.sharedialog = true;
            }
        },
        changeSite() {
            showLoading()
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
        //树形只能选择一个
        getname(data) {
            this.appid = data.appid;
            this.channelId = data.id;
            let i = this.$refs.tree.getCheckedNodes().length;
            if (i == 2) {
                this.$refs.tree.setCheckedKeys([data.id]);
            }
        },

        //树形只能选择一个
        getsharename(data) {
            this.ifPush = true
            for(var i=0;i<this.shareTag.length;i++){
                for(var j = 0;j<this.shareTag[i].channels.length;j++){
                    if(Number(this.shareTag[i].channels[j].key) === data.id){
                        this.shareTag[i].channels.splice(j,1)
                        this.checkedkey.forEach((item,index)=>{
                            if(item == data.id){
                                this.checkedkey.splice(index,1)
                            }
                        })
                        this.ifPush=false
                    }else{
                        this.ifPush=true
                    }
                }
            
            }
            if(this.ifPush){
                let obj ={
                    key:data.id,
                    value:data.name
                }
                this.shareTag.forEach(item=>{
                    item.channels.push(obj)
                })
                this.checkedkey.push(data.id) 
            }
            
        },
        closeSharetag(indexs,index){
            this.shareTag[indexs].channels.splice(index,1)
            var arr = []
            this.shareTag.forEach(item=>{
                item.channels.forEach(i=>{
                    if(this.shareTag[indexs].channels.indexOf(i.key)== -1){
                        arr.push(i.key)
                    }
                })

            })
            this.checkedkey = Array.from(new Set(arr))
            this.$refs.tree.setCheckedKeys(this.checkedkey)
        },
        async submitaddShare(){
            showLoading(true)
            let res = await this.addShare({
                channelId: this.currentChannel.id,
                vos:this.shareTag
            });
            showLoading(false)
            if(res.success){
                showMessage("分享成功");
                this.sharedialogClose2()
            }else{
                this.$message.error(res.errMsg);
            }
        },
        //递归设置子节点和父节点
        setNode(node) {
            if (node.checked) {
                //如果当前是选中checkbox,则递归设置父节点和父父节点++选中
                this.setParentNode(node);
            } else {
                this.setChildNode(node);
            }
        },
        //递归设置父节点全部选中
        setParentNode(node) {
            if (node.parent) {
                for (const key in node) {
                    if (key === "parent") {
                        node[key].checked = true;
                        this.setParentNode(node[key]);
                    }
                }
            }
        },
        //递归设置子节点全部取消选中
        setChildNode(node) {
            if (node.childNodes && node.childNodes.length) {
                node.childNodes.forEach(item => {
                    item.checked = false;
                    this.setChildNode(item);
                });
            }
        },
        submitcrossShare() {
            let ids = [];
            this.multipleSelected.map(item => ids.push(item.id));
            this.crossShare({
                ids: ids.join(","),
                channelId: this.channelId,
                appid: this.appid
            }).then(res => {
                if (res.success) {
                    showMessage("分享成功");
                    this.sharedialog = false;
                } else {
                    showMessage({
                        type: "warning",
                        message: `${res.errMsg}`
                    });
                }
            });
        },
        //关闭弹框
        sharedialogClose() {
            this.linkChannelList = [];
            this.form.region = "";
            this.selectOrg.orgsid = [];
            this.sharedialog = false;
        },
        sharedialogClose2() {
            this.linkChannelList = [];
            this.form.region = "";
            this.selectOrg.orgsid = [];
            this.sharedialog2 = false;
            this.filterText = "";
            this.shareTag = []
            this.checkedkey=[]
        },
        //排序
        async sortChange(v) {
            if (v.order == "descending") {
                this.Enable = false;
            } else {
                this.Enable = true;
            }
            let res = await this.Sort({
                channel: this.currentChannel.id,
                field: v.prop,
                asc: this.Enable
            });
            if (res.success) {
                showMessage(res.data);
                this._sortSearch();
            } else {
                this.$message.error(res.errMsg);
            }
        },
        async SortPreservation(reverse) {
            let list = [];
            // if (!reverse) {
            let obj = {};
            list = this.sortForm.reduce((cur, next) => {
                obj[next.art] ? "" : (obj[next.art] = true && cur.push(next));
                return cur;
            }, []);
            // }
            let res = null
            if(this.custom.activeName=='basic'){
                res = await this.SortCustom({
                    channel: this.currentChannel.id,
                    reverse,
                    list
                });
            }else{
                res = await this.sortingF({
                    channel: this.currentChannel.id,
                    form:this.custom.formId,
                    reverse,
                    list
                });
            }
            if (res.success) {
                showMessage(res.data);
                this.sortDialog = false;
                this.custom.activeName=='basic'?this._search():this.custom_search()
            } else {
                this.$message.error(res.errMsg);
            }
        },
        async _goSort() {
            showLoading(true, "文章列表加载中...");
            let data = await this.getSortList({
                channelId: this.currentChannel.id,
            });
            showLoading(false);
            this.sortDialog = true;
            this.sortData = data;
        },
        async _goSort1() {
            showLoading(true, "文章列表加载中...");
            this.sortData = []
            let {data} = await this.sortingB({
                channelId: this.currentChannel.id,
                formId: this.custom.formId,
            });
            data.forEach(i=>{
                this.sortData.push({
                    id: i.id,
                    title:i.name,
                    sort:i.sort,
                    top:i.top
                })
            })
            showLoading(false);
            this.sortDialog = true;
        },
        inpuFocus(art, sort,top) {
            this.sort_Form = { art, sort, top};
        },
        inpuBtlur(e) {
            e *= 1;
            let _data = this.sort_Form;
            if (_data.sort != e) {
                _data.sort = e;
                this.sortForm.push(_data);
                this.sortForm.forEach(ele => {
                    if (ele.art === _data.art) {
                        ele.sort = e;
                    }
                });
            }
        },
        changeTop(art,sort,top){
            this.sort_Form = { art, sort, top};
            this.sortForm.push(this.sort_Form);
        },
        // 自定义表单
        // 搜索
        async custom_search(val) {
            showLoading(true, "文章查询中...");
            // let param = []
            // Object.keys(this.custom.searchForm).forEach(key=>{
            //     param.push({key,value:this.custom.searchForm[key]})
            // })
            if(val == 1) {
                this.islookts = false
            }
            console.log('搜索', this.islookts, this.onlyvals)
            if(this.custom.formId == 22 && this.islookts) {
                this.custom.searchForm.weiyits = this.onlyvals
            }
            let res = await this.getArticleList({
                // param:JSON.stringify(param),
                param:JSON.stringify({...this.custom.searchForm}),
                channelId: this.currentChannel.id,
                formId: this.custom.formId,
                page: 1,
                limit:this.limit
            });
            if(res){
                showLoading(false);
            }
        },

        // >删除
        _deleteAll() {
            if (!this.multipleSelected.length) {
                showMessage({
                    type: "warning",
                    message: `请选择需要删除的文章！`
                });
            } else {
                confirm("确定删除这些文章吗？", "警告", {
                    ok: async () => {
                        showLoading(true, "文章删除中...");
                        let ids = [];
                        this.multipleSelected.map(item => ids.push(item.id));
                        await this.deleteArticle({
                            ids: ids.join(","),
                            channelId: this.currentChannel.id,
                            shareType: this.multipleSelected[0].shareType
                        });
                        showLoading(false);
                        showMessage("文章删除成功！");
                        this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
                        this.getArticleList({
                            channelId: this.currentChannel.id,
                            page: 1,
                            limit:this.limit
                        });
                    }
                });
            }
        },
        _deleteAll2(row, type) {
            // console.log('文章伤处', row)
            let ids = [];
            if (!row.id) {
                if (!this.multipleSelected.length) {
                    showMessage({
                        type: "warning",
                        message: `请选择需要删除的文章！`
                    });
                } else {
                    this.multipleSelected.forEach(ele => {
                        ids.push(ele.id);
                    });
                    this.DEL(ids, type);
                }
            } else {
                ids.push(row.id);
                this.DEL(ids, type);
            }
        },
        DEL(ids, type) {
            confirm("确定删除此文章吗？", "警告", {
                ok: async () => {
                    showLoading(true, "文章删除中...");
                    let {flowId, reason} = this.reviseform
                    let res = await this.currenDel({
                        appId: this.site.id,
                        channelId: this.currentChannel.id,
                        formId: this.custom.formId,
                        ids: ids.join(","),
                        flowId: flowId,
                        reason: reason
                    });
                    showLoading(false);
                    if(res.success){
                        showMessage(res.errMsg||"文章删除成功！");
                        this.closeRevise()
                        this.$store.commit("cms/article/articleList/UPDATE_CURRENT_PAGE", 1);
                        // this.custom_search();
                        if(type == 'jc' ) {
                            this.getArticleList({
                                channelId: this.currentChannel.id,
                                page: 1,
                                limit:this.limit
                            });
                        } else {
                            this.custom_search();
                        }
                    }
                }
            });
        },

    },
};
</script>
<style lang="scss" scoped>

/deep/ * {
    margin: 0;
    padding: 0;
}
.search-wrapper {
    /deep/ .el-form-item {
        margin-right: 20px;

        &:last-child {
            .el-form-item__content {
                width: auto;
            }
        }

        .el-form-item__content {
            width: 130px;
        }
    }
}
.article-list-operation {
    .el-button {
        float: left;
    }
}
/deep/.el-button + .el-button {
    margin-left: 0;
    margin-right: 10px;
}
.type {
    text-align: center;
}
.flow {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
}
/deep/ .el-dialog__headerbtn {
    z-index: 999;
    font-size: 32px;
}
.viewport {
    margin-left: 200px;
}
.channel-wrapper {
    /deep/ .el-button--success {
        margin-right: 10px;
    }
}
/deep/ .el-input__inner {
    padding-right: 10px !important;
    padding-left: 10px !important;
}
/deep/ .el-tabs__nav-scroll {
    background: #f5f7fa;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: #fff;
}
.btn {
    margin-bottom: 15px;
}
.pagination{
    padding-top: 10px;
    text-align: right;
}
.shareBox{
    display: flex;
    justify-content: space-between;
}
.shareLeft{
    width:60%;
    border-right: 1px solid #ddd;
}
.shareRight{
    flex:1;
    padding:0 30px;
}
.prduct-list{
    margin-top: 20px;
    .prduct-had{
        display: flex;
        margin-bottom: 10px;
        border-bottom: 2px solid #e6e6e6;
        .had-name{
            width: 400px;
            margin-right: 10px;
        }
    }
    ul{
        list-style: none;
        li{
            display: flex;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid #dcdfe6;
            .prd-name{
                width: 400px;
                margin-right: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .prd-sort {
                width: 100px;
            }
        }
    }
}
.tagbox{
    background-color: #e8f4ff;
    border-color: #d1e9ff;
    color: #1890ff;
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #1890ff;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
    margin-right: 15px;
    margin-bottom:10px
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
