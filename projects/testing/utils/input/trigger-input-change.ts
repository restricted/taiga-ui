export function tuiTriggerInputChange(element: HTMLInputElement, data: string): void {
    const event = new InputEvent('input', {data});

    element.value = data;
    element.dispatchEvent(event);
}
