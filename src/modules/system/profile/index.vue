<template>
    <div>
        <el-tabs v-model="activeTab" @tab-click="tabClick">
            <el-tab-pane label="基本信息" name="base">
                <transition name="fade">
                    <Base/>
                </transition>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="passwd">
                <transition name="fade">
                    <Passwd/>
                </transition>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Base from "./base.vue";
import Passwd from "./passwd.vue";
export default {
    name: "Profile",
    components: {
        Base,
        Passwd
    },
    data() {
        return {
            activeTab: ""
        };
    },
    computed: {
        tabName() {
            const route = this.$route.fullPath;
            const tabName = route.substring(route.lastIndexOf("/") + 1);
            return tabName;
        }
    },
    watch: {
        $route(route) {
            this.activeTab = this.tabName;
        }
    },
    created() {
        this.activeTab = this.tabName;
    },
    methods: {
        tabClick(tab) {
            let route = this.$route.fullPath;
            route = route.substring(0, route.lastIndexOf("/"));
            this.$router.push(route + "/" + tab.name);
        }
    }
};
</script>

