<template>
    <div class="img_list">
        <el-checkbox-group v-model="checkList" @change="CheckedChange">
            <div class="list_item" v-if="list.length > 0">
                <div v-for="(item, index) in list" :key="index" class="item">
                    <el-checkbox :label="item.id" class="check_box">
                    <div class="top_box">
                        <div class="item_img">
                            <img class="img" v-if="item.pathPart" :src="item.pathPart" alt="cex">
                            <div v-else class="image_slot">
                                <i class="el-icon-picture-outline icon_size"></i>
                            </div>
                        </div>
                        <div class="img_info">
                            <p>名称：{{item.name|filnull}}</p>
                            <p>标签：{{item.keyword}}</p>
                            <!-- <p>{{item.size}}</p> -->
                            <p>状态：{{statusName[item.state]}}</p>
                            <p>上传者：{{item.uploader}}</p>
                            <p>时间：{{item.createTime | dateFormat}}</p>
                        </div>
                    </div>
                    <!-- <div class="check"></div> -->
                    </el-checkbox>
                </div>
            </div>
            <div class="list_item" v-else>
                <el-empty class="empty_data" :image-size="200"></el-empty>
            </div>
        </el-checkbox-group>
        <el-pagination
            v-if="dataCount > 10"
            @size-change="sizeChange"
            @current-change="currentChange"
            :page-sizes="[12, 24, 48, 96]"
            :page-size="limit"
            :total="dataCount"
            layout="total, sizes, prev, pager, next">
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'ImgList',
    props: {
        list: {
            type: Array,
            default: () => []
        },
        limit: {
            type: Number,
            default: 12
        },
        dataCount: {
            type: Number,
            default: 0
        }
    },
    // components里的组件会在mian.js自动引入
    data() {
        return {
            checkList: [],
            statusName: ['草稿', '已上传', '已回收', '已引用']
        }
    },
    methods:{

        //多选框change
        CheckedChange(value) {
            this.checkList = value
            let finalArr = this.list.filter(item => value.indexOf(item.id) != -1);
            // console.log('多选框change',value, finalArr)
            this.$emit('handleChange', finalArr, value)
        },
        clearData(){
            this.checkList = []
        },
        // 每页数量切换
        sizeChange(v) {
            this.$emit('sizeChange', v)
        },
        // 分页
        currentChange(v) {
            this.$emit('currentChange', v)
        }
    },
    filters:{
        filnull(name) {
            return name == '' || name == null ? '--' : name
        }
    }
}
</script>
<style lang="scss">
.item .check_box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    .el-checkbox__label{
        padding-left: 0;
    }
    .el-checkbox__input{
        padding: 7px 0;
    }
}

</style>
<style lang="scss" scoped>
.img_list{
    position: relative;
    .list_item{
        min-width: 950px;
        display: flex;
        flex-wrap: wrap;
        .empty_data{
            margin: 0 auto;
        }
    }
    .item {
        width: 22%;
        min-width: 215px;
        height: 270px;
        background: #ccc;
        margin: 10px;
        .top_box{
            position: relative;
            .item_img{
                width: 100%;
                height: 240px;
                img{
                    width: 100%;
                    height: 100%;
                }
                .image_slot{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .icon_size{
                        font-size: 60px;
                        color: #797979;
                    }
                }
            }
            .img_info{
                width: 100%;
                height: 240px;
                text-align: left;
                color: #ffffff;
                background: rgba($color: #999999, $alpha: 0.5);
                position: absolute;
                top: 0;
                left: 0;
                p{
                    font-size: 14px;
                    padding: 0 15px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
        // .check{
        //     height: 30px;
        //     line-height: 30px;
        //     text-align: center;
        // }
    }
}
</style>