/**
 * @flow
 * @file Flow type definitions for routing
 * @author Box
 */

export type RouterHistory = {
    push: (path: string | Object) => void,
    replace: (path: string | Object) => void,
    go: (n: number) => void,
    goBack: () => void,
    goForward: () => void,
    listen: (callback: Function) => Function,
    block: (callback: Function) => Function,
    createHref: (location: Object) => string,
    location: Object,
    action: string,
    length: number,
};
