export function tuiTriggerTransitionStart(element: Element, propertyName: string): void {
    const event = new TransitionEvent('transitionstart', {propertyName});

    element.dispatchEvent(event);
}
