// @flow
import { useContext } from 'react';
import { MESSAGE_STATES, MESSAGE_EVENTS } from './constants';
import type { MessageName, MessageEvent } from './types';
import type { TargetingApi } from './TargetingApi';
import MessageContext from './MessageContext';

function useMessage(name: MessageName): TargetingApi {
    const { eligibleMessageIDMap, messageApi, messageStateMap, setMessageStateMap } = useContext(MessageContext);

    function canShow() {
        return name in eligibleMessageIDMap && messageStateMap[name] !== MESSAGE_STATES.CLOSED;
    }

    function onShow() {
        if (canShow() && !messageStateMap[name]) {
            setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.SHOWING });
            messageApi.markMessageAsSeen(eligibleMessageIDMap[name]);
        }
    }

    function onClose() {
        if (canShow() && messageStateMap[name] === MESSAGE_STATES.SHOWING) {
            setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.CLOSED });
            messageApi.markMessageAsClosed(eligibleMessageIDMap[name]);
        }
    }

    function onEvent(event: MessageEvent) {
        const handlers = { [MESSAGE_EVENTS.SHOW]: onShow, [MESSAGE_EVENTS.CLOSE]: onClose };
        handlers[event]();
    }

    return { canShow, onShow, onClose, onEvent };
}

export default useMessage;
