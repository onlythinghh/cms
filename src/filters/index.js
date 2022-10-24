import Vue from 'vue'

// require.context(dir='./', useSubdirectories = false , regExp=/\.js$/)
// /^(.(?!(index|error-log)\.js$))+\.(js|vue)$/ will match any js and vue exclude index.js
const context = require.context('./', true, /^(.(?!index\.js$))+\.js$/)
context.keys().forEach(componentFilePath => {
    const component = context(componentFilePath)
    const moduleName = componentFilePath.replace(/^\S+\/(\w+)\.js$/, '$1')
    Object.keys(component).forEach(filterKey => {
        const filterFn = component[filterKey]
        const filterName = filterKey === 'default' ? filterFn.name : filterKey
        if (typeof filterFn !== 'function') {
            throw new Error(`filters/${moduleName}.${filterName} need function, but found ${typeof filterFn}`)
        }
        Vue.filter(filterName, filterFn)
    })
})
