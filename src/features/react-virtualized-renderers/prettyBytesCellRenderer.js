// @flow
import { BYTES_IN_MB } from '../../constants';
import baseCellRenderer from './baseCellRenderer';
import getSize from '../../utils/size';

import type { CellRendererParams } from './flowTypes';

const prettyBytesCellRenderer = (multiplier: number = BYTES_IN_MB) => (cellRendererParams: CellRendererParams) =>
    baseCellRenderer(cellRendererParams, cellValue => getSize(Number(cellValue) * multiplier));

export default prettyBytesCellRenderer;
