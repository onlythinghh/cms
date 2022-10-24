<template>
    <el-breadcrumb
        v-if="crumbs && crumbs.length > 0"
        class="breadcrumb"
        style="margin-bottom:10px;"
        separator-class="el-icon-arrow-right"
    >
        <el-breadcrumb-item v-for="crumb in crumbs" :key="crumb.path">{{ crumb.name }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    name: "Breadcrumb",
    data() {
        return {
            crumbs: []
        };
    },
    watch: {
        $route: function (route) {
            this.setCrumbs(route);
        }
    },
    created() {
        this.setCrumbs(this.$route);
    },
    methods: {
        setCrumbs(route) {
            let crumbs = [];
            const matchedRoutes = route.matched;
            const filterPaths = [];
            matchedRoutes.forEach(matched => {
                const path = matched.path || "/";
                if (filterPaths.indexOf(path) === -1 && matched.meta.title) {
                    crumbs.push({
                        path: path,
                        name: matched.meta.title
                    });
                    filterPaths.push(path);
                }
            });
            if (crumbs.length === 1 && crumbs[0].path === "/") {
                crumbs = [];
            }
            this.crumbs = crumbs;
        }
    }
};
</script>


