////
// Basic eslint config. Can be overwritten (or extended)  by eslint configs in src/ subfolders
////

// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    extends: 'airbnb-base',

    ////
    // add your custom rules here
    ////

    rules: {
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        indent: ['error', 4, { 'SwitchCase': 1 }],
        'func-names': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'error', //'off',
        'comma-dangle': ['error', 'only-multiline'],
        'no-restricted-syntax': [
            'error',
            //'ForInStatement',
            //'ForOfStatement',
            'LabeledStatement',
            'WithStatement',
        ],
        'spaced-comment': 'off',
        'padded-blocks': 'off',
        'arrow-body-style': 'off', //stupid rule
        'prefer-template': 'off', //stupid rule
        'no-continue': 'off',
        'object-shorthand': 'off',
        'no-param-reassign': 'off',
        'max-len': 'off'
    }
}
