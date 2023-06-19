import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    Optional,
    Self,
    ViewChild,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {
    AbstractTuiControl,
    tuiAsFocusableItemAccessor,
    tuiDefaultProp,
    TuiFocusableElementAccessor,
    tuiIsNativeFocused,
    TuiNativeFocusableElement,
} from '@taiga-ui/cdk';
import {TUI_VALUE_ACCESSOR_PROVIDER} from '@taiga-ui/kit/providers';

@Component({
    selector: 'tui-input-inline',
    templateUrl: './input-inline.template.html',
    styleUrls: ['./input-inline.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        TUI_VALUE_ACCESSOR_PROVIDER,
        tuiAsFocusableItemAccessor(TuiInputInlineComponent),
    ],
})
export class TuiInputInlineComponent
    extends AbstractTuiControl<number | string>
    implements TuiFocusableElementAccessor
{
    @ViewChild('native')
    private readonly native?: ElementRef<HTMLInputElement>;

    @Input()
    @tuiDefaultProp()
    maxLength: number | null = null;

    indent = -1;

    constructor(
        @Optional()
        @Self()
        @Inject(NgControl)
        control: NgControl | null,
        @Inject(ChangeDetectorRef) cdr: ChangeDetectorRef,
    ) {
        super(control, cdr);
    }

    get nativeFocusableElement(): TuiNativeFocusableElement | null {
        return !this.native ? null : this.native.nativeElement;
    }

    get focused(): boolean {
        return tuiIsNativeFocused(this.nativeFocusableElement);
    }

    get hasValue(): boolean {
        return this.value !== '';
    }

    /** @deprecated use 'value' setter */
    onValueChange(value: string): void {
        this.value = value;
    }

    onFocused(focused: boolean): void {
        this.updateFocused(focused);
    }

    onScroll(): void {
        const indent = this.native?.nativeElement.scrollLeft || 0;

        // -1 for Safari (see styles)
        this.indent = -1 - indent;
    }

    protected getFallbackValue(): string {
        return '';
    }
}
