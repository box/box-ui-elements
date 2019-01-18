/**
 * @flow
 * @file Decorates a component with logging methods
 * @author Box
 */
import * as React from 'react';
import Logger from './Logger';

const withLogger = (source: ElementOrigin) => (WrappedComponent: React.ComponentType<any>) =>
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    React.forwardRef((props: Object, ref: React.Ref<any>) => (
        <Logger {...props} source={source}>
            <WrappedComponent ref={ref} />
        </Logger>
    ));

export default withLogger;
