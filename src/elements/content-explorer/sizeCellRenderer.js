/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import getSize from '../../utils/size';

export default () => ({ cellData }: { cellData: number }) => <span>{getSize(cellData)}</span>;
