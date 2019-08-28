// @flow
import * as React from 'react';

import type { InlineNoticeType } from '../../common/types/core';

type Props = {
    children: React.Node,
    className?: string,
    title?: React.Node,
    type?: InlineNoticeType,
};

const InlineNotice = ({ children, className = '', title, type = 'warning', ...rest }: Props) => (
    <div className={`inline-alert inline-alert-visible inline-alert-${type} ${className}`} {...rest}>
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
    </div>
);

export default InlineNotice;
