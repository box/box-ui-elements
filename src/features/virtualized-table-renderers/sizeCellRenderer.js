// @flow
import baseCellRenderer from './baseCellRenderer';
import getSize from '../../utils/size';
import type { CellRendererParams } from './flowTypes';

const sizeCellRenderer = (multiplier: number = 1) => (cellRendererParams: CellRendererParams) =>
    baseCellRenderer(cellRendererParams, cellValue => getSize(Number(cellValue) * multiplier));

export default sizeCellRenderer;
