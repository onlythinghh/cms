const chokidar = require('chokidar')
const chalk = require('chalk')
const path = require('path')
const multer = require('multer')
const os = require('os')
const express = require('express')

const upload = multer({ dest: os.tmpdir() })

const mockDir = path.join(process.cwd(), 'mock')

function registerMockRoutes(app) {
    let mockLastIndex
    const { default: mocks } = require('./index.js')
    for (const mock of mocks) {
        const multipart = mock.multipart
        if (multipart === true) {
            // one file upload
            app[mock.type](mock.url, upload.single('file'), mock.response)
        } else if (Number(multipart) && Number(multipart) > 0) {
            // mulit fileF
            app[mock.type](mock.url, upload.array('file'), mock.response)
        } else {
            app[mock.type](mock.url, mock.response)
        }
        mockLastIndex = app._router.stack.length
    }
    const mockRoutesLength = Object.keys(mocks).length
    return {
        mockRoutesLength: mockRoutesLength,
        mockStartIndex: mockLastIndex - mockRoutesLength
    }
}

function unregisterMockRoutes() {
    Object.keys(require.cache).forEach(i => {
        if (i.includes(mockDir)) {
            delete require.cache[require.resolve(i)]
        }
    })
}

module.exports = app => {

    // es6 polyfill
    require('@babel/register')


    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    const mockRoutes = registerMockRoutes(app)
    let mockRoutesLength = mockRoutes.mockRoutesLength
    let mockStartIndex = mockRoutes.mockStartIndex

    // watch files, hot reload mock server
    chokidar.watch(mockDir, {
        // ignored: /server/,
        ignoreInitial: true
    }).on('all', (event, path) => {
        if (event === 'change' || event === 'add') {
            try {
                // remove mock routes stack
                app._router.stack.splice(mockStartIndex, mockRoutesLength)

                // clear routes cache
                unregisterMockRoutes()

                const mockRoutes = registerMockRoutes(app)
                mockRoutesLength = mockRoutes.mockRoutesLength
                mockStartIndex = mockRoutes.mockStartIndex

                console.log(chalk.magentaBright(` > Mock Server hot reload success! changed  ${path}`))
            } catch (error) {
                console.log(chalk.redBright(error))
            }
        }
    })
}
