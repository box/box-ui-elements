/**
 * @flow
 * @file Wraps a component with the API context
 * @author Box
 */
import * as React from 'react';
import APIContext from './APIContext';

const withAPIContext = (WrappedComponent: React.ComponentType<any>) =>
    React.forwardRef<Object, React.Ref<any>>((props: Object, ref: React.Ref<any>) => (
        <APIContext.Consumer>{api => <WrappedComponent ref={ref} {...props} api={api} />}</APIContext.Consumer>
    ));

export default withAPIContext;
