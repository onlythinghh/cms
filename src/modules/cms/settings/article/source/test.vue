<template>
    <Source selection :source-id="1" :ok="_ok" />
</template>
<script>
import Source from './index'
export default {
    components: {
        Source
    },
    methods: {
        _ok({ id, name }) {
        }
    }
}
</script>

