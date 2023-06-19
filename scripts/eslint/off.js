module.exports = {
    overrides: [
        {
            files: ['*'],
            rules: {
                // TODO: investigate / enable later
                // TODO: move to @tinkoff/eslint-config-angular
                '@typescript-eslint/prefer-readonly-parameter-types': 'off',
                '@typescript-eslint/strict-boolean-expressions': 'off',
                '@typescript-eslint/prefer-nullish-coalescing': 'off',
                '@typescript-eslint/no-unnecessary-condition': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-useless-constructor': 'off',
                'no-prototype-builtins': 'off',
                '@typescript-eslint/no-shadow': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/ban-ts-comment': 'off',
                'eslint-comments/no-unlimited-disable': 'off',
                'eslint-comments/disable-enable-pair': 'off',
                'rxjs/no-ignored-takewhile-value': 'off',
                'import/no-dynamic-require': 'off',
                'promise/catch-or-return': 'off',
                'prettier/prettier': 'off',
                'spaced-comment': 'off',
                'max-nested-callbacks': 'off',
                'import/no-deprecated': 'off',
                'import/no-cycle': 'off',
                'promise/no-nesting': 'off',
                'no-loop-func': 'off',
                'no-bitwise': 'off',
                quotes: 'off',
            },
        },
    ],
};
