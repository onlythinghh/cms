<template>
    <div id="editor-container">
        <textarea ref="editor"></textarea>
        <!-- 底部工具栏 -->
        <div
            v-if="needBottomTools"
            id="footer-tool"
        >
            <el-button
                v-for="(item, key) in toolsRender"
                v-show="item.isShow"
                :key="key"
                class="item"
                :disabled="isSourceMode || readonly"
            >
                <span v-if="isSourceMode || readonly">{{ item.text }}</span>
                <components
                    :is="item.component"
                    v-else
                    :ref="key"
                    :content="value"
                    :editor="instance"
                    @on-change="getFormattedData"
                />
            </el-button>
                <el-upload
                v-if="!easy"
                action
                :show-file-list="false"
                class="upload-file"
                :http-request="_upWord"
                :disabled="isSourceMode || readonly"
            >
                <!-- :on-success="onSuccess" -->
                <!-- :on-change="_selectFile" -->
                <el-button :disabled="isSourceMode || readonly">上传Word</el-button>
            </el-upload>
            <el-button
                class="item"
                :disabled="isSourceMode || readonly"
                @click="isShowAllSetting = true"
            >
                一键排版
            </el-button>
            <el-button 
                    v-if="!isdiyForm"
                    style="margin-left:10px" 
                    :disabled="isSourceMode || readonly"
                    @click="uploadShow"
            >超大附件</el-button>
            <el-button 
                v-if="!isdiyForm"
                style="margin-left:10px" 
                :disabled="isSourceMode || readonly"
                @click="imageData.visible = true"
            >图片</el-button>
            <el-button 
                v-if="!isdiyForm"
                style="margin-left:10px" 
                :disabled="isSourceMode || readonly"
                @click="leadImageShow"
            >资源库</el-button>
            
            <slot name="btn"></slot>
        </div>
        <!-- 大附件 -->
        <UPLoder v-if="!easy" :visible="isShowUP" @closePublishModal="isShowUP = false" @uploaderData="CK_addFile"></UPLoder>
        <!-- <ImageHouse
            :visible="isLeadShow"
            @confirmList="confirmList"
            @closeImageModal="isLeadShow = false"
        ></ImageHouse> -->
        <resourcesDepot
            :visible="isLeadShow"
            @confirmList="confirmList"
            @closeImageModal="isLeadShow = false"
        ></resourcesDepot>
        
        <addFiles
            v-bind="imageData"
            @close="imageData.visible = false"
            @loadInitList="loadInitList"
        />
        <!-- 一键排版弹框 -->
        <Modal
            :visible="isShowAllSetting"
            title="一键排版"
            width="300px"
            top="5%"
            append-to-body
            custom-class="all-setting"
            @close="isShowAllSetting = false"
        >
            <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handlerCheckAllSetting"
            >全选</el-checkbox>
            <el-checkbox-group
                v-model="allSetting"
                @change="handlerCheckSetting"
            >
                <el-checkbox label="clearStyle">去除样式</el-checkbox>
                <el-checkbox label="clearAttribute">去除属性</el-checkbox>
                <el-checkbox label="clearSpaces">去除空格</el-checkbox>
                <el-checkbox label="clearBlankLine">清除空行</el-checkbox>
                <el-checkbox label="clearImage">去除图片</el-checkbox>
                <el-checkbox label="clearLink">去除超链接</el-checkbox>
                <el-checkbox label="textIndent">首行缩进</el-checkbox>
            </el-checkbox-group>
            <div
                class="btn-group flex flex-center"
                style="margin-top: 20px;"
            >
                <el-button
                    type="primary"
                    size="small"
                    @click="oneClickSetting"
                >确定</el-button>
                <el-button
                    size="small"
                    @click="closeOneClickSetting"
                >取消</el-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { isPlainObject} from './utils'
import Punctuation from './components/punctuation'
import ClearBlankLine from './components/clearBlankLine'
import TextIndent from './components/textIndent'
import ClearSpaces from './components/clearSpaces'
import ClearStyle from './components/clearStyle'
import ClearAttribute from './components/clearAttribute'
import ClearImage from './components/clearImage'
import ClearLink from './components/clearLink'
import { mapActions, mapState } from 'vuex'
import CryptoJS from 'crypto-js';
import { BASE64Helper } from '@/utils/CryptUtil'
import { showLoading} from "@/utils/";
import addFiles from '../../modules/cms/settings/resourcesMage/addFiles/index.vue'
import resourcesDepot from '../ResourcesDepot'
export default {
    name: 'CKEditor',
    components:{
        resourcesDepot,
        addFiles
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        needBottomTools: {
            type: Boolean,
            default: true
        },
        isdiyForm: {
            type: Boolean,
            default: false,
        },
        config: {
            type: Object,
            default: () => {}
        },
        uploadImageConfig: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        },
        easy: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imageData:{
                visible: false
            },
            isShowUP:false,
            isLeadShow: false,
            appid: '',
            // _status: false,
            nowEditor: '',
            editorUploadEnums: {
                link: 'link',
                image: 'image',
                video: 'video',
                audio: 'audio'
            },
            instance: null, // 当前编辑器实例对象
            isSourceMode: false, // 当前是否为源码模式
            isShowAllSetting: false, // 一键排版弹框
            isIndeterminate: false, // 一键排版全选状态展示
            checkAll: false, // 一键排版是否全选
            allSetting: [], // 一键排版选择的功能
            // eslint-disable-next-line
            allSettingRenderList: ['clearStyle', 'clearAttribute', 'textIndent', 'clearSpaces', 'clearBlankLine', 'clearImage', 'clearLink'], // 一键排版所有的功能名
            tool: [
                { name: 'mode', groups: ['mode'] },
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                { name: 'forms', groups: ['forms'] },
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                { name: 'links', groups: ['links'] },
                { name: 'insert', groups: ['insert'] },
                { name: 'styles', groups: ['styles'] },
                { name: 'colors', groups: ['colors'] },
                { name: 'tools', groups: ['tools'] },
                { name: 'others', groups: ['others'] },
            ],
            instanceConfig: {
                height: '300px',
                // eslint-disable-next-line
                // 不需要在工具栏显示的按钮
                removeButtons: [
                    'Save',
                    'NewPage',
                    'Preview',
                    'Print',
                    'Scayt',
                    'Form',
                    'Checkbox',
                    'Radio',
                    'TextField',
                    'Textarea',
                    'Select',
                    'Button',
                    'ImageButton',
                    'HiddenField',
                    'Language',
                    'Anchor',
                    'Flash',
                    'Smiley',
                    'PageBreak',
                    'Iframe',
                    'About',
                    'Font'
                ]
            },
            // 图片上传配置
            imageConfig: {
                responseType: 'json',
                responsePathName: 'url', // 上传完成获取图片路径字段
                name: 'file',
                size: 5 // 上传图片的大小，单位Mb
            },
            toolsRender: {
                punctuation: {
                    text: '标点：中->英',
                    component: Punctuation,
                    isShow: false
                },
                clearBlankLine: {
                    text: '清除空行',
                    component: ClearBlankLine,
                    isShow: false
                },
                clearSpaces: {
                    text: '去除空格',
                    component: ClearSpaces,
                    isShow: false
                },
                textIndent: {
                    text: '首行缩进',
                    component: TextIndent,
                    isShow: false
                },
                clearStyle: {
                    text: '去除样式',
                    component: ClearStyle,
                    isShow: false
                },
                clearAttribute: {
                    text: '去除属性',
                    component: ClearAttribute,
                    isShow: false
                },
                clearImage: {
                    text: '清除图片',
                    component: ClearImage,
                    isShow: false
                },
                clearLink: {
                    text: '清除超链接',
                    component: ClearLink,
                    isShow: false
                }
            }
        }
    },
    computed: {
        ...mapState('authen', ['dictionary']),
        // ...mapState("cms/article/articleList", ["appid"])
        // ...mapState('cms/site',['sites'])
    },
    created() {
        let _site = JSON.parse(sessionStorage.getItem("SITE"));
        this.appid = _site.id
        this.instanceConfig = {
            ...this.instanceConfig,
            ...this.config,
            removeButtons: [...this.instanceConfig.removeButtons, ...this.config.removeButtons].join(',')
        }
        this.imageConfig = {
            ...this.imageConfig,
            ...this.uploadImageConfig
        }
        if (!isPlainObject(this.imageConfig.data)) throw new Error('[imageConfig.data] 格式错误！')
    },
    mounted() {
        if(this.easy) {
            this.tool = [
                { name: 'mode', groups: ['mode'] },
                { name: 'forms', groups: ['forms'] },
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                { name: 'links', groups: ['links'] },
                { name: 'insert', groups: ['insert'] },
            ]
        }
        this.init()
        this.instance.on('change', e => {
        })
        // 切换为源码时获取编辑器的内容
        this.instance.on('mode', e => {
            this.$emit('on-switch', this.instance.mode)
            if (this.instance.mode === 'source') {
                this.isSourceMode = true
                const editable = this.instance.editable()
                editable.attachListener(editable, 'input', () => {
                    this.$emit('input', editable.editor.getData())
                })
            } else {
                this.isSourceMode = false
            }
        })
    },

    methods: {
        ...mapActions("cms", ["upWord"]),
        ...mapActions('cms/site/filexplorer', ['downloadFile','wxCopy']),
        // 初始化编辑器
        init() {
            /* eslint-disable */
            // CKEDITOR.config = {
            //     allowedContent: true,
            //     ...CKEDITOR.config,
            //     filebrowserUploadUrl: this.imageConfig.url,
            //     // extraPlugins: 'uploadfile,uploadimage',
            //     ...this.instanceConfig
            // }
            const editor = (this.instance = CKEDITOR.replace(this.$refs.editor, {
                ...CKEDITOR.config,
                ...this.instanceConfig,
                language: 'zh-cn',
                // toolbarGroups: [
                //     { name: 'document', groups: ['mode', 'document', 'doctools'] },
                //     { name: 'clipboard', groups: ['clipboard', 'undo'] },
                //     { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                //     { name: 'forms', groups: ['forms'] },
                //     { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                //     { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                //     { name: 'links', groups: ['links'] },
                //     { name: 'insert', groups: ['insert'] },
                //     { name: 'styles', groups: ['styles'] },
                //     { name: 'colors', groups: ['colors'] },
                //     { name: 'tools', groups: ['tools'] },
                //     { name: 'others', groups: ['others'] },
                //     { name: 'about', groups: ['about'] }
                //     // { name: 'custome_plugin', groups: ['file', 'flash'] }
                // ],
                toolbarGroups: this.tool,
                pasteFilter: null,
                allowedContent: true,
                entities: false,
                // filebrowserUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.5.1.2/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
                filebrowserUploadUrl: this.imageConfig.url + '?type=' + this.editorUploadEnums.link+'&appid='+this.appid,
                filebrowserLinkUploadUrl: this.imageConfig.url + '?type=' + this.editorUploadEnums.link+'&appid='+this.appid,
                filebrowserImageUploadUrl: this.imageConfig.url + '?type=' + this.editorUploadEnums.image+'&appid='+this.appid,
                filebrowserHtml5videoUploadUrl: this.imageConfig.url + '?type=' + this.editorUploadEnums.video+'&appid='+this.appid,
                filebrowserHtml5audioUploadUrl: this.imageConfig.url + '?type=' + this.editorUploadEnums.audio+'&appid='+this.appid,
                // extraPlugins: 'dialog,uploadfile,uploadimage,widget,html5video,html5audio,wordcount,',
                extraPlugins: 'dialog,html5audio,html5video,textindent,widget',
                removeDialogTabs: 'link:advanced;link:target',
                removePlugins: 'elementspath,dragdrop,basket,easyimage,cloudservices',
                // removeDialogTabs: 'image:advanced'
                font_names: 'PingFang SC', // 字体
                // format_tags: 'p;h1;h2;h3;h4;h5;h6', // 字体格式
                wordcount: {
                    showParagraphs: false,
                    showWordCount: false,
                    showCharCount: true,
                    countHTML: true,
                    maxCharCount: 100000
                },
                // extraPlugins: 'wordcount'
            }))
            //,wordcount
            /* eslint-disable */
            const _this = this
            this.nowEditor = editor
            editor.on('instanceReady', () => {
                this.instance.setData(this.value)
                this.instance.setReadOnly(this.readonly)
                this.uploadImage(_this)
                editor.on('paste',(e) => {
                    editor.config._isPaste = true
                    // var content = e.data.dataValue
                    var srcArr = []
                    var nowSrc = []
                    var content = this.getData() ? this.getData() + e.data.dataValue : e.data.dataValue// this.formModel.content
                    content.replace(/<img [^>]*data-src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                        srcArr.push(capture)
                        // return ''
                    });
                    // srcArr = Array.from(new Set(srcArr))
                    var b = content.match(/ src=\"([^\"]*)\"/g)
                    if(srcArr.length > 0) {
                        const length = srcArr.length
                        // for(var i = 0; i< length; i++) {

                        // }

                        srcArr.forEach(async (item, index )=> {
                            const { data } = await this.wxCopy({
                                appid: this.appid,
                                url: item
                            })
                            nowSrc.push(data.path)
                            if( index == length -1 ){
                                b.forEach((i,k)=>{
                                    content = content.replace(i,` src=\"${nowSrc[k]}\"`)
                                })
                                this.instance.setData(content)
                            }
                        })
                    }
                    else {
                        if(b && b.length > 0) {
                            b = Array.from(new Set(b))
                            b.forEach(async (item, index) => {
                                const { data } = await this.wxCopy({
                                    appid: this.appid,
                                    url: item.slice(6,-1)
                                })
                                content = content.replace(item,' src="'+data.path+'" ' )
                                if(index == b.length -1) {
                                    this.instance.setData(content)
                                }
                            })
                        }
                    }
                })
            })
        },
        // 转base64
        convertImgToBase64(url, outputFormat,callback){
            var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img,0,0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                canvas = null; 
            };
            img.src = url;
        },
        // 转换为base64编码
        getBase64Image(img) {
            var canvas = document.createElement('canvas');
            canvas.width = img.width
            canvas.height = img.height
            var ctx = canvas.getContext('2d'); //获取绘图上下文环境
            ctx.drawImage(img, 0, 0, img.width, img.height); //在canvas中画图
            var dataURL = canvas.toDataURL('image/png'); //可选其他值 image/jpeg
            return dataURL;
        },
        async _upWord(uploadData){
            const { file, onError } = uploadData;
            let lastName = file.name.substring(file.name.lastIndexOf('.'))
            if (lastName.toLowerCase() != '.doc' && lastName.toLowerCase() != '.docx') {
                this.$message.error('上传文件仅限为doc和docx后缀')
                return
            }
            BASE64Helper.imgMd5(file).then(async _file=>{
                showLoading(true,'上传中')
                try {
                    let {data} = await this.upWord({
                        file: _file,
                        type:'word',
                        appid:this.appid
                    });
                    if(data.success){
                        document.getElementsByTagName('iframe')[0].contentWindow.document.body.innerHTML = data.data
                    }else{
                        this.$message.error(data.errMsg);
                    }
                } catch (error) {
                    onError(error);
                }
                showLoading(false)
            })
        },
        nextBase(src, cb) {
            var image = new Image();
            image.src = src + '?v=' + Math.random(); // 处理缓存
            image.crossOrigin = "*";                 // 支持跨域图片
            image.onload = function() {
                var base64 = this.getBase64Image(image);
                cb && cb(base64);
            }
        },
        // 获取工具格式化后的数据
        getFormattedData(v) {
            /**
             * 废弃
             * 直接使用 editor.setData
             * */
            !this.isShowAllSetting && this.$emit('input', v)
        },
        getData() {
            return this.instance ? this.instance.getData() : ''
        },
        setData(data = '') {
            this.instance && this.instance.setData(data)
        },
        handlerCheckSetting(v) {
            this.isIndeterminate = v.length > 0 && v.length < this.allSettingRenderList.length
            this.checkAll = v.length === this.allSettingRenderList.length
        },

        handlerCheckAllSetting(v) {
            this.allSetting = v ? this.allSettingRenderList : []
            this.isIndeterminate = false
        },

        // 一键排版
        oneClickSetting() {
            // let str = this.value
            let str = this.instance.getData()
            this.allSetting.map(item => {
                str = this.$refs[item][0].format(str)
            })
            let _id = this.$refs.editor.nextElementSibling.id
            let dom = document.getElementById(_id)
            console.log('获取dis:',dom)
            // console.log('121212121212121212-----',dom.getElementsByTagName('iframe'))
            dom.getElementsByTagName('iframe')[0].contentWindow.document.body.innerHTML = str
            // document.getElementsByTagName('iframe')[0].contentWindow.document.body.innerHTML = str
            this.closeOneClickSetting()
        },

        closeOneClickSetting() {
            this.isShowAllSetting = false
            this.allSetting = []
            this.isIndeterminate = false
            this.checkAll = false
        },
        // 图片上传
        uploadImage(_this) {
            const getQueryParameters = function(url = '') {
                let obj = {}
                const type = url.split('type=')
                var nowType = type[1].split('&')[0]
                // _this._status = false
                switch(nowType) {
                    case 'image':
                        if(_this.nowEditor.config._isPaste) {
                            obj = {type: "base64", responseType: "json"}
                            _this.nowEditor.config._isPaste = false
                        }else {
                            obj = {type: "image", responseType: "json"}
                        }
                        // _this._status = true
                        break
                    case 'video':
                        obj = {type: 'video'}
                        break
                    case 'link':
                        obj = {type: 'link'}
                        break
                    default :
                        obj = {type: 'audio'}
                }
                // '/api/cms/attach/upload/file?type=image&responseType=json'
                // url.replace(/^(.*)+\?(.*)$/, '$2')
                //     .split('&')
                //     .forEach(item => {
                //         if (item) {
                //             console.log()
                //             const queryStringItems = item.split('=')
                //             parameters[queryStringItems[0]] = queryStringItems[1] || null
                //         }
                //     })
                // return parameters
                return obj
            }
            const uploadFileValidate = (type, { file }) => {
                const mediaType = file.type
                switch (type) {
                    case this.editorUploadEnums.link:
                        return ''
                    case this.editorUploadEnums.image:
                        this.imageConfig.size = this.dictionary.attachModule.imageArticleEditor.limit
                        this.imageConfig.data.module = this.dictionary.attachModule.imageArticleEditor.type
                        if (!/^image\/(jpe?g|png|svg\+xml|gif)$/.test(mediaType)) {
                            return '只允许上传jpg、jpeg、png、svg、gif格式的图片'
                        }
                        if (file.size > this.imageConfig.size * 1024 * 1024) {
                            return `图片大小不能大于${this.imageConfig.size}MB！`
                        }
                        return ''
                    case this.editorUploadEnums.video:
                        this.imageConfig.size = this.dictionary.attachModule.videoArticleEditor.limit
                        this.imageConfig.data.module = this.dictionary.attachModule.videoArticleEditor.type
                        if (!/^audio\/ogg$/.test(mediaType)&&!/^video\/(mp4|avi|mpeg|webm)$/.test(mediaType)) {
                            return `只允许上传mp4、avi、mpeg、webm、ogg格式的视频文件`
                        }
                        if (file.size > this.imageConfig.size * 1024 * 1024) {
                            return `视频文件大小不能大于${this.imageConfig.size}MB！`
                        }
                        return ''
                    case this.editorUploadEnums.audio:
                        this.imageConfig.size = this.dictionary.attachModule.audioArticleEditor.limit
                        this.imageConfig.data.module = this.dictionary.attachModule.audioArticleEditor.type
                        if (!/^audio\/(wav|mpeg|x-ms-wma|ogg)$/.test(mediaType)) {
                            return `只允许上传wav、mp3、wma、ogg格式的音频文件`
                        }
                        if (file.size > this.imageConfig.size * 1024 * 1024) {
                            return `音频文件大小不能大于${this.imageConfig.size}MB！`
                        }
                        return ''
                    case 'base64':
                        return ''
                    default:
                        return '不支持的文件类型'
                }
            }
            this.instance.on('fileUploadRequest', evt => {
                const _token = this.$store.state.authen.token
                const fileLoader = evt.data.fileLoader
                var wordArray = CryptoJS.lib.WordArray.create(fileLoader.data)
                let _sha  = CryptoJS.SHA1(wordArray).toString()
                // 获取上传类型
                const type = getQueryParameters(fileLoader.uploadUrl).type
                // 根据类型校验
                const hasError = uploadFileValidate(type, fileLoader)
                if (!hasError) {
                        // 设置参数
                        Object.assign(evt.data.requestData, evt.data.requestData.upload)
                        for (let [key, value] of Object.entries(this.imageConfig.data || {})) {
                            evt.data.requestData[key] = value
                        }
                        const xhr = evt.data.fileLoader.xhr
                        // 设置token
                        xhr.setRequestHeader('token', _token)
                        xhr.setRequestHeader('sha', _sha)
                        xhr.responseType = 'json'
                        delete evt.data.requestData.upload

                } else {
                    evt.data.fileLoader.message = hasError
                    evt.data.fileLoader.changeStatus('error')
                    // Prevented the default behavior.
                    evt.cancel()
                }
            })
            this.instance.on('fileUploadResponse', evt => {
                const data = evt.data
                const xhr = data.fileLoader.xhr
                let response = xhr.response
                if(typeof(response)=='string'){
                    response = JSON.parse(response)
                }
                if (response.success) {
                    data.url = response.data[this.imageConfig.responsePathName]
                    this.$emit('on-uploaded', response.data)
                    evt.stop()
                } else {
                    data.message = response.errMsg || '上传出现异常'
                }
            })
        },
        CK_addFile(uploader){
            let str = null
            this.instance.focus()
            if(uploader.type=='image'){
                str = `<img src="${uploader.data.url}" alt="${uploader.data.origin}" >`
            }
            if(uploader.type=='attach'){
                str = `<a href="${uploader.data.url}">${uploader.data.origin}</a>`
            }
            if(uploader.type=='video'){
                str = `<div class="ckeditor-html5-video" style="text-align: center;">
                <video controlslist="nodownload" controls="controls" width="100%" title="${uploader.data.origin}" src="${uploader.data.url}"></video>
                </div>`
            }
            if(uploader.type=='audio'){
                str = `<div class="ckeditor-html5-audio" style="text-align: center;">
                <audio controls="controls" controlslist="nodownload" src="${uploader.data.url}" title="${uploader.data.origin}"></audio>`
            }
            this.instance.insertHtml(str)
        },
        uploadShow(){
            this.isShowUP = true
        },
        // 显示引入图片弹框
        leadImageShow() {
            this.isLeadShow = true
        },
        // 获取到选中的图片，生成img标签
        confirmList(list) {
            console.log('选中的：',list)
            let str = ''
            this.instance.focus()
            if(list.length > 0) {
                for(let i = 0; i<list.length; i++) {
                    // str += `<img src="${list[i].pathPart}" alt="${list[i].name}" >`
                    let url = list[i].pcResourcesUrl || list[i].flatResourcesUrl || list[i].phoneResourcesUrl
                    if(list[i].type == '1'){
                        str += `<img  class="cms_dataImg" src="${url}"  pc-url="${list[i].pcResourcesUrl}" tablet-url="${list[i].flatResourcesUrl}" mobile-url="${list[i].phoneResourcesUrl}" alt="${list[i].fileName}" >`
                    }
                    if(list[i].type == '2') {
                        str += `<div class="ckeditor-html5-video" style="text-align: center;">
                        <video controlslist="nodownload" controls="controls" width="100%" title="${list[i].fileName}" src="${url}"></video>
                        </div>`
                    }
                    if(list[i].type == '3') {
                        str += `<a href="${url}">${list[i].fileName}</a>`
                    }
                }
            }
            this.instance.insertHtml(str)
            this.isLeadShow = false
        },

        // 文章插入图片
        loadInitList(data){
            // console.log('上传之后的数据', data)
            let str = null
            this.instance.focus()
            // data.type: 1图片 2视频 3文件
            let index = data.pcResourcesUrl.lastIndexOf('/')
            let fileName = data.pcResourcesUrl.substr(index + 1)
            if(data.type == '1'){
                // data-pc-url data-tablet-url data-mobile-url
                str = `<img class="cms_dataImg" src="${data.pcResourcesUrl}" pc-url="${data.pcResourcesUrl}" tablet-url="${data.flatResourcesUrl}" mobile-url="${data.phoneResourcesUrl}" alt="${fileName}" >`
            }
            if(data.type == '2') {
                str = `<div class="ckeditor-html5-video" style="text-align: center;">
                <video controlslist="nodownload" controls="controls" width="100%" title="${data.fileName}" src="${data.pcResourcesUrl}"></video>
                </div>`
            }
            if(data.type == '3') {
                str = `<a href="${data.pcResourcesUrl}">${fileName}</a>`
            }
            this.instance.insertHtml(str)
        },
    },
    watch: {
        value(v) {
            this.instance.getData() !== v && this.instance.setData(v)
        },
        readonly(v) {
            this.instance.status !== 'unloaded' && this.instance.setReadOnly(v)
        }
    }
}
</script>
<style lang="scss">
.all-setting {
    .el-dialog__body {
        padding: 10px 20px 20px;
    }
}
</style>
<style lang="scss" scoped>
#footer-tool {
    display: flex;
    margin-top: 5px;

    .item {
        &:first-of-type {
            margin-left: 0;
            margin-right: 10px;
        }
    }
}
.upload-file{
    float: left;
    margin-right: 10px;
}
.cke_dialog_background_cover {
    display: none !important;
}
</style>
