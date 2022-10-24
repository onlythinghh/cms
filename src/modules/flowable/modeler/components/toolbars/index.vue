<template>
    <div v-if="hasFileReader" class="io-toolbars">
        <div class="io-import-export">
            <ul class="io-import io-control io-control-list io-horizontal">
                <li class="io-import-load-bpmn">
                    <button title="打开" @click="onSelectFile">
                        <input
                            ref="fileRef"
                            class="open-file"
                            type="file"
                            @click.stop
                            @change.stop="onOpenFile"
                        />
                        <span class="icon-folder-open" @click.stop="onSelectFile"></span>
                    </button>
                </li>
                <li v-if="canSave">
                    <a ref="saveRef" target="_blank" title="保存" @click="onSave">
                        <span class="icon-floppy-disk"></span>
                    </a>
                </li>
                <li class="line">
                    <button title="新建" @click="onNewDiagram()">
                        <span class="icon-plus"></span>
                    </button>
                </li>
                <li>
                    <button title="撤销" @click="onUndo">
                        <span class="icon-undo2"></span>
                    </button>
                </li>
                <li class="line">
                    <button title="恢复" @click="onRedo">
                        <span class="icon-redo2"></span>
                    </button>
                </li>
                <li>
                    <button title="重置" @click="onZoomReset">
                        <span class="icon-search"></span>
                    </button>
                </li>
                <li>
                    <button title="放大" @click="onZoomIn">
                        <span class="icon-zoom-in"></span>
                    </button>
                </li>
                <li class="line">
                    <button title="缩小" @click="onZoomOut">
                        <span class="icon-zoom-out"></span>
                    </button>
                </li>

                <li>
                    <a target="_blank" class="download" title="下载XML" @click="onDownloadXML">
                        <span class="icon-box-add"></span>
                    </a>
                </li>
                <li>
                    <a target="_blank" class="download" title="下载SVG" @click="onDownloadSVG">
                        <span class="icon-image"></span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import './style.less'
import { emptyDiagram } from '../../lib'

export default {
    props: {
        modeler: {
            type: Object,
            default: null
        },
        save: {
            type: Function,
            default: null
        },
        showErrorMessage: {
            type: Function,
            default: () => { }
        },
        newDiagram: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            scale: 1 // 缩放比例
        }
    },
    computed: {
        hasModeler() {
            return !!this.$props.modeler
        },
        canSave() {
            return !!this.$listeners.save
        },
        hasFileReader() {
            return !!window['FileReader']
        },
        command() {
            if (this.hasModeler) {
                return this.modeler.get('commandStack')
            }
            return null
        }
    },
    watch: {

    },
    mounted() {

    },
    methods: {
        showMessage(errorMessage) {
            this.$emit('showErrorMessage', errorMessage ? errorMessage : null)
        },
        setEncoded(data) {
            this.showMessage()
            if (data) {
                this.download = true
                this.resource = data
            } else {
                this.download = false
                this.resource = null
            }
        },
        handleZoom(radio) {
            if (this.hasModeler) {
                const newScale = !radio ? 1.0 : (
                    // 最小缩放为0.2
                    radio < 0.2 ? 0.2 : (
                        // 最大为2
                        radio > 2 ? 2 : radio
                    )
                )
                this.modeler.get('canvas').zoom(newScale);
                this.scale = newScale
            }
        },
        onDownload(type, data, name) {
            this.showMessage()
            let ext = 'bpmn20.xml'
            if (type === 'svg') {
                ext = 'svg'
            }
            name = name || `Diagram.${ext}`
            const a = document.createElement('a')
            a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
            a.setAttribute('target', '_blank');
            a.setAttribute('dataTrack', `diagram:download-${ext}`);
            a.setAttribute('download', name);
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        },
        onSelectFile(e) {
            this.showMessage()
            if (this.$refs.fileRef.value) {
                this.$refs.fileRef.value = ''
            }
            this.$refs.fileRef.click()
        },
        onOpenFile(event) {
            const files = event.target.files || []
            const _this = this
            if (files && files.length > 0) {
                const file = files[0]
                if (file.name.lastIndexOf('bpmn20.xml') === -1 && file.name.lastIndexOf('bpmn') === -1) {
                    this.showMessage('仅支持.bpmn20.xml和.bpmn类型的文件。')
                    return
                }
                // 1mb 限制
                if (file.size > 1024 * 1024 * 2) {
                    this.showMessage('文件大小不能超过2MB。')
                    return
                }
                const reader = new FileReader()
                reader.readAsText(file, 'utf-8')
                reader.onload = function (fileEvent) {
                    const importDragram = fileEvent.target.result
                    _this.onNewDiagram(importDragram)
                }
            }
        },
        onSave() {
            this.canSave && this.$emit('save')
        },
        onZoomIn() {
            // 放大
            this.handleZoom(this.scale + 0.1)
        },
        onZoomOut() {
            // 缩小
            this.handleZoom(this.scale - 0.1)
        },
        onZoomReset() {
            // 重置
            this.handleZoom()
        },
        onUndo() {
            if (this.command && this.command.canUndo()) {
                this.command.undo()
            }
        },
        onRedo() {
            if (this.command && this.command.canRedo()) {
                this.command.redo()
            }
        },
        onDownloadXML(e) {
            const _this = this
            _this.modeler.saveXML({ format: true }, function (err, xml) {
                if (err) {
                    this.showMessage(err.message)
                    return
                }
                _this.onDownload('xml', xml)
            })
        },
        onDownloadSVG(e) {
            const _this = this
            this.modeler.saveSVG({ format: true }, function (err, svg) {
                if (err) {
                    this.showMessage(err.message)
                    return
                }
                _this.onDownload('svg', svg)
            })
        },
        onNewDiagram(diagram = emptyDiagram()) {
            this.$emit('newDiagram', diagram)
        },
    }
}
</script>
