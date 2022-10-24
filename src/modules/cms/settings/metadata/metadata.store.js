import Request from '@/request'
const METADATA_LIST='METADATA_LIST'
const FORM_EDIT='FORM_EDIT'

const WidgetList = [
    {
        key: "TEXT",
        label: "普通文本"
    },
    {
        key: "TEXTAREA",
        label: "文本域"
    },
    {
        key: "HIDDEN",
        label: "隐藏域"
    },
    {
        key: "IMAGE",
        label: "图片"
    },
    {
        key: "ATTACH",
        label: "附件"
    },
    {
        key: "SELECT",
        label: "下拉框"
    },
    {
        key: "CHECKBOX",
        label: "多选框"
    },
    {
        key: "RADIO",
        label: "单选框"
    },
    {
        key:"TAGS",
        label:'标签'
    },
    {
        key:"COLOR",
        label:'颜色下拉框'
    }
]
const ALL =[...WidgetList,
    {
        key: "DATE",
        label: "日期"
    },
    {
        key: "TIME",
        label: "时间"
    },
    {
        key: "DATETIME",
        label: "日期时间"
    },
    {
        key: "RICHTEXT",
        label: "富文本"
    },
    {
        key: "SYSTEM",
        label: "系统保留"
    }
]
const optionsType = [
    {
        value: "CHAR",
        label: "字符串型"
    },
    {
        value: "NUMBER",
        label: "数值型"
    },
    {
        value: "DATE",
        label: "时间类型"
    },
    {
        value: "BOOL",
        label: "布尔类型"
    },
    {
        value: "TEXT",
        label: "文本型"
    }
];
const state = {
    data: [],
    WidgetList,
    ALL,
    optionsType
}

const mutations = {
    [METADATA_LIST](state,  data) {
        state.data = data
    },
    [FORM_EDIT](state,  data) {
        // state.data = data
    },
}


const actions = {
    metadataList({ commit },request) {
        return Request.post('/cms/form/list',request).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(METADATA_LIST, rest.data)
                return Promise.resolve({ count: rest.count,data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    metadataEdit({ commit },request) {
        return Request.post('/cms/form/edit',request).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(FORM_EDIT, rest.data)
                return Promise.resolve({ data:rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    metadataDel({ commit },request) {
        return Request.post('/cms/form/del',request).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    systemList({ commit },request) {
        return Request.post('/cms/form/field',request).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    formDetail({ commit },request) {
        return Request.post('/cms/form/detail',request).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    
}

const getters = {

}
export default {
    state,
    actions,
    getters,
    mutations
}
