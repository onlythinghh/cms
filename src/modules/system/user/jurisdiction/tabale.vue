<template>
    <el-form>
        <el-row>
            <div v-if="!dialogVal">
                <el-col :span="4" class="title">
                    <el-form-item v-if="dialog" label-width="20%">
                        <el-checkbox v-model="dialog.idAll" :disabled="!show" @change="idAll">站点</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="20" class="border">
                    <el-form-item label="站点：" label-width="80px">
                        <el-checkbox-group v-model="showData.authString">
                            <el-checkbox v-for="item in Options.op_site" :key="item.value" :label="item.value" :disabled="!show">{{
                                item.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="模板：" label-width="80px">
                        <el-checkbox-group v-model="showData.authString">
                            <el-checkbox v-for="item in Options.op_template" :key="item.value" :label="item.value" :disabled="!show">{{
                                item.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="频道：" label-width="80px">
                        <el-checkbox-group v-model="showData.authString">
                            <el-checkbox v-for="item in Options.op_channelAll" :key="item.value" :label="item.value" :disabled="!show">{{
                                item.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="bgBorder"></el-col>
            </div>
            <div v-if="dialogVal">


                <el-col :span="4" class="title">
                    <el-form-item label-width="20%">
                        <el-checkbox v-model="dialog.channelAll" :disabled="!show" @change="channelAll">频道</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="20" class="border">
                    <el-form-item label="频道：" label-width="80px">
                        <el-checkbox-group v-model="showData.channelAuthString">
                            <el-checkbox v-for="item in Options.op_channel" :key="item.value" :label="item.value" :disabled="!show">{{
                                item.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="内容：" label-width="80px">
                        <el-checkbox-group v-model="showData.channelAuthString">
                            <el-checkbox v-for="item in Options.op_contentAll" :key="item.value" :label="item.value" :disabled="!show">{{
                                item.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="bgBorder"></el-col>
            </div>
            <div v-if="dialogVal">
                <el-col :span="4" class="title">
                    <el-form-item label-width="20%">
                        <el-checkbox v-model="dialog.contentAll" :disabled="!show" @change="contentAll">内容</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="20" class="border">
                    <el-form-item label="内容：" label-width="80px">
                        <el-checkbox-group v-model="showData.infoAuthString">
                            <el-checkbox v-for="item in Options.op_content" :key="item.value" :label="item.value" :disabled="!show">{{
                                item.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="bgBorder"></el-col>
            </div>
            <el-col :span="4" class="title">
                <el-form-item v-if="dialog" label-width="20%">
                    <el-checkbox v-model="dialog.effectAll" :disabled="!show" @change="effectAll">效果</el-checkbox>
                </el-form-item>
            </el-col>
            <el-col :span="20" class="border">
                <el-form-item label-width="80px">
                    <el-checkbox-group v-model="showData.featureString">
                        <el-checkbox
                            v-for="(item, key) in Options.op_effect"
                            v-show="dialogVal === key"
                            :key="item.value"
                            :label="item.value"
                            :disabled="!show"
                            >{{ item.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
        <div v-if="show">
            <div v-if="dialogVal">
                <el-form-item label="站点" style="margin-top: 15px;">
                    <el-select v-model="showData.value2" placeholder="请选择站点" @change="_load">
                        <el-option v-for="item in loadOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="频道选择">
                    <el-button type="primary" size="mini" @click="channe_OP">选择</el-button>
                    <div class="Channe_Name">
                        <span v-for="(val, key) in showData.Channe_Name" :key="key">
                            <span>{{ val.name }}</span>
                            <span @click="Channe_Name_Del(key)">×</span>
                        </span>
                    </div>
                </el-form-item>
                <el-dialog title="频道选择" :modal="false" :visible.sync="channeShow" center>
                    <el-tree
                        ref="tree"
                        :data="ChannelList"
                        show-checkbox
                        node-key="id"
                        check-strictly
                        :default-checked-keys="TREE.defaultChecked"
                        highlight-current
                        :props="defaultProps"
                        @check-change="handleCheckChange"
                    >
                    </el-tree>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="channeShow = false">取 消</el-button>
                        <el-button size="mini" type="primary" @click="channeOk">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div v-if="!dialogVal">
                <el-form-item label="站点选择" style="margin-top: 15px;">
                    <el-select v-model="showData.value_1" multiple placeholder="请选择站点" style="width:100%;">
                        <el-option v-for="(it, key) in loadOptions" :key="key" :label="it.name" :value="it.id"> </el-option>
                    </el-select>
                </el-form-item>
            </div>
        </div>
    </el-form>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { showLoading } from "@/utils";
export default {
    name: "Tabale",
    props: {
        dialog: {
            type: Object,
            default: () => {}
        },
        modify:{
            type:Boolean,
            default:true
        },
        authString:{
            type: Object,
            default:()=>{}
        },
        dialogVal:{
            type:Number,
            default:0
        },
        jurisdiction: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showData:this.authString,
            loadOptions: [],
            ChannelList: [],
            loadOptions_1: [],
            channeShow: false,
            defaultProps: {
                children: "children",
                label: "name"
            },
            Channe_Id: [],
            TREE: {
                defaultChecked: [],
                ChanneName: []
            }
        };
    },
    computed: {
        ...mapState("system/user/jurisdiction", ["Options", "st_IDALL", "st_CHANNELALL", "st_CONTENTALL"])
    },
    watch: {
        channeShow(v) {
            if (v) {
                if(this.showData.Channe_Name){
                    this.showData.Channe_Name.forEach(ele => {
                        this.TREE.defaultChecked.push(ele.id);
                    });
                }
                this.TREE.ChanneName = [...this.showData.Channe_Name];
            } else {
                this.TREE.defaultChecked = [];
                this.TREE.ChanneName = [];
            }
        },
        "showData.authString"(v) {
            v.length === this.st_IDALL.length ? (this.dialog.idAll = true) : (this.dialog.idAll = false);
        },
        "showData.channelAuthString"(v) {
            v.length === this.st_CHANNELALL.length ? (this.dialog.channelAll = true) : (this.dialog.channelAll = false);
        },
        "showData.infoAuthString"(v) {
            v.length === this.st_CONTENTALL.length ? (this.dialog.contentAll = true) : (this.dialog.contentAll = false);
        },
        "showData.featureString"(v) {
            v.length ? (this.dialog.effectAll = true) : (this.dialog.effectAll = false);
        }
    },
    methods: {
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        // 获取站点
        async _loadSites() {
            showLoading(true, "正在加载站点");
            this.loadOptions = []
            let res = await this.loadSites();
            this._forEach(res.tree)
            this.$forceUpdate();
            showLoading(false);
        },
        _forEach(arry){
            arry.forEach(ele=>{
                this.loadOptions.push({id:ele.id,name:ele.name})
                if(ele.children){
                    this._forEach(ele.children)
                }
            })
        },
        async channe_OP() {
            if (!this.showData.value2) {
                this.$message({
                    message: "请选择站点",
                    type: "warning"
                });
            } else {
                showLoading(true, "正在加载站频道");
                let data = await this.getChannelList({ appid: this.showData.value2 });
                this.ChannelList = data;
                showLoading(false);
                this.channeShow = true;
            }
        },
        // 选择频道
        handleCheckChange(data, v) {
            if (v) {
                this.TREE.ChanneName.push({ id: data.id, name: data.name });
            } else {
                let name = [];
                this.TREE.ChanneName.forEach(ele => {
                    if (ele.id !== data.id) {
                        name.push(ele);
                    }
                });
                this.TREE.ChanneName = [...name];
            }
        },
        channeOk() {
            this.showData.Channe_Name = [...this.TREE.ChanneName];
            this.channeShow = false;
        },
        // 切换站点
        _load(){
            this.showData.Channe_Name = []
        },
        // 关闭弹窗
        _closeModal() {
            this.$emit("closeModal");
            this.$forceUpdate();
        },
        Channe_Name_Del(k) {
            this.showData.Channe_Name.splice(k, 1);
        },
        // 全选站点
        idAll(v) {
            v ? (this.showData.authString = [...this.st_IDALL]) : (this.showData.authString = []);
        },
        // 全选内容
        contentAll(v) {
            v ? (this.showData.infoAuthString = [...this.st_CONTENTALL]) : (this.showData.infoAuthString = []);
        },
        // 全选效果
        effectAll(v) {
            this.showData.featureString = [];
            if (v) {
                this.showData.featureString.push(this.Options.op_effect[this.dialogVal].value);
            }
        },
        // 全选频道
        channelAll(v) {
            v ? (this.showData.channelAuthString = [...this.st_CHANNELALL]) : (this.showData.channelAuthString = []);
        },
        // 新增修改保存
        dialogKeep() {
            let data = {};
            if (this.dialogVal) {
                if (!this.showData.Channe_Name.length) {
                    this.$message({
                        message: "请选择频道",
                        type: "warning"
                    });
                    return;
                }
                let channelList = {};
                this.loadOptions.forEach(ele=>{
                    if(ele.id===this.showData.value2){
                        channelList = {
                            app:{id:ele.id,name:ele.name},
                            channel:this.showData.Channe_Name
                        }
                    }
                })
                data = {
                    channelList,
                    channelAuthString:[...this.showData.channelAuthString],
                    infoAuthString:[...this.showData.infoAuthString],
                    featureString: [...this.showData.featureString],
                    id:this.showData.id
                };
            } else {
                if (!this.showData.value_1.length) {
                    this.$message({
                        message: "请选择站点",
                        type: "warning"
                    });
                    return;
                }
                let appList = [];
                this.loadOptions.forEach(ele => {
                    this.showData.value_1.forEach(i => {
                        if (ele.id == i) {
                            appList.push({ name: ele.name, id: ele.id });
                        }
                    });
                });
                data = {
                    appList,
                    authString: [...this.showData.authString],
                    featureString: [...this.showData.featureString],
                    id:this.showData.id
                };
            }
            this.$emit("preservation", data);
        }
    }
};
</script>
<style lang="scss" scoped>
.Channe_Name {
    > span {
        margin-right: 10px;
        font-size: 16px;
        span {
            color: #2f9fd2;
            border: 1px solid #e6ebf5;
        }
        > span:last-child {
            cursor: pointer;
            padding: 0 5px;
            user-select: none;
            color: #ff4949;
        }
    }
}
</style>
