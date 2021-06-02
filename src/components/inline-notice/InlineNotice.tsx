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
    /** Content, wrapped in div */
    children: React.ReactNode;
    /** Additional CSS classname(s) */
    className?: string;
    /** (Optional) Title of inline text, wrapped in strong */
    title?: React.ReactNode;
    /** (Default: WARNING) Type of Inline Notice */
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

InlineNotice.displayName = 'InlineNotice';

export default InlineNotice;
