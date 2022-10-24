
const isRequired = parameter => new Error(`"${parameter}" is required.`)

const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
                xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
                xmlns:flowable="http://flowable.org/bpmn"
                typeLanguage="http://www.w3.org/2001/XMLSchema"
                expressionLanguage="http://www.w3.org/1999/XPath"
                targetNamespace="cms.hzinfor.com"
                id="Definitions_1">
    <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1"/>
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>
        </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn:definitions>`

const state = {
    definitions: {}
}
const getters = {
    diagram(state) {
        return (id, isViewer = false) => {
            return state.definitions[id] || { xml: isViewer ? '' : initialDiagram, activeIds: [], runningIds: [] }
        }
    }
}
const mutations = {
    setProcess(state, { id, ...info }) {
        state.definitions[id] = { ...info }
    }
}
const actions = {
    setProcess({ commit }, { id = isRequired('id'), xml = initialDiagram, activeIds = [], runningIds = [] } = {}) {
        commit('setProcess', { id, xml, activeIds, runningIds })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
