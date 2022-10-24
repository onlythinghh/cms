<template>
    <div class="vote">
        <div class="header">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-form-item label="标题">
                            <el-input v-model="form.title" placeholder="请输入标题" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="活动时间">
                            <el-date-picker
                            v-model="form.time"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="timestamp"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态">
                            <el-select v-model="form.status" placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in statesArr" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="addBtn">
            <el-button type="primary" @click="$router.push({name: 'VoteAdd'})">新增</el-button>
            <!-- <el-button type="primary" @click="_export">导出</el-button> -->
        </div>
        <div class="line"></div>
        <div class="table">
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            >
                <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span style="cursor:pointer;color: #1890ff;" @click="look(scope.row)">
                            {{scope.row.title}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="开始日期"
                    width="220"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.startTime ? dateFormat(scope.row.startTime) : ''}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="结束日期"
                    width="220"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.deadline ? dateFormat(scope.row.deadline) : ''}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="220"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="280"
                >
                 <template slot-scope="scope">
                     <div>
                         <el-button type="text" @click="update(scope.row)">修改</el-button>
                         <el-button type="text" @click="del(scope.row)">删除</el-button>
                         <el-button type="text" @click="release(scope.row)">发布</el-button>
                         <el-button type="text" @click="_export(scope.row)">导出</el-button>
                         <el-button v-if="scope.row.status !== '结束'" type="text" @click="end(scope.row)">结束</el-button>
                         <!-- <el-button type="text" @click="response(scope.row)">问卷</el-button> -->
                         <!-- <el-button type="text" @click="_export(scope.row)">导出</el-button> -->
                     </div>
                 </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                :page-sizes="[10, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog title="查看问卷" :visible.sync="my">
            <el-table :data="voteData">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column property="oper" label="填写人"></el-table-column>
                <el-table-column label="填写时间">
                    <template slot-scope="scope">
                        <span>{{dateFormat(scope.row.createTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="address" label="操作">
                    <template slot-scope="scope">
                        <div>
                            <el-button
                                type="text"
                                style="color: #0078D4; fontSize: 14px;"
                                @click="details(scope.row)"
                            >详情</el-button>
                            <el-button
                                type="text"
                                style="color: #0078D4; fontSize: 14px;"
                                @click="delSolicitation(scope.row.id)"
                            >删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="查看详情" :visible.sync="myDetails" width="30%">
            <div class="answerBox">
                <div v-for="(item, index) in answer" :key="index" class="answer">
                    <p class="title">{{index+1 + ' ' + item.problem}}</p>
                    <div v-if="item.type == 1" class="showAnswer">
                        <el-radio v-for="(rad,ind) in item.items" :key="ind" v-model="item.answer" disabled :label="rad.item">{{rad.item}}</el-radio>
                    </div>
                    <div v-else class="showAnswer">
                        <el-checkbox v-for="(radi,inde) in item.items" :key="inde" v-model="radi.isPick" disabled>{{radi.item}}</el-checkbox>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { downloadByBlob } from "@/utils/BaseUtil.js"
import { mapActions } from "vuex";
import { showLoading, hideLoading } from "@/utils";
import { confirm } from "@/utils";

export default {
    data() {
        return {
            type: '1',
            my: false,
            myDetails: false,
            statesArr: [
                {
                    label: '编辑',
                    value: 'edit'
                },
                {
                    label: '进行中',
                    value: 'having'
                },
                {
                    label: '结束',
                    value: 'end'
                }
            ],
            answer: [
                {
                    answer: "男",
                    id: 64,
                    items: [{id: 156, item: "男", no: null, isPick: null}, {id: 157, item: "女", no: null, isPick: null}],
                    no: null,
                    problem: "性别",
                    type: 1
                }
            ],
            form: {
                title: '',
                status : '',
                time: ''
            },
            limit: 10,
            page: 1,
            total: 0,
            tableData: [],
            voteData: [
                {
                    oper: '小徐',
                    createTime: 1628499154199,
                }
            ]
        }
    },
    created() {
        this.onSubmit()
    },
    methods: {
        ...mapActions('cms/settings/vote',['exportCurrent','voteList','voteDetele','voteEnd','voteRelease','exportVote']),
        // 查看问卷
        response() {
            this.my = true
        },
        //问卷详情
        // 征集详情
        async details(scope) {
            this.myDetails = true
            // showLoading('加载中')
            // const { data } = await this.answerDetail({
            //     id: scope.id
            // })
            // this.answer = data
            // hideLoading()
        },
        // 时间格式化
        dateFormat(date) {
            if(typeof date=='string'){
                return date.substr(0,10).replace(/-/ig,'.')
            }
            var time = new Date(date)
            var m = time.getMonth()+1
            var d = time.getDate()
            return `${time.getFullYear()}.${m >9 ? m : '0' + m}.${d > 9 ? d : '0' + d}`
        },
        // 导出
        async  _export(scope) {
            showLoading("正在导出")
            const data = await this.exportVote({
                id: scope.id
            })
            downloadByBlob(data, {filename:'调查问卷.docx'})
            hideLoading()
        },
        // 查询
        async onSubmit() {
            showLoading('加载中...')
            const data = await this.voteList({
                ...this.form,
                startTime: this.form.time ? this.form.time[0] : '',
                deadline : this.form.time ? this.form.time[1] : '',
                page: this.page,
                limit: this.limit
            })
            hideLoading()
            if(data.success) {
                this.total = data.count
                this.tableData = data . data
            }
        },
        // 修改
        update(row) {
            this.$router.push({name: 'VoteAdd',query: { id: row.id }})
        },
        look(row) {
            this.$router.push({name: 'VoteAdd',query: { id: row.id, type:'查看'}})
        },
        // 删除
        del(row) {
            confirm('确认删除吗?','警告',{
                ok: async () => {
                    showLoading('删除中...')
                    const data = await this.voteDetele({
                        id: row.id
                    })
                    hideLoading()
                    if(data.success) {
                        this.onSubmit()
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    }
                }
            })
        },
        release(row){
            confirm('确认发布吗?','警告',{
                ok: async () => {
                    showLoading('发布中...')
                    const data = await this.voteRelease({
                        id: row.id
                    })
                    hideLoading()
                    if(data.success) {
                        this.onSubmit()
                        this.$message({
                            type: 'success',
                            message: '发布成功'
                        })
                    }
                }
            })
        },
        // 结束
        async end(row) {
            showLoading('正在结束中...')
            const data = await this.voteEnd({
                id: row.id
            })
            hideLoading()
            if(data.success) {
                this.onSubmit()
                this.$message({
                    type: 'success',
                    message: '已结束'
                })
            }
        },
        handleSizeChange(v) {
            this.limit = v
            this.onSubmit()
        },
        handleCurrentChange(v) {
            this.page = v
            this.onSubmit()
        }
    },
}
</script>

<style lang="scss" scoped>
.vote {
    width: 100%;
    .header {
        width: 100%;
        /deep/ .el-form-item {
            width: 100%;
        }
    }
    .addBtn {
        margin-bottom: 24px;
    }
    .line {
        width: 100%;
        height: 1px;
        background: #e5e5e5;
    }
    .table {
        width: 100%;
        .tabs {
            margin: 24px 0;
        }
    }
    .pagination {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 16px;
        box-sizing: border-box;
    }
    .answerBox {
        width: 100%;
        height: 300px;
        overflow-y: auto;
        .answer {
            width: 100%;
            .title {
                width: 100%;
                height: 44px;
                padding: 0 16px;
                box-sizing: border-box;
                margin: 0;
                background: #f0f0f0;
                line-height: 44px;
            }
            .showAnswer {
                width: 100%;
                padding: 10px 24px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                /deep/ .el-radio {
                    margin-bottom: 10px;
                }
                /deep/ .el-checkbox{
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>
