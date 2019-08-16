// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';

import Checkbox from '../../../components/checkbox/Checkbox';
import DraggableList from '../../../components/draggable-list';
import PortaledDraggableListItem from '../../../components/draggable-list/PortaledDraggableListItem';
import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import reorder from '../../../components/draggable-list/draggable-list-utils/reorder';

import type { ColumnType } from '../flowTypes';

import messages from '../messages';

type State = {
    listId: string,
    pendingColumns: Array<ColumnType>,
};

type Props = {
    columns?: Array<ColumnType>,
    onColumnChange?: (columnTypes: Array<ColumnType>) => void,
};

class ColumnButtonOverlay extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            listId: uniqueId(),
            pendingColumns: props.columns ? cloneDeep(props.columns) : [],
        };
    }

    onDragEnd = (sourceIndex: number, destinationIndex: number) => {
        const { pendingColumns } = this.state;
        const columns = reorder(pendingColumns, sourceIndex, destinationIndex);
        this.setState({
            pendingColumns: cloneDeep(columns),
        });
    };

    updatePendingColumns = (column: ColumnType) => {
        const { pendingColumns } = this.state;

        const pendingColumnsCopy = cloneDeep(pendingColumns);

        const newColumn = { ...column, isShown: !column.isShown };

        const foundIndex = pendingColumnsCopy.findIndex(originalColumn => originalColumn.id === column.id);

        pendingColumnsCopy[foundIndex] = newColumn;
        this.setState({
            pendingColumns: pendingColumnsCopy,
        });
    };

    applyFilters = () => {
        const { onColumnChange } = this.props;
        const { pendingColumns } = this.state;
        if (onColumnChange) {
            onColumnChange(pendingColumns);
        }
    };

    getNumberOfHiddenColumns = () => {
        const { columns } = this.props;

        return columns
            ? columns.reduce((total, column) => {
                  if (!column.isShown) {
                      return total + 1;
                  }
                  return total;
              }, 0)
            : 0;
    };

    render() {
        const { listId, pendingColumns } = this.state;

        return (
            <div className="column-button-dropdown">
                <div className="column-button-dropdown-header">
                    <DraggableList className="draggable-list-example" listId={listId} onDragEnd={this.onDragEnd}>
                        {pendingColumns.map((item, index) => {
                            return (
                                <PortaledDraggableListItem id={item.id} index={index} isDraggableViaHandle key={index}>
                                    <Checkbox
                                        isChecked={item.isShown}
                                        label={item.displayName}
                                        name={item.displayName}
                                        onChange={() => this.updatePendingColumns(item)}
                                    />
                                </PortaledDraggableListItem>
                            );
                        })}
                    </DraggableList>
                </div>
                <div className="column-button-dropdown-footer">
                    <PrimaryButton type="button" onClick={this.applyFilters}>
                        <FormattedMessage {...messages.applyFiltersButtonText} />
                    </PrimaryButton>
                </div>
            </div>
        );
    }
}

export default ColumnButtonOverlay;
