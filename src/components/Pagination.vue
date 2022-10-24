<template>
    <el-pagination
        :layout="layout"
        :background="background"
        :hide-on-single-page="hideOnSinglePage"
        :page-size="pageSize"
        v-bind="$attrs"
        v-on="$listeners"
    ></el-pagination>
</template>
<script>
import { DEFAULT_PAGE_LIMIT } from '../utils/Const'
export default {
    name: 'Pagination',
    props: {
        layout: {
            type: String,
            default: 'prev, pager, next'
        },
        background: {
            type: Boolean,
            default: true
        },
        hideOnSinglePage: {
            type: Boolean,
            default: true
        },
        pageSize: {
            type: Number,
            default: DEFAULT_PAGE_LIMIT
        }
    }
}
</script>
