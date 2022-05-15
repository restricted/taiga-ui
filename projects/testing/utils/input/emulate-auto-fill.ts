import {tuiTriggerInputChange} from './trigger-input-change';
import {tuiTriggerTransitionStart} from './trigger-transition-start';

export function tuiEmulateAutoFill(input: HTMLInputElement, data?: string): void {
    tuiTriggerTransitionStart(input, '-webkit-box-shadow');
    tuiTriggerInputChange(input, data || '');
}
