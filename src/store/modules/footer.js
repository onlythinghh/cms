export default {
    namespaced: true,
    state: {
        display: true
    },
    mutations: {
        display(state, display = true) {
            state.display = display
        }
    }
}
