<template>
    <div ref="bpmnContainerRef" class="bpmn-container bpmn-diagram">
        <div v-if="errorMessage" class="io-alerts">
            <div class="io-control alert open">
                <a href class="error-close" @click.prevent="onCloseErrorMessage">×</a>
                {{errorMessage}}
            </div>
        </div>

        <!-- 工具条 -->
        <ToolBars
            :modeler="modeler"
            @save="onSave"
            @newDiagram="onNewDiagram"
            @showErrorMessage="showErrorMessage"
        />
        <!-- 工具条 -->

        <!-- 画图 -->
        <div ref="bpmnCanvasRef" class="bpmn-canvas"></div>
        <!-- 画图 -->

        <!-- 属性面板 -->
        <div id="js-properties-panel" ref="bpmnPropertiesPanelRef" class="bpmn-properties-panel"></div>
        <!-- 属性面板 -->
    </div>
</template>
<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { moddleExtensions, additionalModules, emptyDiagram } from '../lib'
import ToolBars from './toolbars'

export default {
    components: {
        ToolBars
    },
    props: {
        diagram: {
            type: String,
            default: emptyDiagram()
        },
        save: {
            type: Function,
            default: () => { }
        },
        candidateUsers: {
            type: Array,
            default: () => []
        },
        candidateGroups: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            modeler: null,
            errorMessage: null
        }
    },
    watch: {
        diagram(diagram) {
            this.createNewDiagram(diagram || emptyDiagram())
        }
    },
    mounted() {
        this.$nextTick(() => {
            const _this = this
            const bpmnCanvas = this.$refs.bpmnCanvasRef
            this.modeler = new BpmnModeler({
                container: bpmnCanvas,
                // 添加控制板
                propertiesPanel: {
                    parent: '#js-properties-panel',
                    loadCandidateGroups() {
                        const candidateGroups = [..._this.$props.candidateGroups || []]
                        candidateGroups.splice(0, 0, { value: '', name: '请选择' })
                        return candidateGroups
                    },
                    loadCandidateUsers() {
                        const candidateUsers = [..._this.$props.candidateUsers || []]
                        candidateUsers.splice(0, 0, { value: '', name: '请选择' })
                        return candidateUsers
                    }
                },
                additionalModules: additionalModules,
                moddleExtensions,
            })
            this.createNewDiagram(this.$props.diagram)
        })
    },
    methods: {
        createNewDiagram(diagram) {
            this.modeler.importXML(diagram, function (err) {
                if (err) {
                    console.error(err)
                }
            })
        },
        onSave() {
            const _this = this
            this.modeler.saveXML((err, xml) => {
                if (err) {
                    this.showErrorMessage(err.message)
                    return
                }
                _this.$emit('save', xml)
            });
        },
        showErrorMessage(errorMessage) {
            this.errorMessage = errorMessage
        },
        onCloseErrorMessage() {
            this.errorMessage = null
        },
        onNewDiagram(diagram) {
            this.createNewDiagram(diagram)
        }
    }
}
</script>
