// @flow
import * as React from 'react';
import Megaphone20 from '../../../icon/fill/Megaphone20';
import CountBadge from '../../../components/count-badge/CountBadge';
import Badgeable from '../../../components/badgeable/Badgeable';
import type { Token } from '../../../common/types/core';

import MessageCenterModal from './message-center-modal/MessageCenterModal';
import type {
    ContentPreviewProps,
    GetEligibleMessageCenterMessages,
    UnreadEligibleMessageCenterMessageCount,
    EligibleMessageCenterMessage,
} from '../types';

type Props = {|
    apiHost: string,
    buttonComponent: React.ComponentType<{ render: () => React.Node }>,
    contentPreviewProps?: ContentPreviewProps,
    getEligibleMessages: () => Promise<GetEligibleMessageCenterMessages>,
    getToken: (fileId: string) => Promise<Token>,
    getUnreadMessageCount: () => Promise<UnreadEligibleMessageCenterMessageCount>,
    overscanRowCount?: number,
    postMarkAllMessagesAsSeen: (messageArray: Array<EligibleMessageCenterMessage> | Error) => Promise<null>,
|};

function MessageCenter({
    contentPreviewProps,
    getUnreadMessageCount,
    buttonComponent: ButtonComponent,
    getEligibleMessages,
    getToken,
    apiHost,
    postMarkAllMessagesAsSeen,
    overscanRowCount,
}: Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [unreadMessageCount, setUnreadMessageCount] = React.useState(null);
    // TODO: create hook for fetching, loading
    const [messages, setMessages] = React.useState<GetEligibleMessageCenterMessages | null | Error>(null);
    const isFetchingMessagesRef = React.useRef(false);

    React.useEffect(() => {
        async function fetchUnreadMessageCount() {
            try {
                const { count } = await getUnreadMessageCount();
                setUnreadMessageCount(count);
            } catch (err) {
                // TODO: add error handling
            }
        }

        fetchUnreadMessageCount();
    }, [getUnreadMessageCount]);

    React.useEffect(() => {
        async function fetchEligibleMessages() {
            if (!isFetchingMessagesRef.current) {
                isFetchingMessagesRef.current = true;
                try {
                    const eligibleMessagesResponse = await getEligibleMessages();
                    setMessages(eligibleMessagesResponse);
                } catch (err) {
                    setMessages(err);
                }
                isFetchingMessagesRef.current = false;
            }
        }

        const isOpenAndNoMessages = isOpen && !messages;
        // if there are unread messages, prefetch the data as the user is more likely to click on the message center
        const shouldPrefetch = !isOpen && !messages && !!unreadMessageCount;
        if (isOpenAndNoMessages || shouldPrefetch) {
            fetchEligibleMessages();
        }
    }, [getEligibleMessages, isOpen, messages, unreadMessageCount]);

    function handleOnClick() {
        setIsOpen(prevIsOpen => !prevIsOpen);
        if (unreadMessageCount && unreadMessageCount > 0 && messages) {
            try {
                postMarkAllMessagesAsSeen(messages);
            } catch (err) {
                // swallow
            }
            setUnreadMessageCount(0);
        }
    }

    function onRequestClose() {
        setIsOpen(false);
    }

    const icon = (
        <ButtonComponent
            data-resin-target="messageCenterOpenModal"
            data-testid="message-center-unread-count"
            onClick={handleOnClick}
            render={() => (
                <Badgeable
                    className="icon-bell-badge"
                    topRight={
                        <CountBadge isVisible={!!unreadMessageCount} shouldAnimate value={unreadMessageCount || 0} />
                    }
                >
                    <Megaphone20 className="bdl-MessageCenter-icon" />
                </Badgeable>
            )}
        />
    );

    return (
        <span className="bdl-MessageCenter" data-resin-component="messageCenter">
            {isOpen ? (
                <>
                    {icon}
                    <MessageCenterModal
                        apiHost={apiHost}
                        contentPreviewProps={contentPreviewProps}
                        getToken={getToken}
                        messages={messages}
                        onRequestClose={onRequestClose}
                        overscanRowCount={overscanRowCount}
                    />
                </>
            ) : (
                <>{icon}</>
            )}
        </span>
    );
}

export default MessageCenter;
