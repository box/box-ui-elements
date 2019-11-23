// @flow
import { formatDateTime } from '../../utils/datetime';

import baseCellRenderer from './baseCellRenderer';

import type { CellRendererParams } from './flowTypes';

const dateCellRenderer = (cellRendererParams: CellRendererParams) =>
    baseCellRenderer(cellRendererParams, cellValue => formatDateTime(cellValue));

export default dateCellRenderer;
