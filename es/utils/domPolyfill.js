/**
 * Polyfills the .closest method for Element
 * Currently being used for scrollIntoView
 * For reference: https://github.com/zloirock/core-js/issues/317
 */
window.Element.prototype.closest = function closest(s) {
  if (!window.Element.prototype.matches) {
    window.Element.prototype.matches = window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;
  }
  let el = this;
  do {
    if (el.matches(s)) return el;
    el = el.parentElement || el.parentNode;
  } while (el !== null && el.nodeType === 1);
  return null;
};
//# sourceMappingURL=domPolyfill.js.map