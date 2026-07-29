import * as React from 'react';
import InlineNotice from '../inline-notice';

export interface InlineErrorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Contents of the inline error */
    children: React.ReactNode;
    /** Custom class for the inline error */
    className?: string;
    /** Title of the inline error. */
    title: React.ReactNode;
}

const InlineError = (props: InlineErrorProps) => <InlineNotice {...props} type="error" />;

export default InlineError;
