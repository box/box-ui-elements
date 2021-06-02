import * as React from 'react';
import classNames from 'classnames';

export enum InlineNoticeType {
    INFO = 'info',
    ERROR = 'error',
    WARNING = 'warning',
    SUCCESS = 'success',
    GENERIC = 'generic',
}

export interface InlineNoticeProps {
    children: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    type?: InlineNoticeType;
}

const InlineNotice = ({
    type = InlineNoticeType.WARNING,
    title,
    className = '',
    children,
    ...rest
}: InlineNoticeProps) => (
    <div className={classNames(className, 'inline-alert', 'inline-alert-visible', `inline-alert-${type}`)} {...rest}>
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
    </div>
);

export default InlineNotice;
