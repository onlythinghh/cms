<template>
    <div class="container">
        <div v-show="showChannelList" class="channel-wrapper">
            <plain-channel-list :cur-article-id="curArticleId" @node-click="_getClickNode"/>
        </div>
        <div class="article-wrapper">
            <router-view :appid="appid" :article-permissions="articlePermission" :limit="limit" :show-article="showArticle"></router-view>
        </div>
    </div>
</template>
<script>
import PlainChannelList from '../channel/components/PlainChannelList'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'Article',
    components: {
        PlainChannelList
    },
    data () {
        return {
            appid: 1,
            showChannelList: true,
            articlePermission:[],
            limit: 10,
            showArticle: false,
            curArticleId: null,
            channelData: []
        }
    },

    computed: {
        ...mapGetters('cms/site',['site'])
    },
    watch:{
        '$router.path':function(v,o) {
            v === '/cms/article/article-recycle' ? this.showChannelList = false : this.showChannelList = true
            
        }
    },
    beforeDestroy() {
        this.showArticle = false
    },
    
    methods: {
        ...mapActions('cms/article/articleList',
            ['getArticleList']),
        _getClickNode (data) {
            localStorage.setItem('channelData',JSON.stringify(data))
            this.curArticleId = data.id ? data.id : this.channelData.id
            this.showArticle = true
            this.limit = data.articlePage
            this.articlePermission = data.articlePermissions
            this.appid = this.site.id
            this.$store.commit('cms/article/UPDATE_CURRENT_CHANNEL', data)
            this.$store.commit('cms/article/articleList/APPID', this.site.id)
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    display: flex;
    height: 100%;

    .channel-wrapper {
        width: 20%;
        max-width: 300px;
        overflow: auto;
    }

    .article-wrapper {
        flex: 1;
        padding-left:15px;
        overflow-x: hidden;
        border-left: 1px solid #e6ebf5;
    }
}
/deep/ .el-tree-node > .el-tree-node__children {
    overflow: visible;
}
</style>
