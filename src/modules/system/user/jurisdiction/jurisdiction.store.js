
import Request from "../../../../request"
// 全站点
const siteAllOptions = [
    { value: "ALL_APP_ADD", name: "新增" },
    { value: "ALL_APP_RECYCLE", name: "回收站" }
];
// 站点
const siteOptions = [
    { value: "APP_VIEW", name: "查看" },
    { value: "APP_UPDATE", name: "修改" },
    { value: "APP_DELETE", name: "删除" },
    { value: "APP_CLONE", name: "复制" },
    { value: "APP_PREVIEW", name: "预览" },
    { value: "APP_PUBLISH", name: "发布" },
    { value: "APP_FILE", name: "资源管理"}
];
// 模板
const templateOptions = [
    { value: "TPL_VIEW", name: "查看" },
    { value: "TPL_UPDATE", name: "修改" },
    { value: "TPL_DELETE", name: "删除" },
    { value: "TPL_IMPORT", name: "导入" },
    { value: "TPL_EXPORT", name: "导出" },
    { value: "TPL_ADD", name: "新增" }
];
// 全频道
const channelAllOptions = [
    { value: "ALL_CHANNEL_ADD", name: "新增" },
    { value: "ALL_CHANNEL_RECYCLE", name: "回收站" }
];
// 频道
const channelOptions = [
    { value: "CHANNEL_VIEW", name: "查看" },
    { value: "CHANNEL_UPDATE", name: "修改" },
    { value: "CHANNEL_DELETE", name: "删除" },
    { value: "CHANNEL_MOVE", name: "移动" },
    { value: "CHANNEL_CLONE", name: "复制" },
    { value: "CHANNEL_PREVIEW", name: "预览" },
    { value: "CHANNEL_PUBLISH", name: "发布" }
];
// 全内容
const contentAllOptions = [
    { value: "ALL_INFO_ADD", name: "新增" },
    { value: "ALL_INFO_RECYCLE", name: "回收站" }
];
// 内容
const contentOptions = [
    { value: "INFO_VIEW", name: "查看" },
    { value: "INFO_UPDATE", name: "修改" },
    { value: "INFO_DELETE", name: "删除" },
    { value: "INFO_CLONE", name: "复制" },
    { value: "INFO_MOVE", name: "移动" },
    { value: "INFO_SHARE", name: "共享" },
    { value: "INFO_GLOBAL_SHARE", name: "跨站共享" },
    { value: "INFO_PREVIEW", name: "预览" },
    { value: "INFO_PUBLISH", name: "直接发布" },
    { value: "INFO_CHECK_PUBLISH", name: "审核发布" },
    { value: "INFO_REVOKE", name: "撤稿" },
    { value: "INFO_SORT", name: "自定义排序" }
];
// 效果
const effectOptions = [
    { value: "FEATURE_APP_EXTEND", name: "子站继承父站" },
    { value: "FEATURE_CHANNEL_EXTEND", name: "子频道继承父频道" }
];
// 全站点数据
function __SITEALL(){
    var val = [];
    siteAllOptions.forEach(ele => {
        val.push(ele.value);
    });
    return val
}
// 站点数据
function __IDALL(){
    var val = [];
    siteOptions.forEach(ele => {
        val.push(ele.value);
    });
    templateOptions.forEach(ele => {
        val.push(ele.value);
    });
    channelAllOptions.forEach(ele => {
        val.push(ele.value);
    });
    return val
}
// 频道数据
function __CHANNELALL(){
    var val = [];
    contentAllOptions.forEach(ele => {
        val.push(ele.value);
    });
    channelOptions.forEach(ele => {
        val.push(ele.value);
    });
    return val
}
// 内容数据
function __CONTENTALL(){
    var val = [];
    contentOptions.forEach(ele => {
        val.push(ele.value);
    });
    return val
}

const jurisdiction = {
    state:{
        Options:{
            op_siteAll: siteAllOptions,
            op_site: siteOptions,
            op_template: templateOptions,
            op_channelAll: channelAllOptions,
            op_channel: channelOptions,
            op_contentAll: contentAllOptions,
            op_content: contentOptions,
            op_effect: effectOptions
        },
        st_IDALL:__IDALL(),
        st_SITEALL:__SITEALL(),
        st_CHANNELALL:__CHANNELALL(),
        st_CONTENTALL:__CONTENTALL(),
    },
    actions:{
        // 获取数据
        getOrg({ commit }, reqData) {
            return Request.post("/cms/data/permission/org/get", reqData)
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
        // 保存
        saveOrg({ commit }, reqData) {
            return Request.post("/cms/data/permission/org/save", reqData,{
                headers: {
                    "Content-Type": "application/json;utf-8"
                }
            })
                .then(res => {
                    return Promise.resolve(res.data);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        },
    }



}


export default jurisdiction