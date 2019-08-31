/**
 * @flow
 * @file File for some simple dom utilities
 * @author Box
 */
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { KEYS, OVERLAY_WRAPPER_CLASS } from '../constants';
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
 * Checks if a keyboard event is intended to activate an element.
 *
 * @param {SyntheticKeyboardEvent<HTMLElement>} event - The keyboard event
 * @returns {boolean} true if the event is intended to activate the element
 */
export function isActivateKey(event: SyntheticKeyboardEvent<HTMLElement>) {
    return event.key === KEYS.enter || event.key === KEYS.space;
}

/**
 * Checks if a mouse event is an unmodified left click.
 *
 * @param {SyntheticMouseEvent<HTMLElement>} event - The mouse event
 * @returns {boolean} true if the event is an unmodified left click
 */
export function isLeftClick(event: SyntheticMouseEvent<HTMLElement>) {
    return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
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
 * @param {Object} options - scroll into view options to override
 * @return {void}
 */
export function scrollIntoView(itemEl: ?HTMLElement, options?: Object = {}): void {
    // @NOTE: breaks encapsulation but alternative is unknown child ref
    if (itemEl) {
        const parentEl = itemEl.closest(`.body, .modal, .${OVERLAY_WRAPPER_CLASS}`);
        scrollIntoViewIfNeeded(itemEl, {
            scrollMode: 'if-needed',
            boundary: parentEl,
            ...options,
        });
    }
}
