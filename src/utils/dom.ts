import * as React from 'react';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import { KEYS, OVERLAY_WRAPPER_CLASS } from '../constants';
import './domPolyfill';

/** True if the element is an input, select, textarea, or contenteditable div. */
export const isInputElement = (element: HTMLElement | EventTarget | null): boolean => {
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
};

/** True if the element should retain keyboard focus (inputs, buttons, links, Box checkbox/button chrome). */
export const isFocusableElement = (element: HTMLElement | EventTarget | null): boolean => {
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
        (element.parentElement instanceof HTMLElement && element.parentElement.classList.contains('btn')) ||
        (element.parentElement instanceof HTMLElement && element.parentElement.classList.contains('bdl-Button')) ||
        false;

    return isInputElement(element) || tag === 'button' || tag === 'a' || tag === 'option' || isCheckbox || isButton;
};

/** True if the keyboard event is Enter or Space (activation). */
export const isActivateKey = (event: React.KeyboardEvent): boolean =>
    event.key === KEYS.enter || event.key === KEYS.space;

/** True if the mouse event is an unmodified primary (left) click. */
export const isLeftClick = (event: React.MouseEvent): boolean =>
    event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;

/** Focus `root`, or the first node matching `selector` inside `root`, or `root` when `focusRoot` and no match. */
export const focus = (root?: HTMLElement | null, selector?: string, focusRoot: boolean = true): void => {
    if (!root) {
        return;
    }

    if (!selector) {
        root.focus();
        return;
    }

    const element = root.querySelector(selector);
    const focusableElement = element as (Element & { focus?: () => void }) | null;
    if (focusableElement && typeof focusableElement.focus === 'function') {
        focusableElement.focus();
    } else if (focusRoot) {
        root.focus();
    }
};

/** Scroll `itemEl` within the nearest modal/body/overlay wrapper. */
export const scrollIntoView = (itemEl?: HTMLElement | null, options: object = {}): void => {
    // @NOTE: breaks encapsulation but alternative is unknown child ref
    if (itemEl) {
        const parentEl = itemEl.closest(`.body, .modal, .${OVERLAY_WRAPPER_CLASS}`);
        scrollIntoViewIfNeeded(itemEl, {
            scrollMode: 'if-needed',
            boundary: parentEl,
            ...options,
        });
    }
};

/** React hook: true when `contentRef` content is wider than its visible box. */
export const useIsContentOverflowed = (contentRef: {
    current: null | Pick<HTMLElement, 'offsetWidth' | 'scrollWidth'>;
}): boolean => {
    const [isContentOverflowed, setIsContentOverflowed] = React.useState<boolean>(false);

    // This function should be set as the ref prop for the measured component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useLayoutEffect(() => {
        const { current } = contentRef;
        if (!current) {
            return;
        }
        const { offsetWidth, scrollWidth } = current;
        const willOverflow = offsetWidth < scrollWidth;
        if (willOverflow !== isContentOverflowed) {
            setIsContentOverflowed(willOverflow);
        }
    });

    return isContentOverflowed;
};
