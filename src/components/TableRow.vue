<template>
    <div class="table-row" :style="css">
        <div v-if="hasForm" :class="['table-form',!hasFormBorder && 'no-border']" :style="formCss">
            <slot name="form"></slot>
        </div>
        <div v-if="hasHeader" class="table-header" :style="tableCss">
            <div class="table-header-left" :style="tableLeftCss">
                <slot name="header-left"></slot>
            </div>
            <div class="table-header-right" :style="tableRightCss">
                <slot name="header-right"></slot>
            </div>
        </div>
        <div class="table-body" :style="tableBodyCss">
            <slot></slot>
            <div v-if="hasPagination" class="table-pagination">
                <slot name="pagination"></slot>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.table-row {
    width: 100%;
    .table-form,
    .table-header {
        margin: 15px 0;
    }
    .table-form {
        border-bottom: 1px solid #dfe6ec;
        &.no-border {
            border: none !important;
        }
    }
    .table-header {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        .table-header-left > *:not(:last-child),
        .table-header-right > *:not(:last-child) {
            margin-right: 10px;
        }
    }
    .table-form + .table-header,
    .table-header + .table-body {
        margin-top: 30px;
    }
    .table-header + .table-body {
        margin-top: 0;
    }
    .table-body {
        .table-pagination {
            margin: 15px 0;
            & > div {
                text-align: right;
            }
        }
    }
}
</style>

<script>
export default {
    name: 'TableRow',
    props: {
        hasForm: {
            type: Boolean,
            default: false
        },
        hasHeader: {
            type: Boolean,
            default: false
        },
        hasPagination: {
            type: Boolean,
            default: false
        },
        css: {
            type: Object,
            default: () => { }
        },
        hasFormBorder: {
            type: Boolean,
            default: true
        },
        formCss: {
            type: Object,
            default: () => { }
        },
        tableCss: {
            type: Object,
            default: () => { }
        },
        tableLeftCss: {
            type: Object,
            default: () => { }
        },
        tableRightCss: {
            type: Object,
            default: () => { }
        },
        tableBodyCss: {
            type: Object,
            default: () => { }
        }
    }
}
</script>
