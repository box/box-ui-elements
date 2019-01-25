// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import { Flyout, Overlay } from 'components/flyout';
import Button from 'components/button/Button';
import Checkbox from 'components/checkbox/Checkbox';
import DraggableList from 'components/draggable-list';
import PortaledDraggableListItem from 'components/draggable-list/PortaledDraggableListItem';
import MenuToggle from 'components/dropdown-menu/MenuToggle';
import PrimaryButton from 'components/primary-button/PrimaryButton';
import reorder from 'components/draggable-list/draggable-list-utils/reorder';
import IconMetadataColumns from '../../../icons/metadata-view/IconMetadataColumns';

import type { Template } from '../../metadata-instance-editor/flowTypes';
import type { ColumnType } from '../flowTypes';

import messages from '../messages';

type State = {
    isColumnMenuOpen: boolean,
    listId: string,
    unsavedVisibleColumns: Array<ColumnType>,
};

type Props = {
    onColumnChange?: Function,
    template?: Template,
    visibleColumns?: Array<ColumnType>,
};

class ColumnButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isColumnMenuOpen: false,
            listId: uniqueId(),
            unsavedVisibleColumns: props.visibleColumns ? props.visibleColumns.slice(0) : [],
        };
    }

    onDragEnd = (sourceIndex: number, destinationIndex: number) => {
        const { unsavedVisibleColumns } = this.state;
        const columns = reorder(unsavedVisibleColumns, sourceIndex, destinationIndex);
        this.setState({
            unsavedVisibleColumns: columns.slice(0),
        });
    };

    onClose = () => {
        this.setState({
            isColumnMenuOpen: false,
        });
    };

    onOpen = () => {
        const { visibleColumns } = this.props;
        this.setState({
            isColumnMenuOpen: true,
            unsavedVisibleColumns: visibleColumns,
        });
    };

    toggleColumnButton = () => {
        this.setState({ isColumnMenuOpen: !this.state.isColumnMenuOpen });
    };

    updateUnsavedVisibleColumns = (column: ColumnType) => {
        const { unsavedVisibleColumns } = this.state;

        const unsavedVisibleColumnsCopy = unsavedVisibleColumns.slice(0);

        const newColumn = { ...column, isChecked: !column.isChecked };

        const foundIndex = unsavedVisibleColumnsCopy.findIndex(originalColumn => originalColumn.id === column.id);

        unsavedVisibleColumnsCopy[foundIndex] = newColumn;

        this.setState({
            unsavedVisibleColumns: unsavedVisibleColumnsCopy,
        });
    };

    applyFilters = () => {
        const { onColumnChange } = this.props;
        const { unsavedVisibleColumns } = this.state;
        if (onColumnChange) {
            onColumnChange(unsavedVisibleColumns);
        }
    };

    getNumberOfHiddenColumns = () => {
        const { visibleColumns } = this.props;

        return visibleColumns
            ? visibleColumns.reduce((total, column) => {
                  if (!column.isChecked) {
                      return total + 1;
                  }
                  return total;
              }, 0)
            : 0;
    };

    render() {
        const { template } = this.props;
        const { listId, unsavedVisibleColumns } = this.state;

        const numberOfHiddenColumns = this.getNumberOfHiddenColumns();

        const buttonClasses = classNames('query-bar-button', numberOfHiddenColumns !== 0 ? 'is-active' : '');

        return (
            <Flyout
                className="query-bar-column-dropdown-flyout"
                closeOnClick
                closeOnClickOutside
                onClose={this.onClose}
                onOpen={this.onOpen}
                position="bottom-right"
            >
                <Button
                    className={buttonClasses}
                    isDisabled={template === undefined}
                    onClick={this.toggleColumnButton}
                    type="button"
                >
                    <MenuToggle>
                        <IconMetadataColumns />
                        <span className="button-label">
                            {numberOfHiddenColumns === 0 ? (
                                <FormattedMessage {...messages.columnsButtonText} />
                            ) : (
                                <FormattedMessage
                                    {...messages.columnsHiddenButtonText}
                                    values={{
                                        number: numberOfHiddenColumns,
                                    }}
                                />
                            )}
                        </span>
                    </MenuToggle>
                </Button>

                <Overlay>
                    <div className="column-button-dropdown">
                        <div className="column-button-dropdown-header">
                            <DraggableList
                                className="draggable-list-example"
                                listId={listId}
                                onDragEnd={this.onDragEnd}
                            >
                                {unsavedVisibleColumns.map((item, index) => {
                                    // We skip the first index as it's always the name column, and that can't be modified
                                    if (index !== 0) {
                                        return (
                                            <PortaledDraggableListItem
                                                id={item.id}
                                                index={index}
                                                isDraggableViaHandle
                                                key={index}
                                            >
                                                <Checkbox
                                                    isChecked={item.isChecked}
                                                    label={item.label}
                                                    name={item.label}
                                                    onChange={() => this.updateUnsavedVisibleColumns(item)}
                                                />
                                            </PortaledDraggableListItem>
                                        );
                                    }
                                    return null;
                                })}
                            </DraggableList>
                        </div>
                        <div className="column-button-dropdown-footer">
                            <PrimaryButton type="button" onClick={this.applyFilters}>
                                <FormattedMessage {...messages.applyFiltersButtonText} />
                            </PrimaryButton>
                        </div>
                    </div>
                </Overlay>
            </Flyout>
        );
    }
}

export default ColumnButton;
