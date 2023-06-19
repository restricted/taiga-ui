import {Directive, ElementRef, Inject, Input, Self} from '@angular/core';
import {TUI_DOC_PAGE_LOADED} from '@taiga-ui/addon-doc/tokens';
import {TuiDestroyService, tuiGetElementObscures} from '@taiga-ui/cdk';
import {Observable, ReplaySubject} from 'rxjs';
import {debounceTime, filter, switchMap, takeUntil} from 'rxjs/operators';

@Directive({
    selector: '[tuiScrollIntoViewLink]',
    providers: [TuiDestroyService],
})
export class TuiScrollIntoViewLinkDirective {
    @Input()
    set tuiScrollIntoViewLink(shallWe: boolean) {
        this.scroll$.next(shallWe);
    }

    private readonly scroll$ = new ReplaySubject<boolean>(1);

    constructor(
        @Self() @Inject(TuiDestroyService) destroy$: TuiDestroyService,
        @Inject(ElementRef) {nativeElement}: ElementRef<HTMLElement>,
        @Inject(TUI_DOC_PAGE_LOADED)
        readonly readyToScroll$: Observable<boolean>,
    ) {
        this.readyToScroll$
            .pipe(
                filter(Boolean),
                switchMap(() => this.scroll$),
                debounceTime(750),
                filter(shallWe => shallWe && !!tuiGetElementObscures(nativeElement)),
                takeUntil(destroy$),
            )
            .subscribe(() => {
                nativeElement.scrollIntoView();
            });
    }
}
