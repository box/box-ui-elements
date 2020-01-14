// @flow
import { useContext } from 'react';
import { SHOWING, CLOSED } from './constants';
import type { MessageName } from './types';
import type { TargetingApi } from './TargetingApi';
import MessageContext from './MessageContext';

const useMessage = (name: MessageName): TargetingApi => {
    const { eligibleMessageIDMap, messageApi, messageStateMap, setMessageStateMap } = useContext(MessageContext);

    return {
        canShow: name in eligibleMessageIDMap && messageStateMap[name] !== CLOSED,
        onShow: () => {
            if (!messageStateMap[name]) {
                setMessageStateMap({ ...messageStateMap, [name]: SHOWING });
                messageApi.markMessageAsSeen(eligibleMessageIDMap[name]);
            }
        },
        onClose: () => {
            if (messageStateMap[name] === 'showing') {
                setMessageStateMap({ ...messageStateMap, [name]: CLOSED });
                messageApi.markMessageAsClosed(eligibleMessageIDMap[name]);
            }
        },
    };
};

export default useMessage;
