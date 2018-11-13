/**
 * @flow
 * @file Wraps a component with the API context
 * @author Box
 */
import * as React from 'react';
import APIContext from './APIContext';

const withAPIContext = (WrappedComponent: React.ComponentType<any>) => (props: any) => (
    <APIContext.Consumer>{api => <WrappedComponent {...props} api={api} />}</APIContext.Consumer>
);

export default withAPIContext;
