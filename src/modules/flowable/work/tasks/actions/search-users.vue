<template>
    <div :class="containerClass">
        <el-input
            ref="searchUserInputRef"
            v-model="filterdUser"
            placeholder="搜索用户"
            size="mini"
            clearable
        />
        <div>使用上面的搜索框查找用户</div>
        <ul class="search-users">
            <li v-for="user in users" :key="user.id" @click="onSelectedUser(user)">
                <i class="el-icon-user-solid"></i>
                <span>{{user.fullName}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import { get } from '../../../request'
import { showLoading, showError } from '@/utils'

export default {
    props: {
        selected: {
            type: Function,
            default: () => { }
        },
        containerClass: {
            type: String,
            required: false,
            default: ''
        },
        clear: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            users: [],
            filterdUser: '',
            timer: null,
            searchDelay: 500
        }
    },
    watch: {
        filterdUser(newKeywords) {
            // search
            if (!newKeywords) {
                this.users = []
            } else {
                this.searchAssignee()
            }
        },
        clear(clear) {
            if (clear === true) {
                this.users = []
                this.filterdUser = ''
                this.timer = ''
                this.$emit('update:clear', false)
            }
        }
    },
    methods: {
        searchAssignee() {
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                showLoading('正在加载数据...')
                get('/flowable/workflow-users?filter=' + this.filterdUser).then(response => {
                    showLoading(false)
                    const rest = response.data
                    if (rest.success) {
                        this.users = rest.data || []
                        return
                    }
                    showError(rest.errMsg)
                }).catch(error => {
                    showLoading(false)
                    console.error(error)
                    showError(error.message)
                })
            }, this.searchDelay)
        },
        onSelectedUser(user) {
            // this.selected(user)
            this.$emit('selected', user)
        },
    }
}
</script>
