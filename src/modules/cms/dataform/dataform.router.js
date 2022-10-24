export default [
    {
        path: "/dataform",
        name: "dataform",
        meta: {
            title: "留资表单"
        },
        component: () => import("./index.vue")
    },
    {
        path: "/dataform/detail",
        name: "detail",
        meta: {
            title: "详情"
        },
        component: () => import("./detail/detail.vue")
    }
];