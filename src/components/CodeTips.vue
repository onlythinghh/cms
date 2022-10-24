<template>
    <el-tooltip>
        <div slot="content" class="el-code-tips">
            <ul>
                <li>编码只允许输入数字、小写字母、特殊字符 :-_ </li>
                <li>特殊字符不能连续且同时只能出现一种</li>
                <li><strong>示例：</strong></li>
                <li>aaaaa</li>
                <li>aa-bb-cc</li>
                <li>aa:bb:cc</li>
                <li>aa_bb_cc</li>
            </ul>
        </div>
        <i class="el-icon-question"></i>
    </el-tooltip>
</template>
<style lang="scss">
.el-code-tips > ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    > li {
        padding: 0;
        margin: 0;
    }
}
</style>
<script>
export default {
    name:'CodeTips'
}
</script>


