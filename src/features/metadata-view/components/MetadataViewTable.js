// @flow
import * as React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table/index';
import { injectIntl } from 'react-intl';

import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import Header from './Header';
import IntegerCell from './IntegerCell';
import DateCell from './DateCell';
import StringCell from './StringCell';
import EnumCell from './EnumCell';
import NameCell from './NameCell';
import MultiSelectCell from './MultiSelectCell';
import FloatCell from './FloatCell';

import type { Template, TemplateField } from '../../metadata-instance-editor/flowTypes';

import '../styles/MetadataView.scss';

type Props = {
    columns: Array<Object>,
    columnWidths: Object,
    height: number,
    items: Array<any>,
    intl: Object,
    tableHeaderHeight: number,
    tableHeight: number,
    tableRowHeight: number,
    template: Template,
    totalWidth: number,
    width: number,
};

type State = {
    visibleColumns: Array<any>,
    widths: Object,
};

type resizeRowArgs = {
    dataKey: string,
    deltaX: number,
};

const keyMap = {
    date: DateCell,
    enum: EnumCell,
    float: FloatCell,
    integer: IntegerCell,
    multiSelect: MultiSelectCell,
    name: NameCell,
    string: StringCell,
};

class MetadataViewTable extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            visibleColumns: [],
            widths: {},
        };

        this.resizeRow = throttle(this.resizeRow, 25);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        const { template } = nextProps;
        const { fields = [] } = template;
        const didChangeColumnCount =
            nextProps.columns.filter(column => column.isChecked).length !== prevState.visibleColumns.length;

        const didReorderColumns = nextProps.columns.some((column, index) => {
            const prevColumn = prevState.visibleColumns[index];
            if (!prevColumn || !column) {
                return true;
            }
            return column.key !== prevColumn.key;
        });

        if (didChangeColumnCount || didReorderColumns) {
            const visibleColumns = [];
            const columnWidths = {};
            nextProps.columns.forEach(visibleColumn => {
                fields.forEach(field => {
                    if (visibleColumn.key === field.key && visibleColumn.isChecked === true) {
                        visibleColumns.push(field);
                    }
                });
            });

            visibleColumns.forEach(column => {
                columnWidths[column.key] = 1 / visibleColumns.length;
            });

            return {
                visibleColumns,
                widths: didChangeColumnCount ? columnWidths : prevState.widths,
            };
        }
        return null;
    }

    renderOptionalColumns = () => {
        const { intl, width } = this.props;
        const { visibleColumns, widths } = this.state;

        return visibleColumns.map((templateField: TemplateField, index: number) => {
            const { displayName, key, type } = templateField;

            const isNameCell = key === 'name';

            let CellComponent;

            if (isNameCell) {
                CellComponent = keyMap.name;
            } else {
                CellComponent = keyMap[type];
            }

            return (
                <Column
                    cellRenderer={cellData => <CellComponent cellData={cellData} intl={intl} />}
                    className="cell-text-content-container"
                    dataKey={key}
                    headerRenderer={headerData => (
                        <Header
                            headerData={headerData}
                            resizeRow={this.resizeRow}
                            shouldRenderResizeColumnIcon={!isNameCell}
                        />
                    )}
                    key={`metadataview-column-${key}-${index}`}
                    label={displayName}
                    minWidth={45}
                    width={widths[key] * width}
                />
            );
        });
    };

    resizeRow = ({ dataKey, deltaX }: resizeRowArgs) => {
        this.setState(prevState => {
            const prevWidths = prevState.widths;
            const percentDelta = deltaX / this.props.totalWidth;
            const previousColumn = this.getPreviousColumn(dataKey);

            if (!isEmpty(prevWidths)) {
                return {
                    widths: {
                        ...prevWidths,
                        [dataKey]: prevWidths[dataKey] - percentDelta,
                        [previousColumn.key]: prevWidths[previousColumn.key] + percentDelta,
                    },
                };
            }
        });
        return {};
    };

    getPreviousColumn = (dataKey: string) => {
        const { visibleColumns } = this.state;

        return visibleColumns[visibleColumns.findIndex(column => column.key === dataKey) - 1];
    };

    render() {
        const { height, items, tableHeaderHeight, tableRowHeight, width } = this.props;

        return (
            <Table
                height={height}
                headerClassName="table-header"
                headerHeight={tableHeaderHeight}
                rowHeight={tableRowHeight}
                rowClassName="table-header-row-container"
                rowCount={items.length}
                rowGetter={({ index }) => items[index]}
                minWidth
                width={width}
            >
                {this.renderOptionalColumns()}
            </Table>
        );
    }
}

export { MetadataViewTable as MetadataTable };
export default injectIntl(MetadataViewTable);
