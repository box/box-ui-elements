import getProp from 'lodash/get';

const isMarkSupported = typeof getProp(window, 'performance.mark') === 'function';

const mark = (markName: string): false | PerformanceMark => isMarkSupported && window.performance.mark(markName);

export { mark, isMarkSupported };
