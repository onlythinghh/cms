const UPDATE_CURRENT_CHANNEL = 'UPDATE_CURRENT_CHANNEL'
const article = {
    state: {
        currentChannel: {
            id: 0
        }
    },

    mutations: {
        [UPDATE_CURRENT_CHANNEL] (state, data) {
            state.currentChannel = data
        }
    }
}

export default article
