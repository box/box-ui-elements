// @flow
import { useContext, useMemo } from 'react';
import { MESSAGE_STATES } from './constants';
import type { MessageName, TargetingApi } from './types';
import MessageContext from './MessageContext';

function useMessage(name: MessageName): TargetingApi {
    const messageContext = useContext(MessageContext);
    return useMemo(() => {
        const {
            messageApi: { eligibleMessageIDMap, markMessageAsSeen, markMessageAsClosed },
            messageStateMap,
            setMessageStateMap,
        } = messageContext;

        const canShow = name in eligibleMessageIDMap && messageStateMap[name] !== MESSAGE_STATES.CLOSED;

        function onShow() {
            if (canShow && !messageStateMap[name]) {
                setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.SHOWING });
                // FIXME markMessageAsSeen action was currently throttled to prevent we make multiple
                // backend call if onShow is called multiple times before setMessageStateMap
                // actually alter the messageState. But it is preferrable to prevent
                // markMessageAsSeen from being called multiple times instead of throttling
                // after it is called.
                markMessageAsSeen(eligibleMessageIDMap[name]);
            }
        }

        function onClose() {
            if (canShow && messageStateMap[name] === MESSAGE_STATES.SHOWING) {
                setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.CLOSED });
                markMessageAsClosed(eligibleMessageIDMap[name]);
            }
        }

        function onComplete() {
            if (canShow && messageStateMap[name] === MESSAGE_STATES.SHOWING) {
                setMessageStateMap({ ...messageStateMap, [name]: MESSAGE_STATES.CLOSED });
                markMessageAsClosed(eligibleMessageIDMap[name]);
            }
        }

        return { canShow, onShow, onClose, onComplete };
    }, [messageContext, name]);
}

export default useMessage;
