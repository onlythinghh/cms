import Request from '@/request'
import { downloadByBlob } from '../../../../utils/BaseUtil'
import config from './config'
const { fileRepeatCode } = config

const FILES = 'FILES'
const FILE = 'FILE'
const ADD_EXPLORER = 'ADD_EXPLORER'
const TYPE = 'type'
const setEditModalVisible = 'setEditModalVisible'
const setAppId = 'setAppId'
const clearExplorer = 'clearExplorer'
const FILE_LIST = 'FILE_LIST'

const state = {
    // 资源管理
    explorer: {},
    // 当前文件列表
    files: [],
    // 当前文件内容 包含内容
    file: {},
    // 当前文件路径
    type: [],
    editModal: {
        visible: false
    },
    appid: '',
    list:[],
    preview: ''

}
const getters = {
    findExplorer(state) {
        const explorer = state.explorer
        return prePath => {
            const files = []
            Object.keys(explorer).forEach(path => {
                if (path !== prePath && path.startsWith(prePath)) {
                    const nextPath = path.substring(prePath.length + 1)
                    const nextFilename = nextPath.substring(0, nextPath.indexOf('/') > -1 ? nextPath.indexOf('/') : undefined)
                    const filename = [prePath, nextFilename]
                    if (explorer[filename]) {
                        files.push(explorer[filename])
                    }
                }
            })
            return files
        }
    }
}
const mutations = {
    [FILES](state, { files = [] }) {
        // 去重
        const _files = []
        const temp = {}
        files.forEach(file => {
            if (!temp[file.filename]) {
                _files.push(file)
                temp[file.filename] = 1
            } else {
                temp[file.filename] = temp[file.filename] + 1
            }
        })
        state.files = _files
    },
    [ADD_EXPLORER](state, { appid, files = [] }) {
        const type = [appid, ...state.type]
        const parentPath = type
        if (!files || files.length === 0) {
            // 若为空则清空当前目录
            const _explorer = { ...state.explorer }
            Object.keys(_explorer).forEach(key => {
                if (key !== parentPath && key.startsWith(parentPath)) {
                    delete _explorer[key]
                }
            })
            state.explorer = { ..._explorer }
        } else {
            // 按路径将文件放入文件管理器
            const explorer = {}
            files.forEach(file => {
                const filePath = [parentPath, file.filename]
                explorer[filePath] = file
            })
            state.explorer = { ...state.explorer, ...explorer }
        }
    },
    [FILE](state, file) {
        state.file = file
    },
    [TYPE](state, type = []) {
        state.type = type
    },
    [setEditModalVisible](state, { visible }) {
        state.editModal.visible = !!visible
    },
    [setAppId](state, appid) {
        state.appid = appid
    },
    [clearExplorer](state) {
        state.explorer = {}
        state.files = []
        state.file = {}
        state.type = []
        state.editModal = {
            visible: false
        }
        state.appid = ''
    },
    [FILE_LIST](state, data) {
        state.list = []
        state.list = data.data
    },
}

const actions = {
    _readFiles({ commit },list) {
        return Request.post('/cms/filexplorer/list',list).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(FILE_LIST, { data: rest.data })
                return Promise.resolve ({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    readFile({ commit, state }, { appid, file,type }) {
        // 保存appid
        commit(setAppId, appid)

        // 已存在的文件，不用去读取
        const existFile = state.file
        if (existFile.filename && existFile.filename === file.filename) {

            // 显示弹出框
            commit(setEditModalVisible, { visible: true })
            commit(FILE, { ...existFile })
            return Promise.resolve(existFile)
        }

        const types = state.type
        const filenames = [...types, file.filename]
        const filename = filenames[0]
        // const type = 'image'
        return Request.post('/cms/filexplorer/read', { appid, filename,type }).then(response => {
            const rest = response.data
            if (rest.success) {

                // 更新文件内容
                commit(FILE, { ...file, content: rest.data })

                // 显示弹出框
                commit(setEditModalVisible, { visible: true })

                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '读取文件出现异常'))
        })
    },
    writeFile({ commit, state }, { appid, file, content, type}) {
        const types = state.type
        const filenames = [...types, file.filename]
        const filename = filenames[0]
        return Request.post('/cms/filexplorer/write', { appid, filename, content, type }).then(response => {
            const rest = response.data
            if (rest.success) {
                const currentFile = { ...file, ...rest.data, content,type }
                // 更新文件
                commit(FILE, currentFile)

                // 更新文件资源管理器
                commit(ADD_EXPLORER, { appid, files: [file] })

                // 更新文件列表中的文件信息
                const currentFiles = [...state.files]
                currentFiles.some((_file, index) => {
                    // 避免直接操作state
                    const _t = { ..._file }
                    if (_file.filename === currentFile.filename) {
                        Object.assign(_t, currentFile)
                        currentFiles.splice(index, 1, _t)
                        return true
                    }
                    return false
                })
                commit(FILES, { files: currentFiles })

                // 弹出框隐藏
                commit(setEditModalVisible, { visible: false })

                // 重置APPID
                commit(setAppId, '')
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '读取文件出现异常'))
        })
    },
    uploadFile({ commit }, { appid, type = [], file, module, flag = '' }) {
        const formData = new FormData()
        formData.append('appid', appid)
        formData.append('type', type )
        formData.append('file', file)
        // 默认为空，0 表示重命名 1 表示覆盖
        formData.append('flag', flag)
        formData.append('module', module)

        return Request.post('/cms/filexplorer/upload', formData).then(response => {
            const rest = response.data
            if (rest.success) {
                // 考虑后续会有多文件上传问题，所以rest.data 是文件列表
                // 更新文件列表 新文件放在前面
                const _currentFiles = [...rest.data, ...state.files]
                // 去重
                commit(FILES, { files: _currentFiles })
                // 更新资源管理器
                // 更新文件资源管理器
                commit(ADD_EXPLORER, { appid, files: _currentFiles })

                return Promise.resolve({ success: true, message: '上传成功' })
            }
            if (Number(rest.code) === fileRepeatCode) {
                return Promise.resolve({ success: false, code: rest.code, message: '文件出现重复，待用户确认' })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '文件上传失败'))
        })
    },
    downloadFile({ commit }, { appid, type, filename }) {
        return Request.post('/cms/filexplorer/download', { appid, type, filename }, { responseType: 'blob' }).then(response => {
            // 下载文件
            downloadByBlob(response.data, { filename })
            return Promise.resolve('正在下载...')
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    wxCopy({ commit }, reqData) {
        return Request.post("/cms/attach/robot/get", reqData)
            .then(res => {
                return Promise.resolve(res.data);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

}

export default {
    state,
    getters,
    mutations,
    actions
}
