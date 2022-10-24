<template>
    <div class="filexplorer">
        <TableRow>
            <el-card class="card-container">
                <template #header>
                    <div class="file-header">
                        <div class="file-header-left">
                            
                        </div>
                        <div class="file-header-right">
                            <div>
                                <el-button @click="_cancel">返回列表</el-button>
                            </div>
                            <div>
                                <el-button type="primary" @click="_reloadFiles">刷新</el-button>
                            </div>
                            <!-- <el-button type="primary" @click="_uploadFile">上传文件</el-button> -->
                            <el-upload
                                action
                                :multiple="false"
                                :show-file-list="false"
                                :http-request="_uploadFile"
                            >
                                <el-button type="primary">上传文件</el-button>
                                <template v-slot:tip>
                                    <div class="el-upload__tip">文件不能超过 10MB</div>
                                </template>
                            </el-upload>
                        </div>
                    </div>
                </template>
                <el-tabs v-model="activeName" type="border-card" @tab-click="switcher">
                    <el-tab-pane label="CSS" name="css">
                        <el-table :data="list" class>
                            <el-table-column label="文件名" prop="filename">
                                <template v-slot="{row, $index}">
                                    <a
                                        href="javascript:;"
                                        :class="'filename ' + (row.isDirectory ? '': 'file')"
                                        @click="_openFile(row)"
                                    >{{row.filename}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="文件类型" prop="isDirectory" align="center">
                                <template v-slot="{row}">{{row.isDirectory ? '文件夹': '文件'}}</template>
                            </el-table-column>
                            <el-table-column label="大小" prop="size">
                                <template v-slot="{row}">
                                    <span v-if="!row.isDirectory">{{ row.size | fileFormatUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="最后更新时间" prop="lastModified">
                                <template v-slot="{row}">{{ row.lastModified | dateFormat}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot="{row}">
                                    <el-button
                                        v-if="canEdit(row)"
                                        size="mini"
                                        type="warning"
                                        @click="_openFile(row)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="showDownload(row)"
                                        type="primary"
                                        size="mini"
                                        @click="_downloadFile(row)"
                                    >下载</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="JS" name="js">
                        <el-table :data="list" class>
                            <el-table-column label="文件名" prop="filename">
                                <template v-slot="{row, $index}">
                                    <a
                                        href="javascript:;"
                                        :class="'filename ' + (row.isDirectory ? '': 'file')"
                                        @click="_openFile(row)"
                                    >{{row.filename}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="文件类型" prop="isDirectory" align="center">
                                <template v-slot="{row}">{{row.isDirectory ? '文件夹': '文件'}}</template>
                            </el-table-column>
                            <el-table-column label="大小" prop="size">
                                <template v-slot="{row}">
                                    <span v-if="!row.isDirectory">{{ row.size | fileFormatUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="最后更新时间" prop="lastModified">
                                <template v-slot="{row}">{{ row.lastModified | dateFormat}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot="{row}">
                                    <el-button
                                        v-if="canEdit(row)"
                                        size="mini"
                                        type="warning"
                                        @click="_openFile(row)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="showDownload(row)"
                                        type="primary"
                                        size="mini"
                                        @click="_downloadFile(row)"
                                    >下载</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="图片" name="image">
                        <el-table :data="list" class>
                            <el-table-column label="文件名" prop="filename">
                                <template v-slot="{row, $index}">
                                    <a
                                        href="javascript:;"
                                        :class="'filename ' + (row.isDirectory ? '': 'file')"
                                        @click="_openFile(row)"
                                    >{{row.filename}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="文件类型" prop="isDirectory" align="center">
                                <template v-slot="{row}">{{row.isDirectory ? '文件夹': '文件'}}</template>
                            </el-table-column>
                            <el-table-column label="大小" prop="size">
                                <template v-slot="{row}">
                                    <span v-if="!row.isDirectory">{{ row.size | fileFormatUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="最后更新时间" prop="lastModified">
                                <template v-slot="{row}">{{ row.lastModified | dateFormat}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot="{row}">
                                    <el-button
                                        v-if="canEdit(row)"
                                        size="mini"
                                        type="warning"
                                        @click="_openFile(row)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="showDownload(row)"
                                        type="primary"
                                        size="mini"
                                        @click="_downloadFile(row)"
                                    >下载</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="附件" name="attach">
                        <el-table :data="list" class>
                            <el-table-column label="文件名" prop="filename">
                                <template v-slot="{row, $index}">
                                    <a
                                        href="javascript:;"
                                        :class="'filename ' + (row.isDirectory ? '': 'file')"
                                        @click="_openFile(row)"
                                    >{{row.filename}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="文件类型" prop="isDirectory" align="center">
                                <template v-slot="{row}">{{row.isDirectory ? '文件夹': '文件'}}</template>
                            </el-table-column>
                            <el-table-column label="大小" prop="size">
                                <template v-slot="{row}">
                                    <span v-if="!row.isDirectory">{{ row.size | fileFormatUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="最后更新时间" prop="lastModified">
                                <template v-slot="{row}">{{ row.lastModified | dateFormat}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot="{row}">
                                    <el-button
                                        v-if="canEdit(row)"
                                        size="mini"
                                        type="warning"
                                        @click="_openFile(row)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="showDownload(row)"
                                        type="primary"
                                        size="mini"
                                        @click="_downloadFile(row)"
                                    >下载</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="主题" name="theme">
                        <el-table :data="list" class>
                            <el-table-column label="文件名" prop="filename">
                                <template v-slot="{row, $index}">
                                    <a
                                        href="javascript:;"
                                        :class="'filename ' + (row.isDirectory ? '': 'file')"
                                        @click="_openFile(row)"
                                    >{{row.filename}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="文件类型" prop="isDirectory" align="center">
                                <template v-slot="{row}">{{row.isDirectory ? '文件夹': '文件'}}</template>
                            </el-table-column>
                            <el-table-column label="大小" prop="size">
                                <template v-slot="{row}">
                                    <span v-if="!row.isDirectory">{{ row.size | fileFormatUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="最后更新时间" prop="lastModified">
                                <template v-slot="{row}">{{ row.lastModified | dateFormat}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot="{row}">
                                    <el-button
                                        v-if="canEdit(row)"
                                        size="mini"
                                        type="warning"
                                        @click="_openFile(row)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="showDownload(row)"
                                        type="primary"
                                        size="mini"
                                        @click="_downloadFile(row)"
                                    >下载</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <!-- <el-table :data="files" class>
                    <el-table-column label="文件名" prop="filename">
                        <template v-slot="{row, $index}">
                            <a
                                href="javascript:;"
                                :class="'filename ' + (row.isDirectory ? '': 'file')"
                                @click="_openFile(row)"
                            >{{row.filename}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="文件类型" prop="isDirectory" align="center">
                        <template v-slot="{row}">{{row.isDirectory ? '文件夹': '文件'}}</template>
                    </el-table-column>
                    <el-table-column label="大小" prop="size">
                        <template v-slot="{row}">
                            <span v-if="!row.isDirectory">{{ row.size | fileFormatUnit}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后更新时间" prop="lastModified">
                        <template v-slot="{row}">{{ row.lastModified | dateFormat}}</template>
                    </el-table-column>
                    <el-table-column>
                        <template v-slot="{row}">
                            <el-button
                                v-if="canEdit(row)"
                                size="mini"
                                type="warning"
                                @click="_openFile(row)"
                            >编辑</el-button>
                            <el-button
                                v-if="showDownload(row)"
                                type="primary"
                                size="mini"
                                @click="_downloadFile(row)"
                            >下载</el-button>
                        </template>
                    </el-table-column>
                </el-table> -->
            </el-card>
        </TableRow>

        <!-- 编辑文件 -->
        <EditFileModal :updatetype="updatetype"/>
        <!-- 编辑文件 -->
    </div>
</template>
<style lang="scss">
.filexplorer {
    .file-header {
        display: flex;
        justify-content: space-between;
        .file-header-left {
            line-height: 36px;
            display: flex;
            .site-name,
            .el-breadcrumb {
                line-height: 36px;
            }
            .file-crumb-path {
                .el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner {
                    &:hover {
                        cursor: pointer;
                        color: #409eff;
                    }
                }
            }
        }
        .site-name {
            margin-right: 15px;
            text-decoration: none;
            color: #409eff;
        }
        .file-header-right {
            display: flex;
            line-height: inherit;
            & > *:not(:last-child) {
                margin-right: 10px;
            }
        }
    }
    tbody {
        td {
            a {
                text-decoration: none;
                color: #606266;
                &.file {
                    color: #303133;
                }
                &.up {
                    font-weight: bold;
                    color: #e6a23c;
                }
                &.filename {
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
    .el-upload__tip {
        font-size: 12px;
        color: #606266;
        line-height: 1;
        position: relative;
        top: 0px;
    }
}
</style>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { showLoading, /* showMessage, */ showError } from '../../../../utils'
import EditFileModal from './dialogs/editFile'
import config from './config'
const { supportEditFileExts, fileRepeatCode } = config
export default {
    name: 'Filexplorer',
    components: {
        EditFileModal
    },
    data() {
        return {
            // 站点ID
            appid: '',
            site: {},
            activeName: 'css',

            typeData:{
                type: 'css',
                appid: '',
            },
            updatetype : ''
        }
    },
    computed: {
        ...mapState('cms/site/filexplorer', ['type', 'files','list']),
        ...mapGetters('cms/site', ['getSite']),
        ...mapGetters('authen', ['getAttachModule']),
        showDownload() {
            return file => {
                return !file.isDirectory
            }
        },
        canEdit() {
            return file => {
                if (file.isDirectory) {
                    return false
                }
                const fileExt = this.getFileExt(file.filename)
                return this.isSupportEdit(fileExt)
            }
        },
    },
    created() {
        this.appid = this.$route.params.id
        this.site = this.getSite(this.appid)
        if (!this.site.id) {
            // 若无站点信息，可能是刷新照成的，重新拉去
            showLoading(true)
            this.loadSites().then(() => {
                showLoading(false)
                this.site = this.getSite(this.appid)
                if (this.site.id) {
                    this.loadFiles([])
                } else {
                    // 拉取的站点信息依然为空
                    showError('站点信息获取失败')
                }
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        } else {
            this.loadFiles([])
        }
    },
    methods: {
        ...mapActions('cms/site/filexplorer', [' _readFiles','_readFiles', 'readFile', 'writeFile', 'uploadFile', 'downloadFile']),
        ...mapActions('cms/site', ['loadSites']),
        ...mapActions("cms", ["fileUpload"]),

        getFileExt(filename) {
            // 获取文件扩展名
            if (filename) {
                const index = filename.lastIndexOf('.')
                if (index > -1) {
                    return filename.substr(index + 1)
                }
            }
            return ''
        },
        isSupportEdit(fileExt = '') {
            // 是否支持编辑 @see config.js -> supportEditFileExts
            return supportEditFileExts.indexOf(fileExt.toLowerCase()) > -1
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                if (columnIndex === 0) {
                    return [1, 5]
                } else {
                    return [0, 0]
                }

            }
        },
        _openFile(file) {
            
            const fileExt = this.getFileExt(file.filename)
            if (this.isSupportEdit(fileExt)) {
                // 支持编辑 则编辑文件
                this._readFile(file)
                return
            }
            // 否则下载文件
            this._downloadFile(file)
        },
        _toFilePath(path, isLast) {
            // 点击文件路径，获取某个路径下的文件列表
            if (isLast) {
                // 最后一个目录不用点击
                return
            }
            if (path === '') {
                this.loadFiles()
                return
            }
            const type = [...this.type]
            const index = type.indexOf(path)
            const toPaths = type.slice(0, index + 1)
            this.loadFiles(toPaths)
        },
        _readFile(file) {
            // 文件编辑
            const appid = this.appid
            const type = this.updatetype
            showLoading(true)
            this.readFile({ appid, file, type}).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        _filesList() {
            // const appid = this.appid
            showLoading(true,'正在加载文件')
            this.typeData.appid = this.appid
            this._readFiles({ ...this.typeData }).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        _downloadFile({ filename }) {
            // 文件下载
            // const type = this.type
            const appid = this.appid
            showLoading(true, '正在下载...')
            this.downloadFile({ appid, type: this.activeName, filename }).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        _uploadFile({ file, onError, onSuccess }) {
            const { type: module, limit = 0 } = this.getAttachModule('fileAppExplorer')
            const isLimit10M = file.size / 1024 / 1024 < limit
            if (!isLimit10M) {
                showError(`文件不能超过 ${limit} MB`)
                onError(`文件不能超过 ${limit} MB`)
                return false
            }
            const appid = this.appid
            // const type = this.type
            // const type = this.typeData.type
            const flag = '' // 默认为空，0 表示重命名 1 表示覆盖
            this.realUploadFile({
                module,
                appid,
                file,
                type: this.activeName,
                flag
            }).then(() => {
                onSuccess()
                this._filesList()
            }).catch(() => {
                onError()
            })
        },
        _reloadFiles() {
            this.typeData.type = this.activeName
            this._filesList();
        },
        realUploadFile(fileParams, onError, onSuccess) {
            showLoading(true, '正在上传')
            return this.uploadFile(fileParams).then(rest => {
                showLoading(false)
                if (!rest.success && Number(rest.code) === fileRepeatCode) {
                    return this.$confirm('文件名重复,是否覆盖', '确认', {
                        distinguishCancelAndClose: true,
                        closeOnPressEscape: false,
                        cancelButtonText: '重命名',
                        confirmButtonText: '覆盖'
                    }).then(() => {
                        // 覆盖
                        fileParams.flag = 0
                        return this.realUploadFile(fileParams)
                    }).catch(action => {
                        if (action === 'cancel') {
                            // 重命名
                            fileParams.flag = 1
                            return this.realUploadFile(fileParams)
                        }
                        return Promise.resolve('取消上传')
                    })
                }
                return Promise.resolve(rest.message)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
                return Promise.reject(error)
            })
        },
        loadFiles(type = [], isReload = false) {
            showLoading(true, '正在加载文件')
            this. _readFiles({
                appid: this.appid,
                type: this.activeName,
                isReload
            }).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        // 返回列表页
        _cancel(){
            this.$router.push({name:'SiteList'})
        },
        switcher(tab){
            switch(true) {
            case tab.name == 'image':
                this.typeData.type = 'image'
                this.updatetype = 'image'
                this._filesList();
                break;
            case tab.name == 'css':
                this.typeData.type = 'css'
                this.updatetype = 'css'
                this._filesList();
                break;
            case tab.name == 'js':
                this.typeData.type = 'js'
                this.updatetype = 'js'
                this._filesList();
                break;
            case tab.name == 'attach':
                this.typeData.type = 'attach'
                this.updatetype = 'attach'
                this._filesList();
                break;
            case tab.name == 'theme':
                this.typeData.type = 'theme'
                this.updatetype = 'theme'
                this._filesList();
                break;
            }
        }
    }
}
</script>
