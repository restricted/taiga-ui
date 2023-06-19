import {Node} from 'ng-morph';

import {TuiSchema} from '../../../ng-add/schema';
import {
    infoLog,
    REPLACE_SYMBOL,
    SMALL_TAB_SYMBOL,
    SUCCESS_SYMBOL,
    successLog,
} from '../../../utils/colored-log';
import {getNamedImportReferences} from '../../../utils/get-named-import-references';
import {removeImport} from '../../../utils/import-manipulations';
import {DEPRECATED_FUNCTIONS} from '../constants/deprecated-functions';

export function replaceFunctions(options: TuiSchema): void {
    !options[`skip-logs`] &&
        infoLog(`${SMALL_TAB_SYMBOL}${REPLACE_SYMBOL} functions replacing...`);

    replacePadStart(getNamedImportReferences(`padStart`, `@taiga-ui/cdk`));
    replaceFallbackValue(getNamedImportReferences(`fallbackValue`, `@taiga-ui/cdk`));
    replaceCustomEvent(getNamedImportReferences(`tuiCustomEvent`, `@taiga-ui/cdk`));
    replaceClosestElement(getNamedImportReferences(`getClosestElement`, `@taiga-ui/cdk`));
    replaceNativeFocused([
        ...getNamedImportReferences(`tuiSetNativeFocused`, `@taiga-ui/cdk`),
        ...getNamedImportReferences(`setNativeFocused`, `@taiga-ui/cdk`),
    ]);
    replaceDeprecatedFunction();
    modifyFormatNumberArgs();
    modifyClosestFocusable();

    !options[`skip-logs`] &&
        successLog(`${SMALL_TAB_SYMBOL}${SUCCESS_SYMBOL} functions replaced \n`);
}

function replaceDeprecatedFunction(): void {
    DEPRECATED_FUNCTIONS.forEach(({from, to, moduleSpecifier}) => {
        getNamedImportReferences(from, moduleSpecifier).forEach(ref => {
            if (ref.wasForgotten()) {
                return;
            }

            const parent = ref.getParent();

            if (Node.isImportSpecifier(parent) || Node.isCallExpression(parent)) {
                parent?.replaceWithText(
                    parent
                        ?.getText({includeJsDocComments: false})
                        .trim()
                        .replace(from, to ?? from),
                );
            }
        });
    });
}

function replacePadStart(references: Node[]): void {
    references.forEach(ref => {
        const parent = ref.getParent();

        if (Node.isImportSpecifier(parent)) {
            removeImport(parent);
        } else if (Node.isCallExpression(parent)) {
            const [targetString, length, pad] = parent.getArguments();

            parent.replaceWithText(
                `${targetString.getText()}.padStart(${length.getText()}, ${
                    pad?.getText() ?? `" "`
                })`,
            );
        }
    });
}

function replaceNativeFocused(references: Node[]): void {
    references.forEach(ref => {
        const parent = ref.getParent();

        if (Node.isImportSpecifier(parent)) {
            removeImport(parent);
        } else if (Node.isCallExpression(parent)) {
            const [targetString, focusedArg, preventScroll] = parent.getArguments();

            const setFocused = !focusedArg || focusedArg.getText() === `true`;

            const focus = `${targetString.getText()}.focus(${
                preventScroll?.getText() ? `{preventScroll: true}` : ``
            })`;
            const blur = `${targetString.getText()}.blur()`;

            parent.replaceWithText(setFocused ? focus : blur);
        }
    });
}

function replaceClosestElement(references: Node[]): void {
    references.forEach(ref => {
        const parent = ref.getParent();

        if (Node.isImportSpecifier(parent)) {
            removeImport(parent);
        } else if (Node.isCallExpression(parent)) {
            const [firstArg, secondArg] = parent.getArguments();
            const firstArgText = firstArg.getText();
            const element = firstArgText.includes(` as `) // e.g, `getClosestElement(el as Element, ...)`
                ? `(${firstArgText})`
                : firstArgText;

            parent.replaceWithText(`${element}.closest(${secondArg.getText()})`);
        }
    });
}

function replaceCustomEvent(references: Node[]): void {
    references.forEach(ref => {
        const parent = ref.getParent();

        if (Node.isImportSpecifier(parent)) {
            removeImport(parent);
        } else if (Node.isCallExpression(parent)) {
            const [firstArg, secondArg] = parent.getArguments();

            parent.replaceWithText(
                `new CustomEvent(${firstArg.getText()}, ${secondArg.getText()})`,
            );
        }
    });
}

function replaceFallbackValue(references: Node[]): void {
    references.forEach(ref => {
        const parent = ref.getParent();

        if (Node.isImportSpecifier(parent)) {
            removeImport(parent);
        } else if (Node.isCallExpression(parent)) {
            const [firstArg, secondArg] = parent.getArguments();

            parent.replaceWithText(`${firstArg.getText()} ?? ${secondArg.getText()}`);
        }
    });
}

function modifyFormatNumberArgs(): void {
    [
        ...getNamedImportReferences(`formatNumber`, `@taiga-ui/core`),
        ...getNamedImportReferences(`tuiFormatNumber`, `@taiga-ui/core`),
    ]
        .map(ref => ref.getParent())
        .filter(Node.isCallExpression)
        .forEach(fn => {
            const args = fn.getArguments();

            if (args.length > 1) {
                const [
                    value,
                    decimalLimit = `Infinity`,
                    decimalSeparator = `','`,
                    thousandSeparator = `'\u00A0'`,
                    zeroPadding = true,
                ] = args.map(arg => arg.getText());
                const notNullDecimalLimit =
                    decimalLimit === `null` ? `Infinity` : decimalLimit;
                const conditionalDecimalLimit = !Number.isNaN(Number(notNullDecimalLimit))
                    ? notNullDecimalLimit
                    : `${decimalLimit} === null ? Infinity : ${decimalLimit}`;

                fn.replaceWithText(
                    `tuiFormatNumber(${value}, {decimalLimit: ${conditionalDecimalLimit}, decimalSeparator: ${decimalSeparator}, thousandSeparator: ${thousandSeparator}, zeroPadding: ${zeroPadding}})`,
                );
            }
        });
}

function modifyClosestFocusable(): void {
    getNamedImportReferences(`tuiGetClosestFocusable`, `@taiga-ui/cdk`)
        .map(ref => ref.getParent())
        .filter(Node.isCallExpression)
        .forEach(fn => {
            const args = fn.getArguments();

            if (args.length > 1) {
                const [initial, prev = false, root, keyboard = true] = args.map(arg =>
                    arg.getText(),
                );

                fn.replaceWithText(
                    `tuiGetClosestFocusable({initial: ${initial}, root: ${root}, previous: ${prev}, keyboard: ${keyboard}})`,
                );
            }
        });
}
