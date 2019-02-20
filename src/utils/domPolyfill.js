/**
 * Polyfills the .closest method for ELement
 * Currently being used for scrollIntoView
 * For reference: https://github.com/zloirock/core-js/issues/317
 *
 * @param {HTMLElement|null} s - the dom string that is being checked against
 * @return {HTMLElement|null} returns either the parent element that was found or null
 */
window.Element.prototype.closest = function closest(s) {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    let el = this;
    do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
};

module.exports = window.Element.prototype.closest;
