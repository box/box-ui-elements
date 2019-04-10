// @flow
import uniqueId from 'lodash/uniqueId';

import { COLUMN_OPERATORS } from '../../constants';
import type { ConditionType, ColumnType } from '../../flowTypes';

function createInitialCondition(columns?: Array<ColumnType>): ConditionType | null {
    const conditionID = uniqueId();
    const metadataColumns = columns && columns.filter(column => column.source === 'metadata');
    if (metadataColumns && metadataColumns.length > 0) {
        const firstColumn = metadataColumns[0];
        const operator = COLUMN_OPERATORS[firstColumn.type][0].key;

        return {
            columnId: firstColumn.id,
            id: conditionID,
            operator,
            values: [],
        };
    }
    return null;
}

export default createInitialCondition;
