// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
    className?: string,
    /** Title of the inline error. */
    title: React.Node,
};

const InlineError = ({ children, className = '', title }: Props) => (
    <div className={`inline-alert inline-alert-visible inline-alert-error ${className}`}>
        <b>{title}</b>
        <div>{children}</div>
    </div>
);

export default InlineError;
