<template>
    <!-- ab测试 -->
    <div class="ab_test">
        <el-tabs v-model="activeName" @tab-click="checktab">
            <el-tab-pane label="实验列表" name="first">
                <TestList :key="fromKey1"></TestList>
            </el-tab-pane>
            <el-tab-pane label="试验层列表" name="second">
                <TestLayerList :key="fromKey2"></TestLayerList>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import TestList from './tabpane/testList.vue'
import TestLayerList from './tabpane/testLayerList.vue'
export default {
    components: {
        TestList,
        TestLayerList,
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