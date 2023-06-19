import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    HostListener,
    Inject,
    Input,
    Optional,
    QueryList,
    Self,
    ViewChild,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {
    AbstractTuiNullableControl,
    EMPTY_QUERY,
    TUI_IS_IOS,
    tuiAsControl,
    tuiAsFocusableItemAccessor,
    tuiClamp,
    tuiDefaultProp,
    TuiFocusableElementAccessor,
    TuiInputMode,
    TuiMapper,
} from '@taiga-ui/cdk';
import {
    TUI_DECIMAL_SYMBOLS,
    TUI_NUMBER_FORMAT,
    tuiCreateAutoCorrectedNumberPipe,
    tuiCreateNumberMask,
    TuiDecimal,
    tuiEnableAutoCorrectDecimalSymbol,
    tuiFormatNumber,
    tuiGetFractionPartPadded,
    tuiMaskedMoneyValueIsEmpty,
    tuiMaskedNumberStringToNumber,
    TuiNumberFormatSettings,
    TuiPrimitiveTextfieldComponent,
    TuiTextMaskOptions,
} from '@taiga-ui/core';
import {PolymorpheusOutletDirective} from '@tinkoff/ng-polymorpheus';

import {TUI_INPUT_NUMBER_OPTIONS, TuiInputNumberOptions} from './input-number-options';

const DEFAULT_MAX_LENGTH = 18;

@Component({
    selector: 'tui-input-number',
    templateUrl: './input-number.template.html',
    styleUrls: ['./input-number.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiAsFocusableItemAccessor(TuiInputNumberComponent),
        tuiAsControl(TuiInputNumberComponent),
    ],
})
export class TuiInputNumberComponent
    extends AbstractTuiNullableControl<number>
    implements TuiFocusableElementAccessor
{
    @ViewChild(TuiPrimitiveTextfieldComponent)
    private readonly primitiveTextfield?: TuiPrimitiveTextfieldComponent;

    private unfinishedValue: string | null = '';

    @Input()
    @tuiDefaultProp()
    min = this.options.min;

    @Input()
    @tuiDefaultProp()
    max = this.options.max;

    @Input()
    @tuiDefaultProp()
    decimal = this.options.decimal;

    @Input()
    @tuiDefaultProp()
    precision = this.options.precision;

    @Input()
    step = this.options.step;

    /** @deprecated use `tuiTextfieldPrefix` from {@link TuiTextfieldControllerModule} instead */
    @Input()
    @tuiDefaultProp()
    prefix = '';

    /** @deprecated use `tuiTextfieldPostfix` from {@link TuiTextfieldControllerModule} instead */
    @Input()
    @tuiDefaultProp()
    postfix = '';

    @ContentChildren(PolymorpheusOutletDirective, {descendants: true})
    readonly polymorpheusValueContent: QueryList<unknown> = EMPTY_QUERY;

    constructor(
        @Optional()
        @Self()
        @Inject(NgControl)
        control: NgControl | null,
        @Inject(ChangeDetectorRef)
        cdr: ChangeDetectorRef,
        @Inject(TUI_INPUT_NUMBER_OPTIONS)
        readonly options: TuiInputNumberOptions,
        @Inject(TUI_NUMBER_FORMAT)
        private readonly numberFormat: TuiNumberFormatSettings,
        @Inject(TUI_IS_IOS) private readonly isIOS: boolean,
    ) {
        super(control, cdr);
    }

    get nativeFocusableElement(): HTMLInputElement | null {
        return !this.primitiveTextfield || this.computedDisabled
            ? null
            : this.primitiveTextfield.nativeFocusableElement;
    }

    get focused(): boolean {
        return !!this.primitiveTextfield && this.primitiveTextfield.focused;
    }

    get isNegativeAllowed(): boolean {
        return this.min < 0;
    }

    get inputMode(): TuiInputMode {
        if (this.isIOS && this.isNegativeAllowed) {
            // iPhone does not have minus sign if inputMode is equal to 'numeric' / 'decimal'
            return 'text';
        }

        return this.decimal === 'never' ? 'numeric' : 'decimal';
    }

    get calculatedMaxLength(): number {
        const decimalPart =
            this.decimal !== 'never' &&
            this.nativeValue.includes(this.numberFormat.decimalSeparator);
        const precision = decimalPart ? Math.min(this.precision + 1, 20) : 0;
        const takeThousand = this.numberFormat.thousandSeparator.repeat(5).length;

        return DEFAULT_MAX_LENGTH + precision + takeThousand;
    }

    get formattedValue(): string {
        return this.getFormattedValue(this.value || 0);
    }

    get computedValue(): string {
        if (this.focused) {
            return this.nativeValue;
        }

        return this.value === null ? '' : this.formattedValue;
    }

    get canDecrement(): boolean {
        return this.interactive && (this.value || 0) > this.min;
    }

    get canIncrement(): boolean {
        return this.interactive && (this.value || 0) < this.max;
    }

    @HostListener('keydown.arrowDown', ['-step'])
    @HostListener('keydown.arrowUp', ['step'])
    onArrow(step: number | null): void {
        if (!step) {
            return;
        }

        this.value = tuiClamp((this.value || 0) + step, this.min, this.max);
        this.nativeValue = this.formattedValue;
    }

    // TODO: Review if it's still necessary with maskito
    @HostListener('keydown.0', ['$event'])
    onZero(event: KeyboardEvent): void {
        const decimal =
            this.nativeValue.split(this.numberFormat.decimalSeparator)[1] || '';
        const {nativeFocusableElement} = this;

        if (
            decimal.length < this.precision ||
            !nativeFocusableElement ||
            !nativeFocusableElement.selectionStart ||
            this.nativeValue[nativeFocusableElement.selectionStart] !== '0'
        ) {
            return;
        }

        event.preventDefault();
        nativeFocusableElement.selectionStart++;
    }

    mask: TuiMapper<boolean, TuiTextMaskOptions> = (
        allowNegative: boolean,
        decimal: TuiDecimal,
        decimalLimit: number,
        nativeFocusableElement: HTMLInputElement | null,
    ) => ({
        mask: tuiCreateNumberMask({
            allowNegative,
            decimalLimit,
            allowDecimal: decimal !== 'never',
            requireDecimal: decimal === 'always',
            decimalSymbol: this.numberFormat.decimalSeparator,
            thousandSymbol: this.numberFormat.thousandSeparator,
            autoCorrectDecimalSymbol: tuiEnableAutoCorrectDecimalSymbol(
                this.numberFormat,
            ),
        }),
        pipe: tuiCreateAutoCorrectedNumberPipe(
            decimal === 'always' ? decimalLimit : 0,
            this.numberFormat.decimalSeparator,
            this.numberFormat.thousandSeparator,
            nativeFocusableElement,
            allowNegative,
            this.isIOS,
        ),
        guide: false,
    });

    onValueChange(value: string): void {
        this.unfinishedValue = null;

        if (tuiMaskedMoneyValueIsEmpty(value)) {
            this.value = null;

            return;
        }

        if (this.isNativeValueNotFinished) {
            this.unfinishedValue = value;

            return;
        }

        const capped = this.absoluteCapInputValue(value);

        if (capped === null || Number.isNaN(capped)) {
            return;
        }

        this.value = capped;

        if (
            capped !==
            tuiMaskedNumberStringToNumber(
                value,
                this.numberFormat.decimalSeparator,
                this.numberFormat.thousandSeparator,
            )
        ) {
            this.nativeValue = this.formattedValue;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!TUI_DECIMAL_SYMBOLS.includes(event.key)) {
            return;
        }

        if (this.decimal === 'never') {
            event.preventDefault();

            return;
        }

        if (this.nativeValue.includes(this.numberFormat.decimalSeparator)) {
            event.preventDefault();
            this.setCaretAfterComma();
        }
    }

    onFocused(focused: boolean): void {
        this.updateFocused(focused);

        if (focused) {
            return;
        }

        const nativeNumberValue = this.unfinishedValue
            ? tuiMaskedNumberStringToNumber(
                  this.unfinishedValue,
                  this.numberFormat.decimalSeparator,
                  this.numberFormat.thousandSeparator,
              )
            : this.nativeNumberValue;

        this.unfinishedValue = null;

        if (Number.isNaN(nativeNumberValue)) {
            this.clear();

            return;
        }

        this.value = Math.min(this.max, Math.max(this.min, nativeNumberValue));
        this.nativeValue = this.formattedValue;
    }

    getFormattedValue(value: number): string {
        const absValue = Math.abs(value);
        const hasFraction = absValue % 1 > 0;
        let decimalLimit =
            this.decimal === 'always' || (hasFraction && this.decimal !== 'never')
                ? this.precision
                : 0;

        const fraction = hasFraction
            ? tuiGetFractionPartPadded(value, this.precision)
            : '';

        if (this.focused && this.decimal !== 'always') {
            decimalLimit = fraction.length;
        }

        return tuiFormatNumber(value, {
            ...this.numberFormat,
            decimalLimit,
        });
    }

    private get isNativeValueNotFinished(): boolean {
        const nativeNumberValue = this.nativeNumberValue;

        return nativeNumberValue < 0
            ? nativeNumberValue > this.max
            : nativeNumberValue < this.min;
    }

    get nativeValue(): string {
        return this.nativeFocusableElement ? this.nativeFocusableElement.value : '';
    }

    set nativeValue(value: string) {
        if (!this.primitiveTextfield || !this.nativeFocusableElement) {
            return;
        }

        this.primitiveTextfield.value = value;
        this.nativeFocusableElement.value = value;
    }

    private get nativeNumberValue(): number {
        return tuiMaskedNumberStringToNumber(
            this.nativeValue,
            this.numberFormat.decimalSeparator,
            this.numberFormat.thousandSeparator,
        );
    }

    private clear(): void {
        this.nativeValue = '';
        this.value = null;
    }

    private absoluteCapInputValue(inputValue: string): number | null {
        const value = tuiMaskedNumberStringToNumber(
            inputValue,
            this.numberFormat.decimalSeparator,
            this.numberFormat.thousandSeparator,
        );
        const capped =
            value < 0
                ? Math.max(Math.max(this.min, Number.MIN_SAFE_INTEGER), value)
                : Math.min(value, Math.min(this.max, Number.MAX_SAFE_INTEGER));
        const ineligibleValue =
            Number.isNaN(capped) || capped < this.min || capped > this.max;

        return ineligibleValue ? null : capped;
    }

    private setCaretAfterComma(): void {
        if (!this.nativeFocusableElement) {
            return;
        }

        const afterCommaPosition = this.nativeValue.length - this.precision;

        this.nativeFocusableElement.setSelectionRange(
            afterCommaPosition,
            afterCommaPosition,
        );
    }
}
