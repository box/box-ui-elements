/**
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import getSize from '../../util/size';

/* eslint-disable react/prop-types */
export default () => ({ cellData }) => <span>{getSize(cellData)}</span>;
