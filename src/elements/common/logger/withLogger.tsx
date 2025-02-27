/**
 * @file Decorates a component with logging methods
 * @author Box
 */
import * as React from 'react';
import Logger from './Logger';
import type { ElementOrigin } from '../types';

const withLogger =
    (source: ElementOrigin) =>
    <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) =>
        React.forwardRef<unknown, P>((props: P, ref: React.Ref<unknown>) => (
            <Logger {...(props as Record<string, unknown>)} source={source}>
                <WrappedComponent ref={ref} {...props} />
            </Logger>
        ));

export default withLogger;
