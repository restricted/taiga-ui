const all = require('./configs/all.json');

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
    configs: {
        all,
    },
    rules: {
        'injection-token-description': require('./rules/injection-token-description'),
        'no-deep-imports': require('./rules/no-deep-imports'),
        'prefer-inject-decorator': require('./rules/prefer-inject-decorator'),
        'prefer-self-destroy-service': require('./rules/prefer-self-destroy-service'),
        'no-typeof': require('./rules/no-typeof'),
        'strict-tui-doc-example': require('./rules/strict-tui-doc-example'),
        'no-assert-without-ng-dev-mode': require('./rules/no-assert-without-ng-dev-mode'),
    },
};
