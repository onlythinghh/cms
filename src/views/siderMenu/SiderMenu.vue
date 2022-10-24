<template>
    <el-menu
        :router="true"
        :collapse="collapsed"
        :unique-opened="true"
        :default-openeds="opends"
        :default-active="active"
        class="hz-menu-vertical"
    >
        <SiderSubMenu :menus="menus" />
    </el-menu>
</template>


<script>
import { mapState } from "vuex";
import SiderSubMenu from "./SiderSubMenu.vue";
export default {
    name: "SiderMenu",
    components: {
        SiderSubMenu
    },
    props: {
        collapsed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            opends: [],
            active: ""
        };
    },
    computed: {
        ...mapState("authen", ["menus"])
    },
    watch:{
        $route(route){
            this.active = route.fullPath
        }
    },
    created() {
        this.active = this.$route.fullPath
    }
};
</script>

