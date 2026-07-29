import * as React from 'react';
import classNames from 'classnames';

import type { InlineNoticeType } from '../../common/types/core';

export interface InlineNoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Contents of the notice */
    children: React.ReactNode;
    /** Custom class for the notice */
    className?: string;
    /** Title of the notice, rendered above the contents */
    title?: React.ReactNode;
    /** Severity of the notice, drives the modifier class */
    type?: InlineNoticeType;
}

const InlineNotice = ({ children, className = '', title, type = 'warning', ...rest }: InlineNoticeProps) => (
    <div className={classNames(className, 'inline-alert', 'inline-alert-visible', `inline-alert-${type}`)} {...rest}>
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
    </div>
);

export default InlineNotice;
