/**
 * @flow
 * @file Icon
 * @author Box
 */

import * as React from 'react';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import IconClose from '../../icons/general/IconClose';

const IconInProgress = () => (
    <div className="be-icon-in-progress">
        <IconClose />
        <LoadingIndicator />
    </div>
);

export default IconInProgress;
