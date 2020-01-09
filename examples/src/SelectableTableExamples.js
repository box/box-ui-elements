import React, { Component } from 'react'; // eslint-disable-line max-classes-per-file
import PropTypes from 'prop-types';
import { Set } from 'immutable';

import Button from '../../src/components/button';
import ContextMenu from '../../src/components/context-menu';
import DropdownMenu from '../../src/components/dropdown-menu';
import { Menu, MenuItem } from '../../src/components/menu';
import { HotkeyLayer, HotkeyRecord } from '../../src/components/hotkeys';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    makeSelectable,
} from '../../src/components/table';

const columnHeaders = ['First Name', 'Last Name', 'Email'];

const data = [
    ['Weee', 'Yuuu', 'w@example.com'],
    ['Dee', 'Lee', 'd@example.com'],
    ['Jay', 'Chan', 'jchan@example.com'],
    ['Jeff', 'Tool', 'jt@example.com'],
    ['John', 'Doe', 'jdoe@example.com'],
];

// @NOTE: since this component needs a hotkey layer, we're registering hotkeys in this example instead of the hotkey examples
const configs = [
    new HotkeyRecord({
        description: 'Says "hello!"',
        key: 'shift+g',
        handler: () => alert('hello!'), // eslint-disable-line
        type: 'Shortcuts',
    }),
    new HotkeyRecord({
        description: 'Says "hey!"',
        key: ['ctrl+shift+g', 'meta+shift+g'],
        handler: () => alert('hey!'), // eslint-disable-line
        type: 'Other',
    }),
];

// We have to actually focus on the row when the "controlled" focus changes, so that
// the browser's focus state remains in sync with the UI focus state
class FocusableTableRow extends Component {
    static propTypes = {
        className: PropTypes.string,
        isFocused: PropTypes.bool,
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.isFocused && this.props.isFocused) {
            if (this.el) {
                this.el.focus();
            }
        }
    }

    render() {
        const { className, isFocused, ...rest } = this.props;
        return (
            <TableRow
                className={`${className}${isFocused ? ' is-focused' : ''}`}
                rowRef={el => {
                    this.el = el;
                }}
                {...rest}
            />
        );
    }
}

const SelectableTable = makeSelectable(({ className, onRowClick, onRowFocus, focusedItem, selectedItems }) => {
    return (
        <Table className={`has-hover-styles ${className}`}>
            <TableHeader>
                {columnHeaders.map(header => (
                    <TableHeaderCell key={header}>{header}</TableHeaderCell>
                ))}
                <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeader>
            <TableBody>
                {data.map((row, index) => (
                    <ContextMenu key={index}>
                        <FocusableTableRow
                            className={selectedItems.has(row[2]) ? 'is-selected ' : ''}
                            isFocused={row[2] === focusedItem}
                            onClick={event => onRowClick(event, index)}
                            onFocus={event => onRowFocus(event, index)}
                            tabIndex={0}
                        >
                            {row.map(cell => (
                                <TableCell key={cell}>{cell}</TableCell>
                            ))}
                            <TableCell>
                                <DropdownMenu className="dropdown-menu-test">
                                    <Button type="button">•••</Button>
                                    <Menu>
                                        <MenuItem>View Profile</MenuItem>
                                        <MenuItem>Help</MenuItem>
                                    </Menu>
                                </DropdownMenu>
                            </TableCell>
                        </FocusableTableRow>
                        <Menu>
                            <MenuItem>View Profile</MenuItem>
                            <MenuItem>Help</MenuItem>
                        </Menu>
                    </ContextMenu>
                ))}
            </TableBody>
        </Table>
    );
});

// eslint-disable-next-line
class SelectableTableExamples extends Component {
    state = {
        selectedItems: new Set(),
    };

    render() {
        return (
            <HotkeyLayer configs={configs} enableHelpModal>
                <SelectableTable
                    data={data.map(user => user[2])}
                    enableHotkeys
                    hotkeyType="Item Selection"
                    // eslint-disable-next-line react/no-unused-state
                    onSelect={(selectedItems, focusedItem) => this.setState({ selectedItems, focusedItem })}
                    searchStrings={data.map(([firstName, lastName]) => `${firstName} ${lastName}`)}
                    selectedItems={this.state.selectedItems}
                />
            </HotkeyLayer>
        );
    }
}

export default SelectableTableExamples;
