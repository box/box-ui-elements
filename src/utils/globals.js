// @flow
// eslint-disable-next-line import/prefer-default-export
export function setElementsDebugInfo() {
    if (window.Box) {
        window.Box.Elements = window.Box.Elements || {};
        // $FlowFixMe
        window.Box.Elements.version = __VERSION__ || ''; // eslint-disable-line no-undef
    }
}
