// @flow
import * as React from 'react';

import LabelPrimitive from './LabelPrimitive';

const HIDDEN_CLASS_NAME = 'accessibility-hidden';

type Props = {
    children: React.Node,
    labelContent: React.Node,
};

const HiddenLabel = ({ children, labelContent }: Props) => (
    <LabelPrimitive labelContent={labelContent} className={HIDDEN_CLASS_NAME}>
        {children}
    </LabelPrimitive>
);

export default HiddenLabel;
