/**
 * @flow
 * @file File for some simple dom utilities
 * @author Box
 */

import { CLASS_CHECKBOX_SPAN, CLASS_BUTTON_CONTENT_SPAN } from '../constants';

/**
 * Gets if an html element is button or input
 * or text area or select etc. Something the user
 * can focus or type into.
 *
 * @param {HTMLElement|null} element - the dom element to check
 * @return {boolean} true if its one of the above elements
 */
export default function isActionableElement(element: HTMLElement | null): boolean {
    if (!element) {
        return false;
    }
    const tag = element.tagName.toLowerCase();
    return (
        tag === 'button' ||
        tag === 'select' ||
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'option' ||
        element.classList.contains(CLASS_CHECKBOX_SPAN) ||
        element.classList.contains(CLASS_BUTTON_CONTENT_SPAN)
    );
}
