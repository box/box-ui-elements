// @flow
const globals = {
    setElementsDebugInfo() {
        if (window.Box) {
            window.Box.Elements = window.Box.Elements || {};
            // $FlowFixMe flow is unable to resolve __VERSION__
            window.Box.Elements.version = __VERSION__ || ''; // eslint-disable-line no-undef
        }
    },
};

export default globals;
