<template lang="html">
    <div>
        <template v-for="menu in menus">
            <template v-if="menu.children && menu.children.length > 0">
                <el-submenu :key="menu.id" :index="menu.url">
                    <template slot="title">
                        <i v-if="!!menu.icon" :class="menu.icon"></i>
                        <span>{{ menu.name }}</span>
                    </template>
                    <SubMenu :menus="menu.children"></SubMenu>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :key="menu.id" :index="menu.url" :menu="menu" @click="clickMenu(menu)">
                    <i v-if="!!menu.icon" :class="menu.icon"></i>
                    <span slot="title">{{ menu.name }}</span>
                </el-menu-item>
            </template>
        </template>
    </div>
</template>
<style lang="scss" scoped>
.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-submenu > .el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}
</style>
<script>
import {mapActions, mapState,mapGetters} from 'vuex'
import { showLoading,showMessage, showError} from '@/utils'
export default {
    name: "SubMenu",
    props: {
        menus: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    methods:{
         ...mapActions('system/log',['addLog']),
        async clickMenu(data){
            let res = await this.addLog({
                value:data.name
            });
        }
    }
};
</script>
