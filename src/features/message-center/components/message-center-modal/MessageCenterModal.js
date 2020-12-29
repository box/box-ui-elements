// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type InjectIntlProvidedProps } from 'react-intl';
import classNames from 'classnames';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import debounce from 'lodash/debounce';
import AnimateHeight from 'react-animate-height';
import Scrollbar from 'react-scrollbars-custom';
import type { Token } from '../../../../common/types/core';
import Modal from '../../../../components/modal/Modal';
import CategorySelector from '../../../../components/category-selector/CategorySelector';

import CollapsibleScrollbar from '../collapsibile-scrollbar/CollapsibleScrollbar';
import Message from '../message/Message';
import intlMessages from '../../messages';
import type { ContentPreviewProps, EligibleMessageCenterMessage } from '../../types';
import './MessageCenterModal.scss';
import PreviewGhost from '../templates/common/PreviewGhost';
import ContentGhost from '../templates/common/ContentGhost';
import BottomContentWrapper from '../templates/common/BottomContentWrapper';
import ErrorState from '../error-state/ErrorState';
import EmptyState from './EmptyState';

type Props = {|
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (fileId: string) => Promise<Token>,
    messages: Array<EligibleMessageCenterMessage> | null | Error,
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
}: Props & InjectIntlProvidedProps) {
    const categories = React.useMemo(() => {
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
    }, [intl]);
    const listRef = React.useRef(null);
    const isMouseInTitleRef = React.useRef(false);
    const [category, setCategory] = React.useState(categories[0].value);
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
        </section>
    );

    const filteredMessages = React.useMemo(() => {
        if (!messages || messages instanceof Error) {
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

    function rowRenderer({ index, parent, style }: Object) {
        const message = filteredMessages[index];
        return (
            <CellMeasurer key={message.id} cache={cache} columnIndex={0} parent={parent} rowIndex={index}>
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

    const handlOnResize = React.useCallback(debounce(handleResize, 300), []);

    function renderMessages(width: number, height: number): React.Node {
        if (!messages) {
            return (
                <div className="bdl-MessageCenterModal-message">
                    <div className="bdl-MessageCenterModal-ghost">
                        <PreviewGhost />
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
            focusElementSelector=".bdl-CategorySelector .is-selected"
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
