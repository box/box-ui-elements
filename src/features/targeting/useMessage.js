// @flow
import { useContext } from 'react';
import { MESSAGE_STATES } from './constants';
import type { MessageName } from './types';
import type { TargetingApi } from './TargetingApi';
import MessageContext from './MessageContext';

function useMessage(name: MessageName): TargetingApi {
    const {
        messageApi: { eligibleMessageIDMap, markMessageAsSeen, markMessageAsClosed },
        messageStateMap,
        setMessageStateMap,
    } = useContext(MessageContext);

    function canShow() {
        return name in eligibleMessageIDMap && messageStateMap[name] !== MESSAGE_STATES.CLOSED;
    }

    function onShow() {
        if (canShow() && !messageStateMap[name]) {
            setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.SHOWING });
            markMessageAsSeen(eligibleMessageIDMap[name]);
        }
    }

    function onClose() {
        if (canShow() && messageStateMap[name] === MESSAGE_STATES.SHOWING) {
            setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.CLOSED });
            markMessageAsClosed(eligibleMessageIDMap[name]);
        }
    }

    return { canShow, onShow, onClose };
}

export default useMessage;
