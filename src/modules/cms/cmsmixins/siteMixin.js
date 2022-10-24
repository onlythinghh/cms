import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('cms/site', {
            '$_selectedSite': 'site'
        })
    },
    watch: {
        $_selectedSite({ id, name }) {
            this.reloadWhenSiteChange && this.reloadWhenSiteChange({ id, name })
        }
    }
}
