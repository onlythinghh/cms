import translateModule from './i18n'
import modelingModule from 'bpmn-js/lib/features/modeling'
import propertiesPanel from 'bpmn-js-properties-panel'
// import flowableProvider from 'jp-bpmn-js-properties-panel/lib/provider/flowable'
import flowableProvider from './flowable/properties-panel/lib/provider/flowable'


export default [
    translateModule,
    modelingModule,
    propertiesPanel,
    flowableProvider
]
