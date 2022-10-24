<template>
    <div class="data_form">
        <el-tabs v-model="activeName" @tab-click="checktab">
            <el-tab-pane label="留资表单" name="first">
                <fromCompt :key="fromKey1"></fromCompt>
            </el-tab-pane>
            <el-tab-pane label="留资概览" name="second">
                <fromOverview :key="fromKey2"></fromOverview>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import fromCompt from './formCompt/index.vue'
import fromOverview from './formOverview/index.vue'
export default {
    components:{
        fromCompt,
        fromOverview
    },
    data() {
        return {
            activeName: 'first',
            fromKey1: 0,
            fromKey2: 0,
        }
    },

    methods:{
        checktab(val){
            // console.log('val',val)
            switch (val.index) {
            case '0':
                this.fromKey1 += 1
                break;
            case '1':
                this.fromKey2 += 1
                break;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.data_form{
    padding: 0 10px;
    
}
</style>