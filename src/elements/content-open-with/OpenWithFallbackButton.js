/**
 * @flow
 * @file Open With fallback button
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import OpenWithButton from './OpenWithButton';

type Props = {
    error: ElementsError,
};

const OpenWithFallbackButton = ({ error }: Props) => (
    <div className="be bcow">
        <OpenWithButton error={error} isLoading={false} onClick={noop} />
    </div>
);

export default OpenWithFallbackButton;
