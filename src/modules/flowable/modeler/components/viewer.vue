<template>
    <div ref="bpmnContainerRef" class="bpmn-container bpmn-diagram">
        <div ref="bpmnViewerRef" class="bpmn-canvas"></div>
    </div>
</template>
<script>
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import modelingModule from 'bpmn-js/lib/features/modeling'

export default {
    props: {
        xml: {
            type: String,
            default: ''
        },
        completedIds: {
            type: Array,
            default: () => []
        },
        runningIds: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            viewer: null
        }
    },
    watch: {
        xml() {
            this.render()
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.render()
        })
    },
    methods: {
        render() {


            if (!this.viewer) {
                /* this.viewer.destroy()
                this.viewer = null */
                this.viewer = new NavigatedViewer({
                    container: this.$refs.bpmnViewerRef,
                    additionalModules: [
                        modelingModule
                    ],
                })
            }
            const viewer = this.viewer
            const { xml, completedIds, runningIds } = this.$props
            if (!xml) {
                viewer.clear()
                return
            }

            viewer.importXML(xml, function (err) {
                if (err) {
                    console.error(err)
                    return;
                }
                const elementRegistry = viewer.get('elementRegistry')
                const modeling = viewer.get('modeling')
                if (completedIds && completedIds.length > 0) {
                    const activeElements = []
                    completedIds.forEach(id => activeElements.push(elementRegistry.get(id)))
                    if (activeElements.length > 0) {
                        modeling.setColor(activeElements, {
                            stroke: 'green',
                            // fill: 'rgba(0, 80, 0, 0.4)'
                        })
                    }
                }
                if (runningIds && runningIds.length > 0) {
                    const runningElements = []
                    runningIds.forEach(id => runningElements.push(elementRegistry.get(id)))
                    if (runningElements.length > 0) {
                        modeling.setColor(runningElements, {
                            stroke: 'red',
                            // fill: 'rgba(0, 80, 0, 0.4)'
                        })
                    }
                }
            })
        }
    }
}
</script>
