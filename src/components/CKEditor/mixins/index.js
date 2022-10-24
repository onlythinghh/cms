export default {
    props: {
        content: {
            type: String,
            default: ''
        },
        editor: {
            type: Object,
            default: () => null
        }
    }
}
