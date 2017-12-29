// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    extends: 'airbnb-base',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: 'build/webpack.base.conf.js'
            }
        }
    },
    // add your custom rules here
    rules: {
        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            js: 'never',
            vue: 'never'
        }],
        // disallow reassignment of function parameters
        // disallow parameter object manipulation except for specific exclusions
        'no-param-reassign': ['error', {
            props: true,
            ignorePropertyModificationsFor: [
                'state', // for vuex state
                'acc', // for reduce accumulators
                'e' // for e.returnvalue
            ]
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            optionalDependencies: ['test/unit/index.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        ////
        // personal
        ////

        'indent': ['error', 4, {
            'SwitchCase': 1
        }],
        'comma-dangle': ['error', 'only-multiline'],
        'spaced-comment': 'off',
        'padded-blocks': 'off',
        'arrow-body-style': 'off', //stupid rule
        'prefer-template': 'off', //stupid rule
        'no-continue': 'off',
        'object-shorthand': 'off',
        'no-param-reassign': 'off',
        'max-len': 'off',
        'func-names': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off', //,'error'
    }
}
