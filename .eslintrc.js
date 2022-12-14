module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['error', 'warn'] }] : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['warn', 4],
        // 'vue/script-indent': ['error', 2, { baseIndent: 1 }],
        'vue/html-indent': 'off',
        'no-param-reassign': 'off',
        'max-len': ['error', 150, 4],
        semi: 'off',
        'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/html-self-closing': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/mustache-interpolation-spacing': 'off'
    }
};
