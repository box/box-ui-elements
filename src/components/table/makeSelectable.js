import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Set } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { Hotkeys, HotkeyRecord } from '../hotkeys';
import messages from './messages';

import shiftSelect from './shiftSelect';

const SEARCH_TIMER_DURATION = 1000;

function makeSelectable(BaseTable) {
    const originalDisplayName = BaseTable.displayName || BaseTable.name || 'Table';

    return class SelectableTable extends Component {
        static displayName = `Selectable(${originalDisplayName})`;

        static propTypes = {
            className: PropTypes.string,
            /** Array of unique IDs of the items in the table. Each item should be a string or number, in the order they appear in the table. */
            data: PropTypes.array.isRequired,
            /** Called when focus changes. `(focusedIndex: number) => void` */
            onFocus: PropTypes.func,
            /** Called when selection changes. `(selectedItems: Array<string> | Array<number> | Set<string> | Set<number>) => void` */
            onSelect: PropTypes.func.isRequired,
            /**
             * Array of strings for keyboard search corresponding to the data prop. If not provided, keyboard search won't work.
             * Example: data = ['f_123', 'f_456'], and corresponding searchStrings = ['file.png', 'another file.pdf']
             */
            searchStrings: PropTypes.array,
            /**
             * Array of IDs that are currently selected, in any order.
             * If you pass a native JS array, then your onSelect function will be called with a native JS array;
             * likewise, if you pass an ImmutableJS Set, then your onSelect function will be called
             * with an ImmutableJS Set.
             */
            selectedItems: PropTypes.oneOfType([PropTypes.array, ImmutablePropTypes.set]),
            enableHotkeys: PropTypes.bool,
            /** Translated type for hotkeys. If not provided, then the hotkeys will not appear in the help modal. */
            hotkeyType: PropTypes.string,
        };

        static defaultProps = {
            selectedItems: new Set(),
        };

        constructor(props) {
            super(props);

            this.anchorIndex = 0;

            this.searchString = '';
            this.searchTimeout = null;

            // we have to store the previously focused index because a focus event
            // will be fired before the click event; thus, in the click handler,
            // the focusedItem will already be the new item
            this.previousIndex = 0;

            this.blurTimerID = null;
        }

        state = {
            focusedIndex: undefined,
        };

        componentDidMount() {
            document.addEventListener('keypress', this.handleKeyboardSearch);
        }

        componentDidUpdate(prevProps, prevState) {
            if (prevState.focusedIndex !== this.state.focusedIndex && this.props.onFocus) {
                this.props.onFocus(this.state.focusedIndex);
            }
        }

        componentWillUnmount() {
            document.removeEventListener('keypress', this.handleKeyboardSearch);
            clearTimeout(this.blurTimerID);
        }

        onSelect = (selectedItems, newFocusedIndex) => {
            const { onSelect } = this.props;

            this.previousIndex = this.state.focusedIndex || 0;

            this.setState({
                focusedIndex: newFocusedIndex,
            });

            if (onSelect) {
                // If selectedItems were given as an Immutable Set, they should also be returned as one,
                // and vice versa if they were given as a native JS array
                onSelect(Set.isSet(this.props.selectedItems) ? selectedItems : selectedItems.toJS());
            }
        };

        getHotkeyConfigs = () => {
            const { enableHotkeys, hotkeyType } = this.props;

            if (!enableHotkeys && !this.hotkeys) {
                this.hotkeys = [];
            }

            if (!this.hotkeys) {
                this.hotkeys = [
                    new HotkeyRecord({
                        key: 'down',
                        description: <FormattedMessage {...messages.downDescription} />,
                        handler: event => {
                            const { data } = this.props;
                            const { focusedIndex } = this.state;

                            event.preventDefault();

                            const newFocusedIndex =
                                focusedIndex !== undefined ? Math.min(focusedIndex + 1, data.length - 1) : 0;
                            this.setState({ focusedIndex: newFocusedIndex });
                        },
                        type: hotkeyType,
                    }),
                    new HotkeyRecord({
                        key: 'up',
                        description: <FormattedMessage {...messages.upDescription} />,
                        handler: event => {
                            const { focusedIndex = 0 } = this.state;

                            event.preventDefault();

                            const newFocusedIndex = Math.max(focusedIndex - 1, 0);
                            this.setState({ focusedIndex: newFocusedIndex });
                        },
                        type: hotkeyType,
                    }),
                    new HotkeyRecord({
                        key: 'shift+x',
                        description: <FormattedMessage {...messages.shiftXDescription} />,
                        handler: () => {
                            const { focusedIndex } = this.state;

                            if (focusedIndex === undefined) {
                                return;
                            }

                            this.selectToggle(focusedIndex);
                        },
                        type: hotkeyType,
                    }),
                    new HotkeyRecord({
                        key: ['meta+a', 'ctrl+a'],
                        description: <FormattedMessage {...messages.selectAllDescription} />,
                        handler: event => {
                            const { data } = this.props;

                            event.preventDefault();

                            this.onSelect(new Set(data), this.state.focusedIndex);
                        },
                        type: hotkeyType,
                    }),
                    new HotkeyRecord({
                        key: 'shift+down',
                        description: <FormattedMessage {...messages.shiftDownDescription} />,
                        handler: () => {
                            const { data } = this.props;
                            const { focusedIndex } = this.state;

                            if (focusedIndex === undefined) {
                                return;
                            }

                            const newFocusedIndex = Math.min(focusedIndex + 1, data.length - 1);
                            this.handleShiftKeyDown(newFocusedIndex, data.length - 1);
                        },
                        type: hotkeyType,
                    }),
                    new HotkeyRecord({
                        key: 'shift+up',
                        description: <FormattedMessage {...messages.shiftUpDescription} />,
                        handler: () => {
                            const { focusedIndex } = this.state;

                            if (focusedIndex === undefined) {
                                return;
                            }

                            const newFocusedIndex = Math.max(focusedIndex - 1, 0);
                            this.handleShiftKeyDown(newFocusedIndex, 0);
                        },
                        type: hotkeyType,
                    }),
                    new HotkeyRecord({
                        key: 'esc',
                        description: <FormattedMessage {...messages.deselectAllDescription} />,
                        handler: () => {
                            this.onSelect(new Set(), this.state.focusedIndex);
                        },
                        type: hotkeyType,
                    }),
                ];
            }

            return this.hotkeys;
        };

        getProcessedProps = () => {
            const { selectedItems } = this.props;
            return {
                ...this.props,
                selectedItems: Set.isSet(selectedItems) ? selectedItems : new Set(selectedItems),
            };
        };

        hotkeys = null;

        selectToggle = rowIndex => {
            const { data, selectedItems } = this.getProcessedProps();

            if (selectedItems.has(data[rowIndex])) {
                this.onSelect(selectedItems.delete(data[rowIndex]), rowIndex);
            } else {
                this.onSelect(selectedItems.add(data[rowIndex]), rowIndex);
            }

            this.anchorIndex = rowIndex;
        };

        selectRange = rowIndex => {
            const { data, selectedItems } = this.getProcessedProps();

            // Don't change selection if we're shift-clicking the same row
            if (rowIndex === this.previousIndex) {
                return;
            }

            // Converts set of items to set of indices to do some slicing magic
            const selectedRows = new Set(
                data.reduce((rows, item, i) => {
                    if (selectedItems.has(item)) {
                        rows.push(i);
                    }
                    return rows;
                }, []),
            );

            const newSelectedRows = shiftSelect(selectedRows, this.previousIndex, rowIndex, this.anchorIndex);

            // Converts set back to set of items
            const newSelectedItems = newSelectedRows.map(i => data[i]);

            this.onSelect(newSelectedItems, rowIndex);
        };

        selectOne = rowIndex => {
            const { data, selectedItems } = this.getProcessedProps();

            // Don't change selection if we're clicking on a row that we've already selected
            // This allows us to use the native onDoubleClick handler because we're referencing the
            // same DOM node on double-click.
            if (selectedItems.has(data[rowIndex]) && selectedItems.size === 1) {
                return;
            }

            this.onSelect(new Set([data[rowIndex]]), rowIndex);
            this.anchorIndex = rowIndex;
        };

        clearFocus = () => {
            this.setState({
                focusedIndex: undefined,
            });
        };

        handleRowClick = (event, index) => {
            if (event.metaKey || event.ctrlKey) {
                this.selectToggle(index);
            } else if (event.shiftKey) {
                this.selectRange(index);
            } else {
                this.selectOne(index);
            }
        };

        handleRowFocus = (event, index) => {
            const { selectedItems } = this.getProcessedProps();
            this.onSelect(selectedItems, index);
        };

        handleTableBlur = () => {
            const { focusedIndex } = this.state;
            if (focusedIndex !== undefined) {
                // table may get focus back right away in the same tick, in which case we shouldn't clear focus
                this.blurTimerID = setTimeout(this.clearFocus);
            }
        };

        handleTableFocus = () => {
            clearTimeout(this.blurTimerID);
        };

        handleShiftKeyDown = (newFocusedIndex, boundary) => {
            const { data, selectedItems } = this.getProcessedProps();
            const { focusedIndex } = this.state;

            // if we're at a boundary of the table and the row is selected, no-op
            if (focusedIndex === boundary && selectedItems.has(data[focusedIndex])) {
                return;
            }

            // if target is not selected, select it
            if (!selectedItems.has(data[newFocusedIndex])) {
                this.onSelect(selectedItems.add(data[newFocusedIndex]), newFocusedIndex);
                return;
            }

            // if both source and target are selected, deselect source
            if (selectedItems.has(data[newFocusedIndex]) && selectedItems.has(data[focusedIndex])) {
                this.onSelect(selectedItems.delete(data[focusedIndex]), newFocusedIndex);
                return;
            }

            // if target is selected and source is not, select source
            this.onSelect(selectedItems.add(data[focusedIndex]), newFocusedIndex);
        };

        handleKeyboardSearch = event => {
            const { searchStrings } = this.props;

            if (!searchStrings) {
                return;
            }

            if (
                event.target.hasAttribute('contenteditable') ||
                event.target.nodeName === 'INPUT' ||
                event.target.nodeName === 'TEXTAREA'
            ) {
                return;
            }

            // character keys have a value for event.which
            if (event.which === 0) {
                return;
            }

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchString += event.key;
            this.searchTimeout = setTimeout(() => {
                this.searchString = '';
            }, SEARCH_TIMER_DURATION);

            const index = searchStrings.findIndex(
                string =>
                    string
                        .trim()
                        .toLowerCase()
                        .indexOf(this.searchString) === 0,
            );

            if (index !== -1) {
                this.setState({ focusedIndex: index });
            }
        };

        render() {
            const { className, data } = this.props;
            const { focusedIndex } = this.state;
            const focusedItem = data[focusedIndex];

            return (
                <Hotkeys configs={this.getHotkeyConfigs()}>
                    <BaseTable
                        {...this.props}
                        className={classNames(className, 'is-selectable')}
                        focusedIndex={focusedIndex}
                        focusedItem={focusedItem}
                        onRowClick={this.handleRowClick}
                        onRowFocus={this.handleRowFocus}
                        onTableBlur={this.handleTableBlur}
                        onTableFocus={this.handleTableFocus}
                    />
                </Hotkeys>
            );
        }
    };
}

export default makeSelectable;
