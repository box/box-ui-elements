// @flow
import * as React from 'react';

import Tooltip from '../tooltip';
import LabelPrimitive from './LabelPrimitive';

type Props = {
    /** Add a class to the component */
    children: React.Node,
    className?: string,
    labelContent: React.Node,
    tooltip?: React.Node,
};

const StandardLabel = ({ className = '', children, labelContent, tooltip }: Props) => {
    const label = (
        <LabelPrimitive className={className} labelContent={labelContent}>
            {children}
        </LabelPrimitive>
    );

    return tooltip ? (
        <Tooltip position="top-right" text={tooltip}>
            {label}
        </Tooltip>
    ) : (
        label
    );
};

export default StandardLabel;
