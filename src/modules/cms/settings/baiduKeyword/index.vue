<template>
    <div class="baidu_keyword">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="tesSearchRef" label-width="80px" :model="searchKey">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="关键字">
                                <el-select v-model="searchKey.name" placeholder="请选择关键字">
                                    <el-option
                                        v-for="item in keyWordList"
                                        :key="item.id"
                                        :label="item.keyWord"
                                        :value="item.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <el-table ref="tableList" :data="keyWordList">
                <el-table-column label="序号" width="55">
                    <template slot-scope="scope"> {{scope.$index+1}} </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="keyWord"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <el-button type="text" @click="setKeyWord(row)">配置</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-if="total > 10"
                class="pages"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="listInfo.limit"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
    </tablerow></div>
</template>
<script>
export default {
    data() {
        return {
            searchKey: {
                name: ''
            },
            keyWordList: [
                {id: '1', keyWord: '养老'},
                {id: '2', keyWord: '健康'}
            ],
            listInfo:{
                page: 1,
                limit: 20
            },
            total: 0,
        }
    },
    methods:{
        gitkeywordData() {
            console.log('获取列表数据', this.searchKey)
        },
        searchList(){
            this.gitkeywordData()
        },
        resetForm(){
            this.searchKey = this.$options.data().searchKey
            this.gitkeywordData()
        },
        setKeyWord(row) {
            console.log('配置关键字row', row)
        },

        sizeChange(v){
            this.listInfo.limit = v
            // console.log('翻页1： ', v)
            this.gitkeywordData()
        },
        currentChange(v){
            this.listInfo.page = v
            // console.log('翻页2： ', v)
            this.gitkeywordData()
        },
    }
}
</script>