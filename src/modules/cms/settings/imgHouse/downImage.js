import JSZip from 'jszip'
import FileSaver from "file-saver"

function downImages(imgArr, imgName,cb) {
    if(imgArr.length < 0) return false
    // this.$message.warning('')
    let blogTitle = '打包图片';
    let zip = new JSZip();
    let imgs = zip.folder(blogTitle);
    let baseList = [];
    // 要下载图片的url
    let arr = imgArr
    // 下载后图片的文件名，个数应与arr对应
    let imgNameList = imgName

    for (let i = 0; i < arr.length; i++) {
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute('crossOrigin', 'anonymous');
        
        image.onload = function () {
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            
            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height);
            
            let url = canvas.toDataURL(); // 得到图片的base64编码数据
            canvas.toDataURL('image/png');
            
            baseList.push(url.substring(22));    // 去掉base64编码前的 data:image/png;base64,
            if (baseList.length === arr.length && baseList.length > 0) {
                for (let k = 0; k < baseList.length; k++) {
                    imgs.file(imgNameList[k] + '.png', baseList[k], {base64: true})
                }
                zip.generateAsync({type: 'blob'}).then(function (content) {
                    // see FileSaver.js
                    FileSaver.saveAs(content, blogTitle + '.zip');
                });
            }

        };
        image.src = arr[i];
        return cb&&cb()
    }
}
export {
    downImages
}