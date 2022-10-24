<template>
    <div
        id="app"
        v-loading.fullscreen.lock="loading.isLoading"
        :element-loading-text="loading.text"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
        class="background"
    >
        <transition name="fade">
            <router-view />
        </transition>
    </div>
</template>
<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
<script>
import { mapState } from "vuex";
export default {
    name: "App",
    computed: {
        ...mapState('widget',["loading"])
    },
    methods:{
    }
};
</script>
