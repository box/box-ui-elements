/**
 * @flow
 * @file Wraps a component with the Logger context
 * @author Box
 */
import * as React from 'react';
import Logging from './Logging';

const withLogger = (source: MetricSources) => (WrappedComponent: React.ComponentType<any>) =>
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    React.forwardRef((props: Object, ref: React.Ref<any>) => (
        <Logging {...props} source={source}>
            <WrappedComponent ref={ref} />
        </Logging>
    ));

export default withLogger;
