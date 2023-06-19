import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
} from '@angular/core';
import {TUI_PREVIEW_ZOOM_TEXTS} from '@taiga-ui/addon-preview/tokens';
import {ALWAYS_FALSE_HANDLER, tuiClamp, tuiDefaultProp} from '@taiga-ui/cdk';
import {TuiLanguagePreview} from '@taiga-ui/i18n';
import {merge, Observable, of, timer} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';

const STEP = 0.5;

@Component({
    selector: 'tui-preview-zoom',
    templateUrl: './preview-zoom.template.html',
    styleUrls: ['./preview-zoom.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiPreviewZoomComponent {
    @Input()
    @tuiDefaultProp()
    min = 0.5;

    @Input()
    @tuiDefaultProp()
    max = 2;

    @Input()
    @tuiDefaultProp()
    value = 1;

    @Output()
    readonly valueChange = new EventEmitter<number>();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
    readonly reset = new EventEmitter<void>();

    readonly hintShow$ = this.valueChange.pipe(
        switchMap(() => merge(of(true), timer(1000).pipe(map(ALWAYS_FALSE_HANDLER)))),
        startWith(false),
    );

    constructor(
        @Inject(TUI_PREVIEW_ZOOM_TEXTS)
        readonly zoomTexts$: Observable<TuiLanguagePreview['zoomTexts']>,
    ) {}

    get leftButtonDisabled(): boolean {
        return this.value === this.min;
    }

    get rightButtonDisabled(): boolean {
        return this.value === this.max;
    }

    get collapseVisible(): boolean {
        return this.value > this.min;
    }

    onModelChange(value: number): void {
        const clamped = tuiClamp(value, this.min, this.max);

        if (clamped === this.value) {
            return;
        }

        this.value = clamped;
        this.valueChange.emit(clamped);
    }

    onReset(): void {
        this.reset.emit();
    }

    onMinus(): void {
        this.onModelChange(this.value - STEP);
    }

    onPlus(): void {
        this.onModelChange(this.value < 1 ? 1 : this.value + STEP);
    }
}
