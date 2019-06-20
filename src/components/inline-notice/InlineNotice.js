// @flow
import * as React from 'react';

import type { InlineNoticeType } from '../../common/types/core';

type Props = {
    children: React.Node,
    className?: string,
    type?: InlineNoticeType,
};

const InlineNotice = ({ children, className = '', type = 'warning' }: Props) => (
    <div className={`inline-alert inline-alert-visible inline-alert-${type} ${className}`}>{children}</div>
);

export default InlineNotice;
