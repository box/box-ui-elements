/**
 * @file Wraps a component with the API context
 * @author Box
 */
import * as React from 'react';
import API from '../../../api';
import APIContext from './APIContext';

export interface WithAPIProps {
    api?: API | null;
    [key: string]: unknown;
}

const withAPIContext = <P extends WithAPIProps, T = unknown>(WrappedComponent: React.ComponentType<P>) => {
    return React.forwardRef<T, Omit<P, 'api'>>((props, ref) => (
        <APIContext.Consumer>{api => <WrappedComponent ref={ref} {...(props as P)} api={api} />}</APIContext.Consumer>
    ));
};

export default withAPIContext;
