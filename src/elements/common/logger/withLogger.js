/**
 * @flow
 * @file Decorates a component with logging methods
 * @author Box
 */
import * as React from 'react';
import Logger from './Logger';
import type { ElementOrigin } from '../flowTypes';

const withLogger = (source: ElementOrigin) => (WrappedComponent: React.ComponentType<any>) =>
    React.forwardRef<Object, React.Ref<any>>((props: Object, ref: React.Ref<any>) => (
        <Logger {...props} source={source}>
            <WrappedComponent ref={ref} />
        </Logger>
    ));

export default withLogger;
