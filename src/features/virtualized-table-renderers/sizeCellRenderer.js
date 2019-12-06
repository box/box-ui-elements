// @flow
import baseCellRenderer from './baseCellRenderer';
import getSize from '../../utils/size';
import type { CellRendererParams } from './flowTypes';
import { DEFAULT_MULTIPLIER } from './constants';

const sizeCellRenderer = (multiplier: number = DEFAULT_MULTIPLIER) => (cellRendererParams: CellRendererParams) =>
    baseCellRenderer(cellRendererParams, cellValue => getSize(Number(cellValue) * multiplier));

export default sizeCellRenderer;
