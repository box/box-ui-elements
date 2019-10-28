/**
 * @flow
 * @file File for some simple dom utilities
 * @author Box
 */
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { KEYS, OVERLAY_WRAPPER_CLASS, VIEWPORT_BORDERS } from '../constants';
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

/**
 * Gets the viewport intersections.
 *
 * @param {Object} bounding - Object describing the position relative to the viewport. Typically retrieved from getBoundingClientRect()
 * @return {Array} Returns an array of the boundary intersections ['top', 'left', 'bottom', 'right']
 */
export function getViewportIntersections(bounding: DOMRectReadOnly): Array<string> {
    const boundaryIntersections = [];
    if (bounding.top < 0) {
        boundaryIntersections.push(VIEWPORT_BORDERS.top);
    }

    if (bounding.left < 0) {
        boundaryIntersections.push(VIEWPORT_BORDERS.left);
    }

    if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
        boundaryIntersections.push(VIEWPORT_BORDERS.bottom);
    }

    if (bounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
        boundaryIntersections.push(VIEWPORT_BORDERS.right);
    }

    return boundaryIntersections;
}

export type ElementDimensions = {
    height?: number,
    width?: number,
};

/**
 * Gets an HTMLElement's dimensions (width and height)
 *
 * @param {HTMLElement} element - The HTML element
 * @return {Object} Object containing the width and height of the element
 */
export function getDimensions(element?: HTMLElement): ElementDimensions {
    if (!element) {
        return {};
    }

    const boundingClientRect = element.getBoundingClientRect();

    return {
        height: boundingClientRect.height,
        width: boundingClientRect.width,
    };
}
