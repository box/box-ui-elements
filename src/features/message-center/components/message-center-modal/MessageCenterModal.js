// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import classNames from 'classnames';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from '@box/react-virtualized';
import debounce from 'lodash/debounce';
import AnimateHeight from 'react-animate-height';
import Scrollbar from 'react-scrollbars-custom';
import type { Token } from '../../../../common/types/core';
import Modal from '../../../../components/modal/Modal';
import CategorySelector from '../../../../components/category-selector/CategorySelector';

import CollapsibleScrollbar from '../collapsibile-scrollbar/CollapsibleScrollbar';
import Message from '../message/Message';
import intlMessages from '../../messages';
import type { EligibleMessageCenterMessage } from '../../types';
import type { ContentPreviewProps } from '../../../message-preview-content/MessagePreviewContent';
import './MessageCenterModal.scss';
import MessagePreviewGhost from '../../../message-preview-ghost/MessagePreviewGhost';
import ContentGhost from '../templates/common/ContentGhost';
import BottomContentWrapper from '../templates/common/BottomContentWrapper';
import ErrorState from '../error-state/ErrorState';
import EmptyState from './EmptyState';

type Props = {|
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (fileId: string) => Promise<Token>,
    intl: IntlShape,
    messages: Array<EligibleMessageCenterMessage> | null | Error,
    onMessageShown: EligibleMessageCenterMessage => void,
    onRequestClose: () => void,
    overscanRowCount?: number,
|};

const ALL = 'all';
const cache = new CellMeasurerCache({
    defaultHeight: 400,
    fixedWidth: true,
});

const SCROLLBAR_MARGIN = 16;
const listStyle = { overflowX: false, overflowY: false };
const trackYStyles = { marginLeft: `${SCROLLBAR_MARGIN}px` };

function MessageCenterModal({
    apiHost,
    contentPreviewProps,
    onRequestClose,
    messages,
    getToken,
    intl,
    overscanRowCount = 1,
    onMessageShown,
}: Props) {
    const categories: Array<{ displayText: string, value: string }> | null = React.useMemo(() => {
        if (!Array.isArray(messages)) {
            return null;
        }

        const messageCategoriesSet = new Set<string>();
        messages.forEach(({ templateParams: { category } }) => {
            messageCategoriesSet.add(category);
        });

        if (messageCategoriesSet.size <= 1) {
            return null;
        }

        return [
            {
                value: ALL,
                displayText: intl.formatMessage(intlMessages.all),
            },
            {
                value: 'product',
                displayText: intl.formatMessage(intlMessages.product),
            },
            {
                value: 'events',
                displayText: intl.formatMessage(intlMessages.events),
            },
            {
                value: 'education',
                displayText: intl.formatMessage(intlMessages.boxEducation),
            },
        ];
    }, [intl, messages]);
    const listRef = React.useRef(null);
    const isMouseInTitleRef = React.useRef(false);
    const messageLoadCacheRef = React.useRef(new Map<number, boolean>());
    const [category, setCategory] = React.useState(ALL);
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    const scrollRef = React.useRef<{ scrollbarRef: React.ElementRef<typeof Scrollbar> } | null>(null);

    const title = (
        <section
            className={classNames('bdl-MessageCenterModal-title', {
                'is-expanded': isExpanded,
                'is-collapsed': !isExpanded,
            })}
            data-testid="modal-title"
            onMouseEnter={() => {
                isMouseInTitleRef.current = true;
                setIsExpanded(true);
            }}
            onMouseLeave={() => {
                isMouseInTitleRef.current = false;
            }}
        >
            <div className="bdl-MessageCenterModal-whatsNew">
                <FormattedMessage {...intlMessages.title} />
            </div>
            {categories && (
                <AnimateHeight duration={300} height={isExpanded ? 'auto' : 0}>
                    <section className="bdl-MessageCenterModal-categorySelector">
                        <CategorySelector
                            currentCategory={category}
                            categories={categories}
                            onSelect={value => {
                                cache.clearAll();
                                setCategory(value);
                            }}
                        />
                    </section>
                </AnimateHeight>
            )}
        </section>
    );

    const filteredMessages = React.useMemo(() => {
        if (!Array.isArray(messages)) {
            return [];
        }

        return messages
            .filter(({ templateParams }) => {
                return category === ALL || templateParams.category === category;
            })
            .sort(
                (
                    { activateDate: activateDateA, priority: priorityA },
                    { activateDate: activateDateB, priority: priorityB },
                ) => {
                    // sort by date (descending), secondary sort by priority (descending)
                    if (activateDateA > activateDateB) {
                        return -1;
                    }

                    if (activateDateA < activateDateB) {
                        return 1;
                    }

                    if (priorityA > priorityB) {
                        return -1;
                    }

                    if (priorityA < priorityB) {
                        return 1;
                    }

                    return 0;
                },
            );
    }, [category, messages]);

    React.useEffect(() => {
        if (scrollRef.current && scrollRef.current.scrollbarRef && scrollRef.current.scrollbarRef.current) {
            scrollRef.current.scrollbarRef.current.scrollToTop();
        }
    }, [category]);

    function rowRenderer({ index, parent, style, isVisible }: Object) {
        const message = filteredMessages[index];
        const messageId = message.id;
        const isFirstTimeBeingShown = !messageLoadCacheRef.current.has(messageId);
        if (isVisible && isFirstTimeBeingShown) {
            messageLoadCacheRef.current.set(messageId, true);
            onMessageShown(message);
        }

        return (
            <CellMeasurer key={messageId} cache={cache} columnIndex={0} parent={parent} rowIndex={index}>
                {({ registerChild }) => (
                    <div
                        ref={registerChild}
                        className="bdl-MessageCenterModal-message"
                        style={style}
                        data-testid="messagecentermodalmessage"
                    >
                        <Message
                            contentPreviewProps={contentPreviewProps}
                            apiHost={apiHost}
                            {...message}
                            getToken={getToken}
                        />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    function handleOnScroll(clientHeight, scrollTop, prevClientHeight, prevScrollTop) {
        if (clientHeight > 0 && clientHeight === prevClientHeight && !isMouseInTitleRef.current) {
            const isScrollingDown = prevScrollTop < scrollTop;
            if (isExpanded && isScrollingDown) {
                setIsExpanded(false);
            } else if (!isExpanded && !isScrollingDown) {
                setIsExpanded(true);
            }
        }
    }

    function handleResize(resizeDimensions) {
        setDimensions(resizeDimensions);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handlOnResize = React.useCallback(debounce(handleResize, 300), []);

    function renderMessages(width: number, height: number): React.Node {
        if (!messages) {
            return (
                <div className="bdl-MessageCenterModal-message">
                    <div className="bdl-MessageCenterModal-ghost">
                        <MessagePreviewGhost />
                        <BottomContentWrapper>
                            <ContentGhost />
                        </BottomContentWrapper>
                    </div>
                </div>
            );
        }

        return (
            <List
                ref={listRef}
                className="bdl-MessageCenterModal-list"
                deferredMeasurementCache={cache}
                height={dimensions.height || height}
                noRowsRenderer={EmptyState}
                overscanRowCount={overscanRowCount}
                rowCount={filteredMessages.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                scrollToIndex={0}
                style={listStyle}
                width={width - SCROLLBAR_MARGIN}
            />
        );
    }

    return (
        <Modal
            className="bdl-MessageCenterModal"
            data-resin-component="messageCenterModal"
            data-testid="messagecentermodal"
            isOpen
            onRequestClose={onRequestClose}
            title={title}
        >
            <section className="bdl-MessageCenterModal-messages">
                <AutoSizer onResize={handlOnResize}>
                    {({ height, width }) => (
                        <CollapsibleScrollbar
                            ref={scrollRef}
                            onScroll={(
                                { clientHeight, scrollTop, scrollLeft },
                                { clientHeight: prevClientHeight, scrollTop: prevScrollTop },
                            ) => {
                                handleOnScroll(clientHeight, scrollTop, prevClientHeight, prevScrollTop);
                                if (listRef.current && listRef.current.Grid) {
                                    const { Grid } = listRef.current;
                                    Grid.handleScrollEvent({ scrollTop, scrollLeft });
                                }
                            }}
                            permanentTrackY
                            style={{ width, height }}
                            trackYStyles={trackYStyles}
                        >
                            {messages instanceof Error ? (
                                <ErrorState>
                                    <FormattedMessage {...intlMessages.errorFetchingPosts} />
                                </ErrorState>
                            ) : (
                                renderMessages(width, height)
                            )}
                        </CollapsibleScrollbar>
                    )}
                </AutoSizer>
            </section>
        </Modal>
    );
}

export default injectIntl(MessageCenterModal);
