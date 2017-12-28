/**
 * @flow
 * @file File for some simple dom utilities
 * @author Box
 */

import { CLASS_CHECKBOX_SPAN, CLASS_BUTTON_CONTENT_SPAN } from '../constants';

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
    return tag === 'input' || tag === 'select' || tag === 'textarea';
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
    return (
        isInputElement(element) ||
        tag === 'button' ||
        tag === 'a' ||
        tag === 'option' ||
        element.classList.contains(CLASS_CHECKBOX_SPAN) ||
        element.classList.contains(CLASS_BUTTON_CONTENT_SPAN)
    );
}

/**
 * Focuses a DOM element if it exists.
 *
 * @param {HTMLElement} root - the root dom element to search
 * @param {string} selector - the query selector
 * @param {boolean|void} [focusRoot] - if root should be focused
 * @return {void}
 */
export function focus(root: HTMLElement, selector: string, focusRoot: boolean = true): void {
    if (!root || !selector) {
        return;
    }
    const element = root.querySelector(selector);
    if (element && typeof element.focus === 'function') {
        element.focus();
    } else if (focusRoot) {
        root.focus();
    }
}
