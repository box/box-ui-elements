// @flow
/**
 * TargetingApi is consumed by component that supports targeting. It is provided on a per message
 * basis. Currently, useMessage can provide targeting from MessageContext.
 */

export type TargetingApi = $ReadOnly<{
    // is true if message is eligible to show and not yet closed
    canShow: boolean,
    // call onClose just before message should be closed, to cause canShow to be false
    onClose: () => void,
    // call onShow when message is shown
    onShow: () => void,
}>;
