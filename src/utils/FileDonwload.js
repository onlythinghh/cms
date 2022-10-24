import axios from "axios";
import JSZip from "jszip";
import FileSaver from "file-saver";


const getFile = url => {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url,
            responseType: "blob"
        }).then(data => {
            resolve(data.data);
        }).catch(error => {
            reject(error.toString());
        });
    });
};
/**
 * 打包下载文件 图片 视频 文档等
 * @param {Array} data 要下载的链接
 * @returns promise
 */
const downLoadFile = (data = []) => {
    const zip = new JSZip();
    const cache = {};
    const promises = [];
    data.forEach(item => {
        const promise = getFile(item).then(data => {
            // 下载文件, 并存成ArrayBuffer对象
            const arr_name = item.split("/");
            const file_name = arr_name[arr_name.length - 1]; // 获取文件名
            zip.file(file_name, data, { binary: true }); // 逐个添加文件
            cache[file_name] = data;
        });
        promises.push(promise);
    });
    let Download = new Promise((resolve, reject) => {
        Promise.all(promises).then(() => {
            zip.generateAsync({ type: "blob" }).then(content => {
                // 生成二进制流
                FileSaver.saveAs(content, "RobotInformation.zip"); // 利用file-saver保存文件  自定义文件名
                resolve('success')
            })
        }).catch(err => {
            reject(err)
        })
    })
    return Download
}

export {
    downLoadFile
}