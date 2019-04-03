// @flow
export default function setVersion() {
    global.Box = global.Box || {};
    global.Box.Elements = {
        // $FlowFixMe infer undefined
        version: __VERSION__, // eslint-disable-line no-undef
    };
}

// use window
// only add if global.box exists
// make it a hoc?
