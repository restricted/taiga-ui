import {
    AfterViewInit,
    ContentChildren,
    Directive,
    ElementRef,
    forwardRef,
    Inject,
    Input,
    NgZone,
    QueryList,
    Renderer2,
    Self,
} from '@angular/core';
import {TuiLineChartHintContext} from '@taiga-ui/addon-charts/interfaces';
import {
    EMPTY_QUERY,
    TuiContextWithImplicit,
    TuiDestroyService,
    TuiHoveredService,
    tuiPure,
    tuiQueryListChanges,
    tuiZonefree,
} from '@taiga-ui/cdk';
import {TuiPoint} from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {combineLatest, Observable} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    startWith,
    switchMap,
    takeUntil,
} from 'rxjs/operators';

import {TuiLineChartComponent} from './line-chart.component';

@Directive({
    selector: '[tuiLineChartHint]',
    providers: [TuiDestroyService, TuiHoveredService],
})
export class TuiLineChartHintDirective implements AfterViewInit {
    @ContentChildren(forwardRef(() => TuiLineChartComponent))
    private readonly charts: QueryList<TuiLineChartComponent> = EMPTY_QUERY;

    @ContentChildren(forwardRef(() => TuiLineChartComponent), {read: ElementRef})
    private readonly chartsRef: QueryList<ElementRef<HTMLElement>> = EMPTY_QUERY;

    @Input('tuiLineChartHint')
    hint: PolymorpheusContent<TuiContextWithImplicit<readonly TuiPoint[]>>;

    constructor(
        @Inject(Renderer2) private readonly renderer: Renderer2,
        @Self() @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
        @Inject(NgZone) private readonly ngZone: NgZone,
        @Inject(TuiHoveredService) private readonly hovered$: Observable<boolean>,
    ) {}

    ngAfterViewInit(): void {
        combineLatest([tuiLineChartDrivers(this.charts), this.hovered$])
            .pipe(
                filter(result => !result.some(Boolean)),
                tuiZonefree(this.ngZone),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.charts.forEach(chart => chart.onHovered(NaN));
            });
    }

    // _chart is required by TuiLineDaysChartComponent that impersonates this directive
    getContext(
        index: number,
        _chart: TuiLineChartComponent,
    ): TuiLineChartHintContext<readonly TuiPoint[]> {
        return this.computeContext(index, this.charts);
    }

    // _chart is required by TuiLineDaysChartComponent that impersonates this directive
    raise(index: number, _chart: TuiLineChartComponent): void {
        const current = this.charts.map(chart => chart.value[index]);
        const sorted = [...current].sort((a, b) => a[1] - b[1]);

        this.charts.forEach(chart => chart.onHovered(index));
        this.chartsRef.forEach(({nativeElement}, index) =>
            this.renderer.setStyle(
                nativeElement,
                'z-index',
                sorted.indexOf(current[index]),
            ),
        );
    }

    @tuiPure
    private computeContext(
        index: number,
        charts: QueryList<TuiLineChartComponent>,
    ): TuiLineChartHintContext<readonly TuiPoint[]> {
        return {
            $implicit: charts.map(chart => chart.value[index]),
            index,
        };
    }
}

export function tuiLineChartDrivers(
    charts: QueryList<{drivers: QueryList<Observable<boolean>>}>,
): Observable<boolean> {
    return combineLatest(
        charts.map(({drivers}) =>
            tuiQueryListChanges(drivers).pipe(
                map(drivers => drivers.map(driver => driver.pipe(startWith(false)))),
            ),
        ),
    ).pipe(
        map(all => all.reduce((acc, drivers) => acc.concat(drivers), [])),
        switchMap(drivers => combineLatest(drivers)),
        map(values => values.some(Boolean)),
        distinctUntilChanged(),
    );
}
