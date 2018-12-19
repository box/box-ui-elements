/**
 * @flow
 * @file Wraps a component with the Logger context
 * @author Box
 */
import * as React from 'react';
import LoggerContext from './LoggerContext';

const withLoggerContext = (WrappedComponent: React.ComponentType<any>) => (props: any) => (
    <LoggerContext.Consumer>{logger => <WrappedComponent {...props} logger={logger} />}</LoggerContext.Consumer>
);

export default withLoggerContext;
