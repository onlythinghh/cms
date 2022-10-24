import { uuid } from '../util'
export default () => {
    const processId = `Process_${uuid(8, 10)}`
    const startEventId = `StartEvent_${uuid(8, 10)}`
    return (
        `<?xml version="1.0" encoding="UTF-8"?>
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
    <bpmn:process id="${processId}" isExecutable="true">
    <bpmn:startEvent id="${startEventId}"/>
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
        <bpmndi:BPMNShape id="_BPMNShape_${startEventId}" bpmnElement="${startEventId}">
        <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>
        </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn:definitions>`
    )
}
