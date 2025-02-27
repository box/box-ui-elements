/**
 * @file Wraps a component with the API context
 * @author Box
 */
import * as React from 'react';
import API from '../../../api';
import APIContext from './APIContext';

export interface WithAPIProps {
    api?: API | null;
}

/**
 * Higher-order component that provides API context to the wrapped component
 * This HOC is used by many components throughout the codebase
 */
const withAPIContext = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WrappedComponent: React.ComponentType<any>,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.forwardRef<any, any>((props, ref) => (
        <APIContext.Consumer>{api => <WrappedComponent ref={ref} {...props} api={api} />}</APIContext.Consumer>
    ));
};

export default withAPIContext;
