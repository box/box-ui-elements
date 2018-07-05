/**
 * @flow
 * @file Busy indicator for cards
 * @author Box
 */

import * as React from 'react';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator';
import './BusyIndicator.scss';

const BusyIndicator = () => (
    <div className='bcs-is-busy'>
        <LoadingIndicator />
    </div>
);

export default BusyIndicator;
