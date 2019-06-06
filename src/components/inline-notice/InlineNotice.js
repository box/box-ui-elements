// @flow
import * as React from 'react';

import type { inlineNoticeType } from '../../common/box-types';

type Props = {
    children: React.Node,
    className?: string,
    type?: inlineNoticeType,
};

const InlineNotice = ({ children, className = '', type = 'warning' }: Props) => (
    <div className={`box-ui-component inline-alert inline-alert-visible inline-alert-${type} ${className}`}>{children}</div>
);

export default InlineNotice;
