import * as React from 'react';
import './ErrorMask.scss';
export interface ErrorMaskProps {
    /** Text or element displayed in the header of the error mask */
    errorHeader: React.ReactChild;
    /** Text or element displayed in the subheader of the error mask */
    errorSubHeader?: React.ReactChild;
}
declare const ErrorMask: ({ errorHeader, errorSubHeader }: ErrorMaskProps) => React.JSX.Element;
export default ErrorMask;
