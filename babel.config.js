module.exports = {
    presets: [
        ['@vue/app', {
            modules: 'cjs' // 解决浏览器 报错 Cannot assign to read only property 'exports' of object '#<Object>'
        } /* , {
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    } */],
    ],
    plugins: [
        [
            "babel-plugin-component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 转换ES2018 正则Unicode属性类
        ["@babel/plugin-proposal-unicode-property-regex"]
    ]
};
