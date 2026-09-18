/**
 * Polyfills the .closest method for Element
 * Currently being used for scrollIntoView
 * For reference: https://github.com/zloirock/core-js/issues/317
 */
window.Element.prototype.closest = function closest(this: Element, s: string): Element | null {
    const elementProto = window.Element.prototype as Element & {
        msMatchesSelector?: (selector: string) => boolean;
        webkitMatchesSelector?: (selector: string) => boolean;
    };
    if (!window.Element.prototype.matches) {
        window.Element.prototype.matches = (elementProto.msMatchesSelector ||
            elementProto.webkitMatchesSelector) as typeof Element.prototype.matches;
    }

    if (this.matches(s)) {
        return this;
    }

    let el: Element | Node | null = this.parentElement || this.parentNode;
    while (el !== null && el.nodeType === 1) {
        const element = el as Element;
        if (element.matches(s)) {
            return element;
        }
        el = element.parentElement || element.parentNode;
    }

    return null;
};
