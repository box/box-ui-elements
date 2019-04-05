// @flow
export default function setElementsVersion() {
    if (window.Box) {
        window.Box.Elements = {
            // $FlowFixMe infer undefined
            version: __VERSION__, // eslint-disable-line no-undef
        };
    }
}
