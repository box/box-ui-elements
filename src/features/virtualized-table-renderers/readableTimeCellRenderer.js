// @flow
import * as React from 'react';
import baseCellRenderer from './baseCellRenderer';
import ReadableTime from '../../components/time/ReadableTime';
import type { CellRendererParams } from './flowTypes';

const readableTimeCellRenderer = (cellRendererParams: CellRendererParams) =>
    baseCellRenderer(cellRendererParams, cellValue => (
        <ReadableTime timestamp={Number.isInteger(cellValue) ? cellValue : Date.parse(cellValue)} alwaysShowTime />
    ));

export default readableTimeCellRenderer;
