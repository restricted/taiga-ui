import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {TuiDestroyService} from '@taiga-ui/cdk/services';
import {fromEvent} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

@Component({
    selector: '[tuiAutofilledChange]',
    template: '<ng-content></ng-content>',
    styleUrls: ['./autofilled.directive.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {class: 'tui-autofill'},
    providers: [TuiDestroyService],
})
export class TuiAutofilledDirective implements OnInit {
    @HostBinding('class._autofilled')
    autofilled = false;

    @Output()
    readonly tuiAutofilledChange = new EventEmitter<boolean>();

    constructor(
        @Inject(ElementRef) private readonly elementRef: ElementRef<Element>,
        @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
    ) {}

    get element(): Element {
        return this.elementRef.nativeElement;
    }

    get inputElement(): HTMLInputElement | null {
        return this.element?.tagName === 'INPUT'
            ? (this.element as HTMLInputElement)
            : this.element.getElementsByTagName('input')?.[0] || null;
    }

    ngOnInit(): void {
        const input = this.inputElement;

        if (input) {
            fromEvent<TransitionEvent>(input, 'transitionstart')
                .pipe(
                    filter(event => event.propertyName.includes('box-shadow')),
                    takeUntil(this.destroy$),
                )
                .subscribe(() => this.changeAutofill());
        }
    }

    private changeAutofill(): void {
        this.autofilled = !this.autofilled;
        this.tuiAutofilledChange.emit(this.autofilled);
    }
}
