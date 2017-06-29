/**
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import getDate from '../../util/date';

/* eslint-disable react/prop-types */
export default (getLocalizedMessage) => ({ cellData }) =>
    <span>
        {getDate(cellData, getLocalizedMessage('buik.date.today'), getLocalizedMessage('buik.date.yesterday'))}
    </span>;
