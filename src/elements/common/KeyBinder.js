/**
 * @flow
 * @file Item List Key bindings
 * @author Box
 */

import React, { PureComponent } from 'react';
import noop from 'lodash/noop';
import { isInputElement } from '../../utils/dom';
import type { BoxItem } from '../../common/types/core';

type Props = {
    children: Function,
    className: string,
    columnCount: number,
    id: string | void,
    items: BoxItem[],
    onDelete: Function,
    onDownload: Function,
    onOpen: Function,
    onRename: Function,
    onScrollToChange: Function,
    onSelect: Function,
    onShare: Function,
    rowCount: number,
    scrollToColumn: number,
    scrollToRow: number,
};

type State = {
    focusOnRender: boolean,
    prevId: string | void,
    prevScrollToColumn: number,
    prevScrollToRow: number,
    scrollToColumn: number,
    scrollToRow: number,
};

class KeyBinder extends PureComponent<Props, State> {
    state: State;

    props: Props;

    columnStartIndex: number;

    columnStopIndex: number;

    rowStartIndex: number;

    rowStopIndex: number;

    static defaultProps = {
        scrollToColumn: 0,
        scrollToRow: 0,
        onRename: noop,
        onShare: noop,
        onDownload: noop,
        onOpen: noop,
        onSelect: noop,
        onDelete: noop,
    };

    /**
     * Resets scroll position if props change
     * @private
     * @inheritdoc
     * @return {State|null}
     */
    static getDerivedStateFromProps(props: Props, state: State) {
        const { prevId, prevScrollToColumn, prevScrollToRow }: State = state;
        const { id, scrollToColumn: scrollToColumnProp, scrollToRow: scrollToRowProp }: Props = props;

        if (id !== prevId) {
            return {
                focusOnRender: false,
                prevId: id,
                prevScrollToColumn: 0,
                prevScrollToRow: 0,
                scrollToColumn: 0,
                scrollToRow: 0,
            };
        }

        const newState = {};

        if (prevScrollToColumn !== scrollToColumnProp && prevScrollToRow !== scrollToRowProp) {
            newState.prevScrollToColumn = scrollToColumnProp;
            newState.prevScrollToRow = scrollToRowProp;
            newState.scrollToColumn = scrollToColumnProp;
            newState.scrollToRow = scrollToRowProp;
        } else if (scrollToRowProp !== prevScrollToRow) {
            newState.prevScrollToRow = scrollToRowProp;
            newState.scrollToRow = scrollToRowProp;
        } else if (scrollToColumnProp !== prevScrollToColumn) {
            newState.prevScrollToColumn = scrollToColumnProp;
            newState.scrollToColumn = scrollToColumnProp;
        }

        return Object.keys(newState).length ? newState : null;
    }

    /**
     * [constructor]
     *
     * @private
     * @return {KeyBinder}
     */
    constructor(props: Props) {
        super(props);

        const { id, scrollToRow, scrollToColumn }: Props = props;
        this.state = {
            focusOnRender: false,
            prevId: id,
            prevScrollToColumn: scrollToColumn,
            prevScrollToRow: scrollToRow,
            scrollToColumn,
            scrollToRow,
        };

        this.columnStartIndex = 0;
        this.columnStopIndex = 0;
        this.rowStartIndex = 0;
        this.rowStopIndex = 0;
    }

    /**
     * Keyboard events
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    onKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        if (isInputElement(event.target)) {
            return;
        }

        const {
            columnCount,
            rowCount,
            onSelect,
            onRename,
            onDownload,
            onShare,
            onDelete,
            onOpen,
            items,
        }: Props = this.props;
        const { scrollToColumn: scrollToColumnPrevious, scrollToRow: scrollToRowPrevious }: State = this.state;
        let { scrollToColumn, scrollToRow }: State = this.state;
        const currentItem: BoxItem = items[scrollToRow];
        const ctrlMeta: boolean = event.metaKey || event.ctrlKey;

        // The above cases all prevent default event event behavior.
        // This is to keep the grid from scrolling after the snap-to update.
        switch (event.key) {
            case 'ArrowDown':
                scrollToRow = ctrlMeta ? rowCount - 1 : Math.min(scrollToRow + 1, rowCount - 1);
                event.stopPropagation(); // To prevent the arrow down capture of parent
                break;
            case 'ArrowLeft':
                scrollToColumn = ctrlMeta ? 0 : Math.max(scrollToColumn - 1, 0);
                break;
            case 'ArrowRight':
                scrollToColumn = ctrlMeta ? columnCount - 1 : Math.min(scrollToColumn + 1, columnCount - 1);
                break;
            case 'ArrowUp':
                scrollToRow = ctrlMeta ? 0 : Math.max(scrollToRow - 1, 0);
                break;
            case 'Enter':
                onOpen(currentItem);
                event.preventDefault();
                break;
            case 'Delete':
                onDelete(currentItem);
                event.preventDefault();
                break;
            case 'X':
                onSelect(currentItem);
                event.preventDefault();
                break;
            case 'D':
                onDownload(currentItem);
                event.preventDefault();
                break;
            case 'S':
                onShare(currentItem);
                event.preventDefault();
                break;
            case 'R':
                onRename(currentItem);
                event.preventDefault();
                break;
            default:
                return;
        }

        if (scrollToColumn !== scrollToColumnPrevious || scrollToRow !== scrollToRowPrevious) {
            event.preventDefault();
            this.updateScrollState({ scrollToColumn, scrollToRow });
        }
    };

    /**
     * Callback for set of rows rendered
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    onSectionRendered = ({
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex,
    }: {
        columnStartIndex: number,
        columnStopIndex: number,
        rowStartIndex: number,
        rowStopIndex: number,
    }): void => {
        this.columnStartIndex = columnStartIndex;
        this.columnStopIndex = columnStopIndex;
        this.rowStartIndex = rowStartIndex;
        this.rowStopIndex = rowStopIndex;
    };

    /**
     * Updates the scroll states
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    updateScrollState({ scrollToColumn, scrollToRow }: { scrollToColumn: number, scrollToRow: number }): void {
        const { onScrollToChange } = this.props;
        onScrollToChange({ scrollToColumn, scrollToRow });
        this.setState({ scrollToColumn, scrollToRow, focusOnRender: true });
    }

    /**
     * Renders the HOC
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    render() {
        const { className, children } = this.props;
        const { scrollToColumn, scrollToRow, focusOnRender }: State = this.state;

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        return (
            <div className={className} onKeyDown={this.onKeyDown}>
                {children({
                    onSectionRendered: this.onSectionRendered,
                    scrollToColumn,
                    scrollToRow,
                    focusOnRender,
                })}
            </div>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
    }
}

export default KeyBinder;
