// @flow
/**
 * TargetingApi is consumed by component that supports targeting. It is provided on a per message
 * basis. Currently, useMessage can provide targeting from MessageContext.
 */

export type TargetingApi = $ReadOnly<{
    // is true if message is eligible to show and not yet closed
    canShow: () => boolean,
    // shorthand for onEvent('close'), should call to cause canShow to be false to close message
    onClose: () => void,
    // shorthand for onEvent('show'), should call when message is rendered
    onShow: () => void,
}>;
