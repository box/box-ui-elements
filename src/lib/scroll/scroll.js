// @flow

/**
 * Scrolls to position on page
 * @param {number} x
 * @param {number} y
 * @returns {void}
 */
function scrollTo(x: number, y: number) {
    window.scrollTo(x, y);
}

/**
 * Scrolls to top of page
 * @returns {void}
 */
function scrollToTop() {
    scrollTo(0, 0);
}

/**
 * Returns body scroll position
 */
function getScrollTop() {
    return window.scrollY || (document.documentElement ? document.documentElement.scrollTop : null);
}

/**
 * Scrolls body the difference (positive or negative) from current position
 */
function incrementScroll(offset: number) {
    scrollTo(0, getScrollTop() + offset);
}

export { scrollTo, scrollToTop, getScrollTop, incrementScroll };
