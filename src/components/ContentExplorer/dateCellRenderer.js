/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import getDate from '../../util/date';

export default (getLocalizedMessage: Function) => ({ cellData }: { cellData: string }) =>
    <span>
        {getDate(cellData, getLocalizedMessage('buik.date.today'), getLocalizedMessage('buik.date.yesterday'))}
    </span>;
