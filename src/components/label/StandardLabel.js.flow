// @flow
import * as React from 'react';

import Tooltip from '../tooltip';
import LabelPrimitive from './LabelPrimitive';

type Props = {
    children: React.Node,
    labelContent: React.Node,
    tooltip?: React.Node,
};

const StandardLabel = ({ children, labelContent, tooltip }: Props) => {
    const label = <LabelPrimitive labelContent={labelContent}>{children}</LabelPrimitive>;

    return tooltip ? (
        <Tooltip position="top-right" text={tooltip}>
            {label}
        </Tooltip>
    ) : (
        label
    );
};

export default StandardLabel;
