import Request from '@/request'

const validate = (file, type, rootGetters) => {
    return new Promise((resolve, reject) => {
        if (file.size === 0) {
            alert('文件不能为空')
            // reject(new Error('文件不能为空'))
            Promise.reject(new Error('文件不能为空'))
            return 
        }
        if(type=='word'){
            resolve()
        }
        const typeLimit = {}
        const attachModule = rootGetters['authen/getDictionary']('attachModule') || {}

        Object.keys(attachModule).forEach(attachType => {
            const attach = attachModule[attachType]
            typeLimit[attach.type] = attach.limit
        })
        if (!type || !typeLimit[type]) {
            alert(`上传的文件类型${type || ''}不合法,允许的值: ${Object.keys(typeLimit).filter(Boolean).join(',')}`)
            // reject(new Error(`上传的文件类型${type || ''}不合法,允许的值: ${Object.keys(typeLimit).filter(Boolean).join(',')}`))
            Promise.reject(new Error(`上传的文件类型${type || ''}不合法,允许的值: ${Object.keys(typeLimit).filter(Boolean).join(',')}`))
            return 
        }
        const limit = typeLimit[type] || 0
        if (!limit || limit === 0) {
            alert(`文件大小限制不合法，至少大于0MB，请联系管理员`)
            // reject(new Error(`文件大小限制不合法，至少大于0MB，请联系管理员`))
            Promise.reject(new Error(`文件大小限制不合法，至少大于0MB，请联系管理员`))
            return 
        }
        const isLimit = file.size / 1024 / 1024 < limit
        if (!isLimit) {
            alert(`文件大小不能超过 ${limit} MB`)
            // reject(new Error(`文件大小不能超过 ${limit} MB`))
            Promise.reject(new Error(`文件大小不能超过 ${limit} MB`))
            return 
        }
        resolve()
    })

}

const upload = async (url, { file, type, appid = '', ...form }, rootGetters) => {
    return validate(file, type, rootGetters).then(() => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('module', type)
        formData.append('appid', appid)
        if (form && Object.keys(form).length > 0) {
            Object.keys(form).forEach(formItem => {
                formData.append(formItem, form[formItem])
            })
        }
        return Request.post(url, formData,{headers:{'sha':file.sha}})
    }).catch(error => {
        return Promise.reject(new Error(error.message || '文件上传失败'))
    })
}

const uploadImg = async (url, { file, type, appid = '', ...form }, rootGetters) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('module', type)
    formData.append('appid', appid)
    if (form && Object.keys(form).length > 0) {
        Object.keys(form).forEach(formItem => {
            formData.append(formItem, form[formItem])
        })
    }
    return Request.post(url, formData,{headers:{'sha':file.sha}})
}

const actions = {
    imageUpload({ rootGetters }, params = {}) {
        return upload('/cms/attach/upload/image', params, rootGetters)
    },
    fileUpload({ rootGetters }, params = {}) {
        return upload('/cms/attach/upload/file', params, rootGetters)
    },
    uploadFile({ rootGetters }, params = {}) {
        return uploadImg('/cms/work-guide/upload', params, rootGetters)
    },
    upWord({ rootGetters }, params = {}) {
        return uploadImg('/cms/attach/upload/word', params, rootGetters)
    }
}

export default {
    actions
}
