// @flow
import * as React from 'react';

import { useOnClickBody } from '../utils';
import { type TargetedComponentProps } from '../types';

function withTargetedClickThrough<Config>(
    WrappedComponent: React.ComponentType<Config>,
): React.ComponentType<{|
    ...Config,
    ...$Exact<TargetedComponentProps>,
|}> {
    const WrapperComponent = ({
        children,
        closeOnClickOutside,
        shouldTarget,
        useTargetingApi,
        onDismiss,
        ...rest
    }: {|
        ...Config,
        ...$Exact<TargetedComponentProps>,
    |}) => {
        const { canShow, onComplete, onClose, onShow } = useTargetingApi();

        const handleClose = () => {
            onClose();
            if (onDismiss) {
                // $FlowFixMe onDismiss should be declared in both inferred types, which is not true, because we declare props types as Union of Config & TargetedComponentProps
                onDismiss();
            }
        };

        const handleOnComplete = () => {
            if (shouldTarget && canShow) {
                onComplete();
            }
        };

        const shouldShow = shouldTarget && canShow;

        useOnClickBody(onClose, !!(shouldShow && closeOnClickOutside));

        React.useEffect(() => {
            if (shouldShow) {
                onShow();
            }
        }, [shouldShow, onShow]);

        return (
            <WrappedComponent showCloseButton stopBubble {...rest} isShown={shouldShow} onDismiss={handleClose}>
                <span
                    className="bdl-targeted-click-through"
                    data-targeting="click-through"
                    data-testid="with-targeted-click-span"
                    onClickCapture={handleOnComplete}
                    onKeyPressCapture={handleOnComplete}
                    tabIndex={-1}
                >
                    {children}
                </span>
            </WrappedComponent>
        );
    };

    WrapperComponent.displayName = `withTargetedClickThrough(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;

    return WrapperComponent;
}

export default withTargetedClickThrough;
