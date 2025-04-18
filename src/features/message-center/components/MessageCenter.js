// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import Megaphone20 from '../../../icon/fill/Megaphone20';
import CountBadge from '../../../components/count-badge/CountBadge';
import Badgeable from '../../../components/badgeable/Badgeable';
import type { Token, StringMap } from '../../../common/types/core';
import MessageCenterModal from './message-center-modal/MessageCenterModal';
import type {
    GetEligibleMessageCenterMessages,
    UnreadEligibleMessageCenterMessageCount,
    EligibleMessageCenterMessage,
} from '../types';
import type { ContentPreviewProps } from '../../message-preview-content/MessagePreviewContent';
import Internationalize from '../../../elements/common/Internationalize';

type Props = {|
    apiHost: string,
    buttonComponent: React.ComponentType<{ render: () => React.Node, badgeCount: null | number }>,
    contentPreviewProps?: ContentPreviewProps,
    getEligibleMessages: () => Promise<GetEligibleMessageCenterMessages>,
    getToken: (fileId: string) => Promise<Token>,
    getUnreadMessageCount: () => Promise<UnreadEligibleMessageCenterMessageCount>,
    language?: string,
    messages?: StringMap,
    onMessageShown?: EligibleMessageCenterMessage => void,
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
    language,
    messages,
    onMessageShown = noop,
}: Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [unreadMessageCount, setUnreadMessageCount] = React.useState(null);
    // TODO: create hook for fetching, loading
    const [eligibleMessages, setEligibleMessages] = React.useState<GetEligibleMessageCenterMessages | null | Error>(
        null,
    );
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
                    setEligibleMessages(eligibleMessagesResponse);
                } catch (err) {
                    setEligibleMessages(err);
                }
                isFetchingMessagesRef.current = false;
            }
        }

        const isOpenAndNoMessages = isOpen && !eligibleMessages;
        // if there are unread messages, prefetch the data as the user is more likely to click on the message center
        const shouldPrefetch = !isOpen && !eligibleMessages && !!unreadMessageCount;
        if (isOpenAndNoMessages || shouldPrefetch) {
            fetchEligibleMessages();
        }
    }, [eligibleMessages, getEligibleMessages, isOpen, unreadMessageCount]);

    function handleOnClick() {
        setIsOpen(prevIsOpen => !prevIsOpen);
        if (unreadMessageCount && unreadMessageCount > 0 && eligibleMessages) {
            try {
                postMarkAllMessagesAsSeen(eligibleMessages);
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
            badgeCount={unreadMessageCount}
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
        <Internationalize messages={messages} language={language}>
            <span className="bdl-MessageCenter" data-resin-component="messageCenter">
                {isOpen ? (
                    <>
                        {icon}
                        <MessageCenterModal
                            apiHost={apiHost}
                            contentPreviewProps={contentPreviewProps}
                            getToken={getToken}
                            messages={eligibleMessages}
                            onRequestClose={onRequestClose}
                            overscanRowCount={overscanRowCount}
                            onMessageShown={onMessageShown}
                        />
                    </>
                ) : (
                    <>{icon}</>
                )}
            </span>
        </Internationalize>
    );
}

export default MessageCenter;
