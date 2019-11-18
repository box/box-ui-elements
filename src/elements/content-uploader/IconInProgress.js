/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
// $FlowFixMe migrated to TS
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator'; // eslint-disable-line
import IconClose from '../../icons/general/IconClose';

const IconInProgress = () => (
    <div className="be-icon-in-progress">
        <IconClose />
        <LoadingIndicator />
    </div>
);

export default IconInProgress;
