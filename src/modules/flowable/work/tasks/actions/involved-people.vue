<template>
    <el-popover
        v-model="involvedPeoplePopoverVisible"
        :title="title"
        popper-class="tasks-popper"
        placement="bottom-start"
        :width="width"
        @show="involvedPeoplePopoverVisible = true"
        @hide="involvedPeoplePopoverVisible = false"
    >
        <SearchUsers
            ref="searchUserRef"
            :clear.sync="clearUsers"
            container-class="tasks-popper-body tasks-popper-people-body"
            @selected="onNewInvolvedPeople"
        />
        <template slot="reference">
            <span>
                <slot>
                    <i class="el-icon-circle-plus-outline task-action-icon"></i>
                </slot>
            </span>
        </template>
    </el-popover>
</template>
<script>
import SearchUsers from './search-users'
export default {
    components: {
        SearchUsers
    },
    props: {
        selected: {
            type: Function,
            default: () => { }
        },
        clear: {
            type: Boolean,
            default: false
        },
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '选择关联用户'
        },
        width: {
            type: Number,
            default: 300
        }
    },
    computed: {
        involvedPeoplePopoverVisible: {
            get() {
                return this.visible
            },
            set(visible) {
                this.$emit('update:visible', visible)
            }
        },
        clearUsers: {
            get() {
                return this.clear
            },
            set(isClear) {
                this.$emit('update:clear', isClear)
            }
        }
    },
    watch: {
        visible(isVisible) {
            if (isVisible === true) {
                this.$nextTick(() => {
                    this.$refs.searchUserRef.$refs.searchUserInputRef.focus()
                })
            }
        }
    },
    methods: {
        onNewInvolvedPeople(user) {
            this.$emit('selected', user)
        }
    }
}
</script>
