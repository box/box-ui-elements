/**
 * @flow
 * @file Wraps a component with the Logger context
 * @author Box
 */
import * as React from 'react';
import LoggerContext from './LoggerContext';
import Logger from './Logger';

const loggerInstance = new Logger();

const withLoggerContext = (WrappedComponent: React.ComponentType<any>) => (props: any) => (
    <LoggerContext.Consumer>{() => <WrappedComponent {...props} logger={loggerInstance} />}</LoggerContext.Consumer>
);

export default withLoggerContext;
