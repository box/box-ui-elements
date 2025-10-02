import getProp from 'lodash/get';
const isMarkSupported = typeof getProp(window, 'performance.mark') === 'function';
const mark = markName => isMarkSupported && window.performance.mark(markName);
export { mark, isMarkSupported };
//# sourceMappingURL=performance.js.map