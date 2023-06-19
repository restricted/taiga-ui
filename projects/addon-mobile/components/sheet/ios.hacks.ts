import {NgZone} from '@angular/core';
import {tuiTypedFromEvent, tuiZonefree} from '@taiga-ui/cdk';
import {concat, merge, Observable, zip} from 'rxjs';
import {delay, map, share, switchMap, take, takeUntil} from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function iosScrollFactory(
    element: HTMLElement,
    doc: Document,
    ngZone: NgZone,
): Observable<number> {
    const load$ = tuiTypedFromEvent(element, `load`, {capture: true});
    const touchstart$ = tuiTypedFromEvent(element, `touchstart`, {passive: true});
    const touchmove$ = tuiTypedFromEvent(doc, `touchmove`, {passive: true});
    const touchend$ = tuiTypedFromEvent(doc, `touchend`);
    const scroll$ = tuiTypedFromEvent(element, `scroll`).pipe(
        map(() => element.scrollTop),
    );
    const result$ = merge(
        load$.pipe(
            delay(0),
            map(() => element.scrollTop),
        ),
        touchstart$.pipe(
            switchMap(({touches}) => {
                const {screenY} = touches[0];
                const {scrollTop} = element;

                return concat(
                    // Sometimes touch is triggered without scroll in iOS, filter that
                    zip(touchmove$, scroll$).pipe(
                        map(([{touches}]) => scrollTop + screenY - touches[0].screenY),
                        takeUntil(touchend$),
                    ),
                    scroll$,
                );
            }),
        ),
    );

    return concat(scroll$.pipe(take(1)), result$).pipe(tuiZonefree(ngZone), share());
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function fakeSmoothScroll({style}: HTMLElement, offset: number): void {
    style.transition = `none`;
    style.transform = `scaleX(-1) translate3d(0, ${offset}px, 0)`;

    setTimeout(() => {
        style.transition = ``;
        style.transform = ``;
    });
}
