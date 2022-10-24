<template>
    <!-- 利率数据修改 -->
    <div class="interesRateChange">
        <el-tabs v-model="activeName">
            <el-tab-pane label="万能保险信息" name="first"><wanneng /></el-tab-pane>
            <el-tab-pane label="投资连结保险信息" name="second"><invest v-if="activeName == 'second'" /></el-tab-pane>
            
        </el-tabs>
    </div>
</template>
<script>
import wanneng from "./allPower.vue";
import invest from './invest.vue'
export default {
    components:{
        wanneng,
        invest
    },
    data() {
        return {
            activeName: 'first',
            current: ''
        }
    },
    mounted() {
        
    },

    methods: {
        // handleClick(tab) {
        // }
    }
}
</script>