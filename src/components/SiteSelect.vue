<template>
    <div>
        <div class="site-select" @click="changeSite">
            {{siteName | ellipsis}}
            <i v-if="hasMore" class="el-icon-arrow-down"></i>
        </div>
        <Modal
            v-if="hasMore"
            :visible="visible"
            title="选择站点"
            class="el-custome-dialog no-padding"
            @close="closeModal"
        >
            <el-form ref="chooseSiteForm" :model="currentSite" label-width="100px">
                <el-row>
                    <el-form-item prop="id">
                        <el-col :span="20">
                            <el-select
                                v-model="siteId"
                                placeholder="请选择站点"
                                class="w100"
                                :filterable="true"
                            >
                                <el-option
                                    v-for="(site, index) in siteOptions"
                                    :key="index"
                                    :label="site.label"
                                    :value="site.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save">确认</el-button>
                        <el-button @click="closeModal">取消</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </Modal>
    </div>
</template>
<style lang="scss">
.site-select {
    font-size: 14px;
}
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { showError } from '../utils';
export default {
    name: 'SiteSelect',
    filters: {
        ellipsis(value) {
            if (!value) return ''
            if (value.length > 15) {
                return value.slice(0, 15) + '...'
            }
            return value
        }
    },
    data() {
        return {
            visible: false,
            currentSite: {},
        }
    },
    computed: {
        /* ...mapState('cms/site', {
            'site': 'site'
        }), */
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites',
            'site': 'site'
        }),
        siteName() {
            const site = this.site
            return site.name
        },
        hasMore() {
            return this.sites && this.sites.length > 0
        },
        siteOptions() {
            const sites = this.sites
            const options = []
            sites.forEach(site => {
                options.push({ label: site.name, value: site.id })
            })
            return options
        },
        siteId: {
            get() {
                return this.currentSite.id || this.site.id
            },
            set(value) {
                const site = this.findSiteById(value)
                this.currentSite = { ...site }
            }
        }
    },
    created() {

    },
    methods: {
        ...mapMutations('cms/site', ['choose']),
        findSiteById(siteId) {
            const sites = this.sites || []
            const site = sites.find(site => site.id === siteId)
            return site
        },
        changeSite() {
            if (!this.hasMore) {
                return
            }
            this.visible = true
        },
        closeModal() {
            this.currentSite = {}
            this.visible = false
            // this.$refs.chooseSiteForm.resetFields()
        },
        save() {
            const currentSite = this.currentSite || this.site
            if (!currentSite && !currentSite.id) {
                showError('请选择站点')
                return
            }
            // 使用副本，操作vuex
            this.choose({ ...currentSite })
            this.closeModal()
            this.$router.go(0)
        }
    }
}
</script>
