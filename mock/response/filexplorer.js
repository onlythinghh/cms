import pathToRegexp from 'path-to-regexp'
import mime from 'mime'
import ResponseBody from '../responseBody'
import fs from 'fs'
import path from 'path'
const cwd = process.cwd()
const contextPath = path.resolve(cwd)

const readFiles = (filePath) => {
    const results = []
    const files = fs.readdirSync(filePath)
    files.forEach(file => {
        const _filePath = path.join(filePath, file)
        const _file = readFileStats(_filePath)
        results.push(_file)
    })
    return results
}
const sortFiles = (files = []) => {
    files.sort((prev, next) => {
        const prevFilename = prev.filename
        const nextFilename = next.filename
        if ((prev.isDirectory && next.isDirectory)) {
            return prevFilename.localeCompare(nextFilename)
        }
        if (!prev.isDirectory && !next.isDirectory) {
            if ((prevFilename.startsWith('.') && nextFilename.startsWith('.')) || (!prevFilename.startsWith('.') && !nextFilename.startsWith('.'))) {
                return prevFilename.localeCompare(nextFilename)
            }
            if (prevFilename.startsWith('.')) {
                return 1
            } else {
                return -1
            }
        }
        if (prev.isDirectory) {
            return -1
        }
        return 1
    })
}
const readFileData = (filename) => {
    const content = fs.readFileSync(path.resolve(contextPath, filename), { encoding: 'utf-8' })
    return content
}

const readFileStats = (filepath) => {
    const stats = fs.statSync(filepath)
    const _file = {
        isDirectory: stats.isDirectory(),
        size: stats.size,
        ext: null,
        lastModified: +new Date(stats.mtimeMs),
        filename: path.basename(filepath)
    }
    if (!_file.isDirectory) {
        const extname = path.extname(_file.filename)
        const ext = extname.substr(1)
        _file.ext = ext
    }
    return _file
}

const writeFile = (filename, content) => {
    const filepath = path.join(contextPath, filename)
    fs.writeFileSync(filepath, content, { encoding: 'utf-8' })
}
const getNextFilename = (filename, nextSubfix = 1) => {
    if (fs.existsSync(filename)) {
        const extname = path.extname(filename)
        if (/^\.\d+$/.test(extname)) {
            const ext = extname.substr(1)
            const fileParse = path.parse(filename)
            filename = path.join(fileParse.dir, fileParse.name + '.' + (parseInt(ext) + 1))
        } else {
            filename = filename + '.1'
        }
        return getNextFilename(filename)
    }
    return filename
}
const uploadFile = (source, targetFile) => {
    fs.writeFileSync(targetFile, fs.readFileSync(source))
}
export default [
    {
        url: '/cms/filexplorer/list',
        type: 'post',
        response: req => {
            const paths = (req.body.paths || '').split(',').join('/')
            const response = new ResponseBody()
            const files = readFiles(path.join(contextPath, paths))
            sortFiles(files)
            response.setData(files)
            return response.response(req)
        }
    },
    {
        url: '/cms/filexplorer/read',
        type: 'post',
        response: req => {
            const appid = req.body.appid
            const filename = req.body.filename
            console.log(`文件appid: ${appid}, filename:${filename} 读取成功`)
            const data = readFileData(filename)
            const response = new ResponseBody()
            response.setData(data)
            return response.response(req)
        }
    },
    {
        url: '/cms/filexplorer/write',
        type: 'post',
        multipart: true,
        response: req => {
            const appid = req.body.appid
            const filename = req.body.filename
            const content = req.body.content
            console.log(`写入文件 appid: ${appid}, filename ${filename} `)
            let file = null
            const response = new ResponseBody()

            if (pathToRegexp('(/?)test/(.*)').test(filename)) {
                writeFile(filename, content)
                file = readFileStats(path.join(contextPath, filename))
                response.setData(file)
            } else {
                response.setSuccess(false)
                response.setCode(403)
                response.setErrMsg('当前目录没有权限写入')
            }
            return response.response(req)
        }
    },
    {
        url: '/cms/filexplorer/download',
        type: 'post',
        response: (req, res) => {
            // let writeStream = fs.createWriteStream(realPath);
            // let bom = new Buffer('\xEF\xBB\xBF', 'binary');
            // writeStream.write(bom);
            // writeStream.write('hello');
            // writeStream.write('继续测试');
            // writeStream.end('中文');
            // console.log(req.headers)
            const appid = req.body.appid
            const filename = req.body.filename
            console.log(`下载文件 appid: ${appid}, filename ${filename} `)

            const filepath = path.join(contextPath, filename)
            const _filename = path.basename(filepath)
            const mimetype = mime.getType(filepath)
            console.log(_filename, mimetype)
            res.setHeader('Content-disposition', 'attachment; filename=' + _filename)
            res.setHeader('Content-type', mimetype)
            const stream = fs.createReadStream(filepath)
            stream.pipe(res)
            /*  const fileData = []
             if (stream) {
                 stream.on('data', function (chunk) {
                     fileData.push(chunk)
                 })
                 stream.on('end', function () {
                     console.log('下载完成...')
                     const results = Buffer.concat(fileData);
                     res.write(results);
                     res.end()
                 })
             } */
            // return filepath
        }
    }, {
        url: '/cms/filexplorer/upload',
        type: 'post',
        multipart: true,
        response: req => {
            const file = req.file

            const response = new ResponseBody()


            const { originalname, path: source } = file
            const { appid, paths, flag } = req.body
            console.log(`上传文件 appid: ${appid}, filename: ${originalname} `)

            const prefix = [paths, originalname].join('/')

            if (!pathToRegexp('(/?)test/(.*)').test(prefix)) {
                response.setSuccess(false)
                response.setErrMsg('当前目录没有权限操作,请选择 test 目录')
                return response.response(req)
            }

            let filepath = path.join(contextPath, paths, originalname)

            if (fs.existsSync(filepath)) {
                // flag 默认为空，0 表示重命名 1 表示覆盖
                if (flag !== '' && Number(flag) !== 0 && Number(flag) !== 1) {
                    response.setSuccess(false)
                    response.setErrMsg('flag 参数有误')
                    return response.response(req)
                }
                if (flag === '') {
                    response.setCode(80000)
                    response.setErrMsg('文件已存在')
                    response.setSuccess(false)
                    return response.response(req)

                }

                if (Number(flag) === 0) {
                    // 默认为空，0 表示重命名 1 表示覆盖
                    filepath = getNextFilename(filepath, 1)
                }
            }
            console.log('目标文件', filepath)
            // 上传文件
            uploadFile(source, filepath)
            const _file = readFileStats(filepath)
            response.setData([_file])
            return response.response(req)
        }
    }
]
