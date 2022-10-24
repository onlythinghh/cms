const SET_PERMISSION = 'SET_PERMISSION'

const channelTree = {
    state: {
        articlePermissions: [],
        channelPermissions: []
    },
    mutations: {
        [SET_PERMISSION] (state, { articlePermissions, channelPermissions }) {
            state.articlePermissions = articlePermissions
            state.channelPermissions = channelPermissions
        }
    }
}

export default channelTree
