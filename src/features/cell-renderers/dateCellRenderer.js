// @flow
import * as React from 'react';
import baseCellRenderer from './baseCellRenderer';
import type { CellRendererParams } from './flowTypes';
import ReadableTime from '../../components/time/ReadableTime';

const dateCellRenderer = (cellRendererParams: CellRendererParams) =>
    baseCellRenderer(cellRendererParams, cellValue => (
        <ReadableTime timestamp={Date.parse(cellValue)} alwaysShowTime />
    ));

export default dateCellRenderer;
