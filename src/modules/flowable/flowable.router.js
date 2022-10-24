import ProcessDefinitions from './process/definitions'
import ProcessDeployments from './process/deployment'
import ProcessInstances from './process/instances'
import ProcessTasks from './process/tasks'
import WorkTasks from './work/tasks'
import WorkProcesses from './work/processes'
import WorkProcessesList from './work/processes/list'
import WorkProcessesStartup from './work/processes/startup'

import FormDeployments from './forms/deployment'
import FormDefinitions from './forms/definitions'
import FormInstances from './forms/instances'
import FormEditor from './forms/editor'

import { Modeler, Viewer } from './modeler'

const FlowableComponent = {
    render() {
        return <router-view />
    }
}

export default {
    path: '/flowable',
    name: 'Flowable',
    component: FlowableComponent,
    children: [
        {
            path: 'modeler',
            name: 'Modeler',
            component: Modeler,
        },
        {
            path: 'viewer',
            name: 'Viewer',
            component: Viewer,
        },
        {
            path: 'process/deployments',
            name: 'ProcessDeployments',
            meta: { title: '部署对象' },
            component: ProcessDeployments
        },
        {
            path: 'process/process-definitions',
            name: 'FlowableProcess',
            meta: { title: '定义' },
            component: ProcessDefinitions
        },
        {
            path: "process/process-instances",
            name: 'ProcessInstances',
            meta: { title: '实例' },
            component: ProcessInstances
        },
        {
            path: "process/process-tasks",
            name: 'ProcessTasks',
            meta: { title: '任务' },
            component: ProcessTasks
        },
        {
            path: "work/tasks",
            name: 'WorkTasks',
            meta: { title: '任务' },
            component: WorkTasks
        },
        {
            path: "work/processes",
            // name: 'WorkProcesses',
            meta: { title: '流程' },
            component: WorkProcesses,
            children: [
                {
                    path: '',
                    name: 'WorkProcess',
                    meta: { title: '流程' },
                    component: WorkProcessesList
                },
                {
                    path: 'startup',
                    name: 'WorkProcessStartup',
                    meta: { title: '启动流程' },
                    component: WorkProcessesStartup
                },
            ]
        },
        {
            path: 'form/deployments',
            name: 'FormDeployments',
            meta: { title: '表单部署对象' },
            component: FormDeployments,
        },
        {
            path: 'form/definitions',
            name: 'FormDefinitions',
            meta: { title: '表单定义' },
            component: FormDefinitions,
        },
        {
            path: 'form/instances',
            name: 'FormInstances',
            meta: { title: '表单实例' },
            component: FormInstances,
        },
        {
            path: 'form/editor',
            name: 'FormEditor',
            meta: { title: '表单编辑器' },
            component: FormEditor,
        },
    ]
}
