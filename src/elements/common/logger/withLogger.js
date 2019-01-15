/**
 * @flow
 * @file Wraps a component with the Logger context
 * @author Box
 */
import * as React from 'react';
import Logger from './Logger';

const withLogger = (source: ElementsOrigins) => (WrappedComponent: React.ComponentType<any>) =>
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    React.forwardRef((props: Object, ref: React.Ref<any>) => (
        <Logger {...props} source={source}>
            <WrappedComponent ref={ref} />
        </Logger>
    ));

export default withLogger;
