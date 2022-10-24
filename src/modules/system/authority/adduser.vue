<template>
    <Modal :visible="adduser" :title="title" width="50%" @close="closeModel">
        <el-row>
            <el-col :span="24" style="margin-bottom:30px">
                <span style="padding-right:20px">用户名</span>
                <el-input
                    v-model="searchForm.username"
                    style="width:200px;margin-right: 30px"
                    placeholder="请输入用户名"
                ></el-input>
                <el-button type="primary" @click="toSearchUser">查询</el-button>
            </el-col>
            <el-col :span="24" style="margin-bottom:30px">
                <el-table ref="multipleTable" :data="userList" border stripe @selection-change="select">
                    <el-table-column type="selection" label=" " width="50"></el-table-column>
                    <el-table-column v-slot="{row}" prop="username" label="用户名">
                        <span>{{row.username}}</span>
                    </el-table-column>
                </el-table>
            </el-col>
            <!-- <template v-slot:pagination>
                <Pagination
                    :current-page="page"
                    :page-size="limit"
                    :total="searchForm.total"
                    @current-change="changePagination"
                ></Pagination>
            </template> -->
            <el-col :span="24">
                <el-button type="primary" @click="commitOk">保存</el-button>
                <el-button type="danger" @click="closeModel">取消</el-button>
            </el-col>
        </el-row>

    </Modal>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { showLoading, showError } from "../../../utils";
import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
import { deepCopy } from '@/utils/BaseUtil'

export default {
    name: "Adduser",
    props:{
        getUserList:{
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
            username:'',
            page: 1,
            limit:DEFAULT_PAGE_LIMIT,
            total:0
        }
        return {
            searchForm,
            title: "添加用户",
            adduser: false,
            users: "",
            selectIds: this.getUserList
        };
    },
    computed: {
        ...mapState("system/user", ["data" ]),
        userList () {
            const _userList = deepCopy(this.data)
            _userList.map((item, index) => {
                item['isShow'] = true
                if (item.admin || (!item.admin && !item.enabled) || (!item.admin && item.locked)) {
                    _userList.splice(index, 1)
                }
            })
            return _userList
        }
    },
    watch: {
        getUserList(newV,oldV) {
            this.selectIds = newV
            
           
        },
    },

    created() {
        this.searchUser();
    },
    mounted() {
        // console.log(this.getUserList)
        // 初始化的复选框
        // this.$nextTick( ()=> {
        // this.$refs.multipleTable.toggleRowSelection(this.getUserList,true);
        // console.log(this.$refs)
        // })
        
    },

    methods: {
        ...mapActions("system/user", ["searchList","linkuser"]),
        ...mapActions("system/authority", ["linkuser"]),

        
        
        searchUser() {
            showLoading(true, "正在加载用户列表");
            this.searchList({...this.searchForm})
                .then((count) => {
                    this.searchForm.total = count
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },

        closeModel() {
            // this.$emit("addUser", this.selectIds);
            this.adduser = false;
        },
        select(selection) {
            this.selectIds =  selection;

        },
        toSearchUser(){
            this.searchForm.page=1
            this.searchUser()
        },
        // 改变当前页
        // changePagination(currentPage) {
        //     // this.getHotWordList({ page: currentPage })
        //     this.searchForm.page = currentPage
        //     this.searchUser()
        // },
        commitOk() {
            localStorage.setItem('linkuser'+this.isApps+this.appId,JSON.stringify(this.selectIds))
            /*
                需要真是请求接口取保存数据 this.selectIds
           */
            this.$emit("addUser", this.selectIds);
            this.adduser = false;
        },
    }
};
</script>
