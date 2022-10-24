<template>
    <Modal :visible="addrole" :title="title" @close="closeModel">
        <el-row>
            <el-col :div="24" style="margin-bottom:30px">
                <span style="padding-right:20px">角色名</span>
                <el-input
                    v-model="searchForm.name"
                    style="width:200px;margin-right: 30px"
                    placeholder="请输入角色名"
                ></el-input>
                <el-button type="primary" @click="toSearchRole">查询</el-button>
            </el-col>
            <el-col :span="24" style="margin-bottom:30px">
                <el-table :data="roles" border stripe @selection-change="select">
                    <el-table-column type="selection" label=" " width="50"></el-table-column>
                    <el-table-column prop="name" label="角色名"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24">
                <el-button type="primary" @click="commitOk">保存</el-button>
                <el-button type="danger" @click="closeModel">取消</el-button>
            </el-col>
        </el-row>
    </Modal>
</template>
<script>
import {  mapActions } from "vuex";
import { showLoading, showError } from "../../../utils";
import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
// import { deepCopy } from '@/utils/BaseUtil'
export default {
    name: "Addrole",
    // props:["getRoleList","appId","isApps"],
    props:{
        getRoleList:{
            type: Array,
            default: () => { }
        },
        appId:{
            type: Number,
            default: null
        },
        isApps:{
            type: Number,
            default: null
        }
    },
    data() {
        const searchForm = {
            name: '',
            page: 1,
            limit: DEFAULT_PAGE_LIMIT
        }
        return {
            searchForm,
            title: "添加角色",
            addrole: false,
            role: "",
            selectIds: [],
            roles:[]
        };
    },
    computed: {
        // ...mapState("system/role", ["roles"]),

    },
    watch: {
        getRoleList(newV,oldV) {
            this.selectIds = newV;
        }
    },

    created() {

        // this.searchRole();
        this._roleList()
    },
    methods: {
        ...mapActions('system/authority', ['roleList']),
        ...mapActions("system/role", ["loadRoles"]),
        _roleList() {
            showLoading(true, "正在加载用户列表");
            this.roleList({...this.searchForm})
                .then((data) => {
                    this.roles = data.data
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        toSearchRole(){
            this.searchForm.page=1
            this._roleList()
        },
        select(selection) {
            this.selectIds = selection;
        },
        closeModel() {
            this.addrole = false;
        },
        commitOk() {
            // debugger
            localStorage.setItem('linkrole'+this.isApps+this.appid,JSON.stringify(this.selectIds))
            /*
                需要真是请求接口取保存数据  this.selectIds
           */
            this.$emit("addRole", this.selectIds);
            this.addrole = false;
        }
    }
};
</script>
