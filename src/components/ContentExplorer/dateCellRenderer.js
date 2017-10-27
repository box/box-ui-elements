/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import DateField from '../Date';

export default () => ({ cellData }: { cellData: string }) => <DateField date={cellData} />;
