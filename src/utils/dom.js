/**
 * @flow
 * @file File for some simple dom utilities
 * @author Box
 */
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import './domPolyfill';

/**
 * Checks if an html element is some type of input-able
 * element or text area type where characters can be typed.
 *
 * @param {HTMLElement|null} element - the dom element to check
 * @return {boolean} true if its one of the above elements
 */
export function isInputElement(element: HTMLElement | EventTarget | null): boolean {
    if (!element || !(element instanceof HTMLElement)) {
        return false;
    }

    const tag = element.tagName.toLowerCase();
    return (
        tag === 'input' ||
        tag === 'select' ||
        tag === 'textarea' ||
        (tag === 'div' && !!element.getAttribute('contenteditable'))
    );
}

/**
 * Checks if an html element is some kind of element
 * that the user would want to keep their focus on.
 *
 * @param {HTMLElement|null} element - the dom element to check
 * @return {boolean} true if its one of the above elements
 */
export function isFocusableElement(element: HTMLElement | EventTarget | null): boolean {
    if (!element || !(element instanceof HTMLElement)) {
        return false;
    }

    const tag = element.tagName.toLowerCase();

    // Box React UI sensitive checks
    const isCheckbox =
        element.classList.contains('checkbox-pointer-target') ||
        (element.parentElement instanceof HTMLElement
            ? element.parentElement.classList.contains('checkbox-label')
            : false);

    const isButton =
        element.classList.contains('btn-content') ||
        (element.parentElement instanceof HTMLElement ? element.parentElement.classList.contains('btn') : false);

    return isInputElement(element) || tag === 'button' || tag === 'a' || tag === 'option' || isCheckbox || isButton;
}

/**
 * Focuses a DOM element if it exists.
 *
 * @param {HTMLElement} root - the root dom element to search
 * @param {string} selector - the query selector
 * @param {boolean|void} [focusRoot] - if root should be focused
 * @return {void}
 */
export function focus(root: ?HTMLElement, selector?: string, focusRoot: boolean = true): void {
    if (!root) {
        return;
    }

    if (!selector) {
        root.focus();
        return;
    }

    const element = root.querySelector(selector);
    if (element && typeof element.focus === 'function') {
        element.focus();
    } else if (focusRoot) {
        root.focus();
    }
}

/**
 * Scrolls the container / modal / wrapper instead of the body
 *
 * @param {HTMLElement} itemEl - the base dom element to search
 * @return {void}
 */
export function scrollIntoView(itemEl: ?HTMLElement): void {
    // @NOTE: breaks encapsulation but alternative is unknown child ref
    if (itemEl) {
        const parentEl = itemEl.closest('body, .modal, .overlay-wrapper');
        scrollIntoViewIfNeeded(itemEl, false, undefined, parentEl);
    }
}
