import Vue from 'vue'

// require.context(dir='./', useSubdirectories = false , regExp=/\.js$/)
// /^(.(?!(index|error-log)\.js$))+\.(js|vue)$/ will match any js and vue exclude index.js
const context = require.context('./', true, /^(.(?!index\.js$))+\.(js|vue)$/)
context.keys().forEach(componentFilePath => {
    const plugin = context(componentFilePath)
    Vue.use(plugin.default || plugin)
})

