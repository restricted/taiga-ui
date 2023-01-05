import {Directive, Inject} from '@angular/core';
import {WINDOW} from '@ng-web-apis/common';
import {
    tuiAsPositionAccessor,
    TuiPositionAccessor,
    TuiRectAccessor,
} from '@taiga-ui/core/abstract';
import {TuiPoint, TuiVerticalDirection} from '@taiga-ui/core/types';

import {TUI_DROPDOWN_OPTIONS, TuiDropdownOptions} from './dropdown-options.directive';

@Directive({
    selector: '[tuiDropdown]:not([tuiDropdownCustomPosition]):not([tuiDropdownSided])',
    providers: [tuiAsPositionAccessor(TuiDropdownPositionDirective)],
})
export class TuiDropdownPositionDirective implements TuiPositionAccessor {
    private previous?: TuiVerticalDirection;

    constructor(
        @Inject(TUI_DROPDOWN_OPTIONS) private readonly options: TuiDropdownOptions,
        @Inject(WINDOW) private readonly windowRef: Window,
        @Inject(TuiRectAccessor) private readonly accessor: TuiRectAccessor,
    ) {}

    getPosition({width, height}: ClientRect): TuiPoint {
        const hostRect = this.accessor.getClientRect();
        const {innerHeight, innerWidth} = this.windowRef;
        const {minHeight, align, direction, offset} = this.options;
        const previous = this.previous || direction || 'bottom';
        const right = Math.max(hostRect.right - width, offset);
        const available = {
            top: hostRect.top - 2 * offset,
            bottom: innerHeight - hostRect.bottom - 2 * offset,
        } as const;
        const position = {
            top: hostRect.top - offset - height,
            bottom: hostRect.bottom + offset,
            right,
            left: hostRect.left + width < innerWidth - offset ? hostRect.left : right,
        } as const;
        const better = available.top > available.bottom ? 'top' : 'bottom';

        if (
            (available[previous] > minHeight && direction) ||
            available[previous] > height
        ) {
            return [position[previous], position[align]];
        }

        this.previous = better;

        return [position[better], position[align]];
    }
}
