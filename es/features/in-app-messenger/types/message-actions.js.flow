// @flow
import { type MessageIdentifier } from './message';

/**
 * Define MessageAction
 */
const close: 'close' = 'close';
const launch: 'launch' = 'launch';
const openURL: 'openURL' = 'openURL';
const pushHistory: 'pushHistory' = 'pushHistory'; // push history will change href without reloading the app
const postToServer: 'postToServer' = 'postToServer';

export const messageActionTypes = {
    close,
    launch,
    openURL,
    pushHistory,
    postToServer,
};

export type MessageActionType = $Values<typeof messageActionTypes>;

export type CloseMessageAction = {|
    type: typeof close,
|};

export type LaunchMessageAction = {|
    messageIdentifier: MessageIdentifier,
    type: typeof launch,
|};

export type OpenURLMessageAction = {|
    target: '_blank' | '_self',
    type: typeof openURL,
    url: string,
|};

export type PushHistoryMessageAction = {|
    href: string,
    type: typeof pushHistory,
|};

export type PostToServerMessageAction =
    | {|
          actionData: {},
          actionName: string,
          isProgrammatic: true,
          type: typeof postToServer,
      |}
    | {|
          actionID: string,
          isProgrammatic: false,
          type: typeof postToServer,
      |};

/**
 * CustomMessageAction can be customized to implement almost any action. An example is provided here:
 *
 * This example assumes you have a template that will send firstName, lastName, email to the either
 * /business-end-point or /personal-end-point based on whether the isBusiness key in global store is true or false.
 * Both end points will return a displayMessage which should be updated UI with through setDisplayMessageAction.
 *
 * The button will be implemented like this:
 *
 * button: {
 *   label: 'click here'
 *   actions: [ (handleMessageActions, messageIdentifier, firstName, lastName, email) => async ( dispatch, getState )
 *   => {
 *      if ( getState()['isBusiness'] ) {
 *        const displayMessage = await post('/business-end-point', { firstName, lastName, email });
 *        dispatch(setDisplayMessageAction(displayMessage));
 *      } else {
 *        const displayMessage = await post('/personal-end-point', { firstName, lastName, email });
 *       dispatch(setDisplayMessageAction(displayMessage));
 *   }]
 * }
 *
 * Here the firstName, lastName, email must be sent from the template
 */
export type CustomMessageAction = (
    handleMessageActions: Function,
    MessageIdentifier,
    ...Array<any>
) => (Function, Function) => any;

/**
 * MessageAction can be an array in which each item will be executed in parallel.
 * All actions are fire and forget except PostToServerMessageAction will make a post request to server and response
 * is treated as MessageAction.
 * If you need any custom behavior, you can implement it through CustomMessageAction
 */
export type MessageAction =
    | CloseMessageAction
    | OpenURLMessageAction
    | PushHistoryMessageAction
    | PostToServerMessageAction
    | CustomMessageAction;

export type MessageActions = Array<MessageAction>;

export const messageActions: {
    close: CloseMessageAction,
} = {
    close: { type: 'close' },
};
