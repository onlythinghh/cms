const chalk = require('chalk')

const path = require('path')
const webpack = require('webpack')
function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = 'hz vue admin v1.0'
const port = 3001
module.exports = {
    publicPath: '/admin',
    lintOnSave: true,
    productionSourceMap: false,
    outputDir: process.env.VUE_APP_OUTPUTDIR,
    devServer: {
        port: port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            // change api/login => mock/login
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_REQUEST_BASE_API]: {
                target: process.env.VUE_APP_LOCAL_MOCK === 'true' ? `http://localhost:${port}/mock` : process.env.VUE_APP_PROXY_TARGET,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_REQUEST_BASE_API]: process.env.VUE_APP_LOCAL_MOCK === 'true' ? '' : process.env.VUE_APP_REQUEST_BASE_API
                },
                onProxyReq: function (proxyReq) {
                    console.info(chalk.bgBlue('Proxy Web Request'), chalk.green(proxyReq.path))
                }
            },
            [process.env.VUE_APP_REQUEST_BASE_API_PREVIEW]: {
                target: process.env.VUE_APP_LOCAL_MOCK === 'true' ? `http://localhost:${port}/mock` : process.env.VUE_APP_PROXY_TARGET,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_REQUEST_BASE_API_PREVIEW]: process.env.VUE_APP_LOCAL_MOCK === 'true' ? '' : process.env.VUE_APP_REQUEST_BASE_API_PREVIEW
                },
                onProxyReq: function (proxyReq) {
                    console.info(chalk.bgBlue('Proxy Web Request'), chalk.green(proxyReq.path))
                }
            },
            [process.env.VUE_APP_REQUEST_BASE_API_HTML]: {
                target: process.env.VUE_APP_LOCAL_MOCK === 'true' ? `http://localhost:${port}/mock` : process.env.VUE_APP_PROXY_TARGET,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_REQUEST_BASE_API_HTML]: process.env.VUE_APP_LOCAL_MOCK === 'true' ? '' : process.env.VUE_APP_REQUEST_BASE_API_HTML
                },
                onProxyReq: function (proxyReq) {
                    console.info(chalk.bgBlue('Proxy Web Request'), chalk.green(proxyReq.path))
                }
            },
        },
        // local mock services
        after: process.env.VUE_APP_LOCAL_MOCK === 'true' ? require('./mock/server.js') : () => { }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/assets/css/variables.scss";'
            }
        }
    },
    chainWebpack: (config) => {
        process.env.NODE_ENV !== 'production' &&
        config.module
            .rule('eslint')
            .use('eslint-loader')
            .tap(options => Object.assign(options, { fix: false }))
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 10240 }))

        config.module.rule('js').parser({
            requireContext: true
        })
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')

        // 移除 preload 插件
        config.plugins.delete('preload')

        config.plugin('context-replace').use(webpack.ContextReplacementPlugin, [/moment[\/\\]locale$/, /zh-cn/])
        config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/])
    },
}
