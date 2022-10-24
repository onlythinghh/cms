import Vue from 'vue'
import { resolveComponentName } from '../utils/ComponentUtil'
// require.context(dir='./', useSubdirectories = false , regExp=/\.js$/)
// /^(.(?!(index|error-log)\.js$))+\.(js|vue)$/ will match any js and vue exclude index.js
const context = require.context('./', true, /^(.(?!index\.js$))+\.(js|vue)$/)
context.keys().forEach(componentFilePath => {
    const component = context(componentFilePath)
    const componentName = resolveComponentName(component, componentFilePath)
    Vue.directive(componentName, component.default || component)
})
