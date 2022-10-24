<!-- eslint-disable  -->
<template>
    <div>
      <el-form>
          <el-form-item label="问卷名称" label-width="100px" style="width:400px;margin:0 auto">
            <el-input v-model="detail.name" maxlength="15" clearable></el-input>
          </el-form-item>
      <el-tabs v-model="tabsName" type="border-card" style="margin-top:10px" @tab-click="handleClick">
          <p style="text-align:center">{{title}}</p>
          <div style="text-align:right">
                <el-button type="primary" @click="_addpane">新增</el-button>
          </div>
          <el-tab-pane label="产品清单" name="cp">
              <el-table
                :data="product"
                height="550px"
                row-key="id" 
                style="width:100%"
                @selection-change="selectionChange"
              >
                <el-table-column label="序号" width="60">
                        <template scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                <el-table-column label="产品名称" prop="product" />
                <el-table-column label="产品类型" prop="type" width="250" />
                <el-table-column label="推荐理由" prop="recommend" width="600" />
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button type="text" size="mini" @click="altercp(scope.row)">修改</el-button>
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="forward(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="问题清单" name="wt">
              <el-table 
                :data="question"
                height="550px"
                row-key="id" 
                style="width:100%"
                @selection-change="selectionChange"
              >
                <el-table-column label="序号" width="60">
                        <template scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                <el-table-column label="问题" prop="question" />
                <el-table-column label="选项" width="160">
                    <template v-slot="{row}">
                        <span>{{row.items.length}}</span>
                        <!-- <div class="wtColum">
                            <span v-for="(k,i) in row.items" :key="i">{{k.item}}</span>
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button type="text" size="mini" @click="altercp(scope.row)">修改</el-button>
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="forward(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="风险等级" name="dj">
              <div class="fxdj-tip">注意：风险等级请按照从低到高录入，分值也从低到高录入。</div>
              <el-table 
                :data="rank"
                height="550px"
                row-key="id" 
                style="width:100%"
                @selection-change="selectionChange" 
                @cell-dblclick="dblclick"
              >
                <el-table-column label="序号" width="60">
                        <template scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                <el-table-column label="等级">
                    <template v-slot="{row}">
                        <el-input v-model="row.name" maxlength="5" @blur="row.dj=false" />
                    </template>
                </el-table-column>
                <el-table-column label="下限分值">
                    <template v-slot="{row}">
                        <el-input-number
                          v-model="row.start"
                          :max="100"
                          :min="0"
                          :controls="false"
                          @blur="row.xfz=false"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="上限分值">
                    <template v-slot="{row}">
                        <el-input-number
                          v-model="row.end"
                          :max="100"
                          :min="0"
                          :controls="false"
                          @blur="row.sfz=false"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template scope="scope">
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="forward(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="风险分析" name="fx">
              <el-table 
                :data="conclusion"
                row-key="id"
                height="550px"
                style="width:100%"
                @selection-change="selectionChange" 
                @cell-dblclick="dblclick"
              >
                <el-table-column label="序号" width="60">
                        <template scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                <el-table-column label="条件" width="400">
                    <template v-slot="{row}">
                        <div>
                            <span>问题：</span>
                            <el-select
                              v-model="row.question"
                              @change="wtchange(row)"
                            >
                                <el-option
                                  v-for="(item,index) in question"
                                  :key="index"
                                  :label="item.question"
                                  :value="item.id"
                                />
                            </el-select>
                        </div>
                        <div>
                            <span>选项：</span>
                            <el-select v-model="row.itemList" multiple>
                                <el-option
                                  v-for="(item,index) in row.itemListdata"
                                  :key="index"
                                  :label="item.item"
                                  :value="item.id"
                                />
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="分析结果">
                    <template v-slot="{row}">
                        <el-input
                          v-model="row.conclusion"
                          type="textarea"
                          maxlength="200"
                          show-word-limit
                          rows="4"
                          @blur="row.wz=false"
                        />
                    </template>
                </el-table-column>
                <!-- <el-table-column label="推荐理由">
                    <template v-slot="{row}">
                        <el-input
                          v-model="row.recommend"
                          type="textarea"
                          maxlength="200"
                          show-word-limit
                          rows="4"
                          @blur="row.ly=false"
                        />
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="150">
                    <template scope="scope">
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="forward(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
      </el-tabs>
    </el-form>
        <Modal :visible="cpshow" :title="'修改'+title" top="10vh" width="50%" @close="_closecp">
            <el-form v-if="dialogData" ref="dialogData" :model="dialogData" style="max-height: 75vh;overflow: auto;">
                <div v-if="tabsName=='cp'">
                    <el-form-item
                      label="产品名称"
                      label-width="100px"
                      prop="product"
                      :rules="{required:true,message:'产品名称不能为空',trigger:'blur'}"
                    >
                        <el-input v-model="dialogData.product" maxlength="50" clearable />
                    </el-form-item>
                    <el-form-item
                      label="产品类型"
                      label-width="100px"
                      prop="type"
                      :rules="{required:true,message:'产品类型不能为空',trigger:'blur'}"
                    >
                        <el-input v-model="dialogData.type" maxlength="15" clearable />
                    </el-form-item>
                    <el-form-item label="正文内容" label-width="100px"
                        :rules="{required:true,message:'正文内容不能为空',trigger:'blur'}"
                    >
                        <CK-editor
                                ref="ckeditor"
                                v-model="dialogData.remark"
                                :need-bottom-tools="false"
                                :config="editorConfig"
                                :easy="true"
                            >
                            </CK-editor>
                    </el-form-item>
                    <el-form-item
                      label="详情连接"
                      label-width="100px"
                      prop="link"
                      :rules="{required:true,message:'详情连接不能为空',trigger:'blur'}"
                    >
                        <el-input v-model="dialogData.link" clearable />
                    </el-form-item>
                    <el-form-item
                      label="推荐理由"
                      label-width="100px"
                      prop="link"
                      :rules="{required:true,message:'推荐理由不能为空',trigger:'blur'}"
                    >
                        <el-input type="textarea" size="medium" v-model="dialogData.recommend" maxlength="200"></el-input>
                    </el-form-item>
                </div>
                <div v-if="tabsName=='wt'">
                    <el-form-item
                      label="问题"
                      prop="question"
                      label-width="60px"
                      :rules="{required:true,message:'问题不能为空',trigger:'blur'}"
                    >
                        <el-input v-model="dialogData.question" maxlength="50" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="选项" label-width="40px">
                        <el-button icon="el-icon-plus" size="mini" @click="_addwt"></el-button>
                    </el-form-item>
                    <div v-for="(k,i) in dialogData.items" :key="i">
                        <el-form-item
                          :label="'选项'+(i+1)"
                          :prop="'items.'+i+'.item'"
                          :rules="{required:true,message:'选项不能为空',trigger:'blur'}"
                          label-width="60px"
                        >
                          <el-input v-model="k.item" clearable maxlength="30" style="width:80%" />
                          <el-button :disabled="i==0" @click="removal(i)">删除</el-button>
                        </el-form-item>
                        <el-form-item label="图例" label-width="60px" style="display: none;">
                            <el-upload
                              action
                              :multiple="false"
                              :show-file-list="false"
                              :data="{index:i}"
                              :on-change="_selectFile"
                              :http-request="_uploadThumbnail"
                            >
                              <span slot="tip" style="color:#f56c6c;padding-left:10px">建议尺寸为50*50</span>
                              <div class="btn-upload">
                                <img v-if="k.pic" :src="k.pic.url">
                                  <i v-else class="el-icon-plus" />
                              </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="标签" label-width="60px">
                            <!-- <el-select v-model="k.tag" multiple allow-create filterable style="width:80%"></el-select> -->
                            <el-input v-model="k.tag[0]" maxlength="5" style="width:80%"></el-input>
                        </el-form-item>
                        <el-form-item label="得分" label-width="60px">
                            <el-input-number v-model="k.score" :min="1" :max="10" :controls="false"></el-input-number>
                        </el-form-item>
                        <el-form-item label="产品" label-width="60px">
                            <el-select
                                v-model="k.product"
                                multiple
                                style="width:80%"
                            >
                                <el-option
                                    v-for="(item,index) in product"
                                    :key="index"
                                    :label="item.product"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    
                </div>
            </el-form>
            <div style="text-align:right">
                <el-button type="primary" @click="_cpok">保存</el-button>
                <el-button @click="_closecp">取消</el-button>
            </div>
        </Modal>
        <div style="text-align:center;margin-top:10px">
            <el-button type="primary" @click="_seve">保存</el-button>
            <el-button @click="_back">返回</el-button>
        </div>
  </div>
</template>

<script>
import {BASE64Helper} from '@/utils/CryptUtil'
import {showLoading, showMessage,showError} from "@/utils/";
import { mapActions } from 'vuex'
export default {
    data(){
        return {
            id:this.$route.query.id,
            tabsName:'cp',
            Change:null,
            cpshow:false,
            title:'产品清单',
            dialogData:null,
            detail:{},
            product:[],
            question:[],
            conclusion:[],
            rank:[
            ],
            editorConfig: {
                removeButtons: ["Paste", "PasteText", "PasteFromWord", "Maximize","Image","Html5audio","Html5video"],
                height: "160px"
            },
        }
    },
    created() {
        this.needetail();
        this.rank = [
            {name:'低',start:'1',end:'3'},
            {name:'中',start:'4',end:'6'},
            {name:'高',start:'7',end:'10'}
        ]
    },
    methods:{
        ...mapActions('cms', ['imageUpload']),
        ...mapActions('cms/settings/need',['getAssess','getProduct','getQuestion','saveQu','savePr','thsave','colldel']),
        async needetail(){
            this.conclusion = []
           
            showLoading(true,'数据加载中')
            let {data} = await this.getAssess({id:this.id})
            data.conclusion.forEach(el=>{
                this.conclusion.push({
                    ...el,
                    itemListdata:[],
                    wz:false,
                    ly:false
                })
            })
            this.addQuestion()
            if(data.rank.length>0){
                this.rank = [];
            }
            data.rank.forEach(el=>{
                this.rank.push({
                    ...el,
                    dj:false,
                    xfz:false,
                    sfz:false
                })
            })
            this.detail = {...data}
            setTimeout(()=>{
                this.addProduct()
            })
            showLoading()
        },
        async addProduct(){
            let _product = await this.getProduct({id:this.id})
            this.product = [..._product.data]
            let ay = []
            _product.data.forEach(cp=>{
                ay.push(cp.id)
            })
            this.question.forEach((el,el_i)=>{
                el.items.forEach((wt,wt_i)=>{
                    if(wt.product!=null && wt.product.length!=0){
                        wt.product.forEach((x,i)=>{
                            if(!ay.includes(x)){
                                this.question[el_i].items[wt_i].product.splice(i,1)
                            }
                        })
                    }
                })
            })
        },
        async addQuestion(){
            let _question = await this.getQuestion({id:this.id})
            let v = false
            this.conclusion.forEach(qu=>{
                _question.data.forEach(it=>{
                    if(qu.question==it.id){
                        v = true
                        qu.itemListdata = [...it.items]
                    }
                })
                if(!v){
                    qu.question = null
                    qu.itemList = []
                }
            })
            this.question = [..._question.data]
        },
        handleClick(a){
            this.title = a.label
            this.Change = null
        },
        selectionChange(val){
            this.Change = val
        },
        altercp(row){
            this.dialogData = {...row}
            this.cpshow = true
        },
        _addpane(){
            let name = this.tabsName
            switch (name) {
            case 'cp':
                
                this.cpshow = true
                
                this.dialogData={no:this.product.length}
                break
            case 'wt':
                if(this.question.length>=10){
                    return showError('问题不可超过10个！')
                }
                this.cpshow = true
                // this.dialogData={no:this.question.length,items:[{score:0}]}
                this.dialogData={no:this.question.length,items:[{score:0,tag:[]}]}
                break
            case 'dj':
                if(this.rank.length>=10){
                    return showError('风险等级不可超过10个！')
                }
                this.rank.push({name:'',start:'0',end:"0",dj:true,xfz:true,sfz:true})
                break
            case 'fx':
                if(this.conclusion.length>=100){
                    return showError('风险分析不可超过10个！')
                }
                this.conclusion.push({conclusion:'',itemList:[],itemListdata:[],wz:true,ly:true})
                break
            }
        },
        _addwt(){
            if(this.dialogData.items.length>=10){
                return showError('选项不可超过10个！')
            }
            this.dialogData.items.push({tag:[]})
        },
        _closecp(){
            showLoading()
            this.$forceUpdate()
            this.cpshow = false
        },
        getEditorData() {
            return this.$refs.ckeditor.getData()
        },
        _cpok(){
            this.$refs.dialogData.validate(async v=>{
                if(!v){
                    return false
                }
                let name = this.tabsName
                let res = null
                switch (name) {
                case 'cp':
                    if(!this.getEditorData()){
                        this.$message.error("正文内容不能为空");
                        return false;
                    }
                    showLoading(true)
                    res = await this.savePr({
                        assessId:this.id,
                        ...this.dialogData,
                        remark:this.getEditorData()
                    })
                    if(res.success){
                        showLoading()
                        this.addProduct()
                    }
                    // if(!this.dialogData.id){
                    //     this.dialogData.id = this.product.length+1
                    //     this.product.push({...this.dialogData})
                    // }else{
                    //     let _data = [...this.product]
                    //     this.product = null
                    //     _data.forEach((el,i)=>{
                    //         if(el.id===this.dialogData.id){
                    //             _data[i] = {...this.dialogData}
                    //         }
                    //     })
                    //     this.product = _data
                    // }
                    break
                case 'wt':
                    // eslint-disable-next-line no-case-declarations
                    let params = {
                        ...this.dialogData
                    };
                    params.items.forEach(ele => {
                        if(ele.tag instanceof Array){
                            ele.tag = [...ele.tag]
                        }else{
                            let tag = ele.tag;
                            ele.tag = [tag];        
                        }
                        
                    })
                    showLoading(true)
                    res =  await this.saveQu({
                        assessId:this.id,
                        ...params
                        // ...this.dialogData
                    })
                    if(res.success){
                        showLoading()
                        this.addQuestion()
                    }
                    // if(!this.dialogData.id){
                    //     this.dialogData.id = this.question.length+1
                    //     this.question.push({...this.dialogData})
                    // }else{
                    //     let _data = [...this.question]
                    //     this.question = null
                    //     _data.forEach((el,i)=>{
                    //         if(el.id===this.dialogData.id){
                    //             _data[i] = {...this.dialogData}
                    //         }
                    //     })
                    //     this.question = _data
                    // }
                    break
                }
                if(!res.success){
                    showLoading()
                    return showError(res.errMsg)
                }
                this._closecp()
            })
        },
        removal(i){
            this.dialogData.items.splice(i,1)
        },
        async forward(i){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                let name = this.tabsName
                switch (name) {
                case 'cp':
                    await this.colldel({id:i,key:'product'})
                    setTimeout(()=>{
                        this.addProduct()
                    })
                    break
                case 'wt':
                    await this.colldel({id:i,key:'question'})
                    setTimeout(()=>{
                        this.addQuestion()
                    })
                    break
                case 'dj':
                    this.rank.splice(i,1)
                    break
                case 'fx':
                    this.conclusion.splice(i,1)
                    break
                }
            }).catch(() => {
            });
            
        },
        async _seve(){
            if(this.question.length<5){
                return showError('问题不可少于5个！')
            }
            if(!this.detail.name){
                return showError('问卷名称不能为空')
            }
            var _arr = []
            this.rank.forEach(el=>{
                _arr.push({start:el.start,end:el.end})
                if(!el.name){
                    showError('请输入风险等级')
                    throw new Error('请输入风险等级')
                }
            })
            for (let i = 0; i < this.rank.length; i++) {
                if(!this.rank[i].start || !this.rank[i].end){
                    showError('风险等级上下分值不能为空');
                    throw new Error('风险等级上下分值不能为空')
                }
                for (let j = i+1; j < this.rank.length; j++) {
                    if(this.rank[j].start<=this.rank[i].end || this.rank[i].end<this.rank[i].start || this.rank[j].end<this.rank[j].start){
                        showError('风险等级上下分值不可冲突');
                        throw new Error('风险等级上下分值不可冲突')
                    }
                }
            }
            // _arr.forEach((o,i)=>{
            //     _arr.forEach((oo,ii)=>{
            //         if(i!==ii){
            //             if((o.end<oo.start&&o.start<oo.end)||(o.end>oo.end&&o.start>oo.end)){
            //                 console.info('风险等级上下分值ok')
            //             }else{
            //                 showError('风险等级上下分值不可冲突')
            //                 throw new Error('风险等级上下分值不可冲突')
            //             }
            //         }
            //     })
            // })
            if(this.conclusion.length<=0){
                showError('风险分析不能为空')
                return false;
            }
            this.conclusion.forEach(el=>{
                if(!el.question){
                    showError('风险分析问题不能为空')
                    throw new Error('风险分析问题不能为空')
                }
                if(el.itemList.length<=0){
                    showError('风险分析选项不能为空')
                    throw new Error('风险分析选项不能为空')
                }
                if(!el.conclusion.trim()){
                    showError('分析结果不能为空')
                    throw new Error('分析结果不能为空')
                }
                // if(!el.recommend.trim()){
                //     showError('风险分析推荐理由不能为空')
                //     throw new Error('风险分析推荐理由不能为空')
                // }
            })
            let res = await this.thsave({
                id:this.id,
                name:this.detail.name,
                rank:[...this.rank],
                conclusion:[...this.conclusion]
            })
            if (res.success) {
                this.$message({
                    type: "success",
                    message: res.errMsg
                });
                this.addVisible = false;
            } else {
                this.$message.error("保存失败");
            }
            this.needetail()
        },
        dblclick(row,i){
            this.conclusion.forEach(el=>{
                el.wz = false;
                el.ly = false;
            })
            this.rank.forEach(el=>{
                el.dj = false
                el.xfz = false
                el.sfz = false
            })
            if(i.label=='分析结果'){
                row.wz = true
            }else if(i.label=='推荐理由'){
                row.ly = true;
            }else if(i.label=='等级'){
                row.dj = true
            }else if(i.label=='下限分值'){
                row.xfz = true
            }else if(i.label=='上限分值'){
                row.sfz = true
            }
        },
        wtchange(row){
            row.itemList = []
            this.question.forEach(el=>{
                if(el.id==row.question){
                    row.itemListdata = [...el.items]
                }
            })
        },
        questionId(row){
            let m = ''
            this.question.forEach(el=>{
                if(el.id==row.question){
                    m = el.question
                }
            })
            return m
        },
        itemListId(row){
            let ay = []
            row.itemList.forEach(id=>{
                row.itemListdata.forEach(el=>{
                    if(el.id==id){
                        ay.push(el.item)
                    }
                })
            })
            return ay.join(',')
        },
        _back(){
            this.$router.push({ name: "Need" });
        },
        _selectFile(file) {
            this.file = file
        },
        async _uploadThumbnail(v) {
            BASE64Helper.imgMd5(this.file.raw).then(async _file => {
                var _index = v.data.index
                let {data} = await this.imageUpload({
                    file: _file,
                    type: '12',
                    appid: JSON.parse(sessionStorage.getItem("SITE")).id
                })
                if(data.success){
                    showMessage('上传成功')
                    this.dialogData.items[_index].pic = {
                        flie: data.data.file,
                        url: data.data.url,
                        id: data.data.id,
                        origin: data.data.origin
                    }
                }else{
                    showError(data.errMsg)
                }
            })
        },

    },
}
</script>
<style lang="scss" scoped>
.wtColum>span:not(:first-child)::before{
    content: ',';
}
.fxdj-tip{
    color:red;
    padding:10px;
}
.btn-upload {
        position: relative;
        width: 60px;
        height: 60px;
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
</style>
