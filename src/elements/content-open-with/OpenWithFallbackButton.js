/**
 * @flow
 * @file Open With fallback button
 * @author Box
 */

import * as React from 'react';
import OpenWithButton from './OpenWithButton';
import type { ElementsError } from '../../common/types/api';

type Props = {
    error: ElementsError,
};

const OpenWithFallbackButton = ({ error }: Props) => (
    <div className="be bcow">
        <OpenWithButton error={error} isLoading={false} />
    </div>
);

export default OpenWithFallbackButton;
