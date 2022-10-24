export default {
    path: "/theme",
    name: "Theme",
    meta: {
        title: "主题管理"
    },
    component: () => import("./index.vue")
};
