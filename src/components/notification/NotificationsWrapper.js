// @flow
import * as React from 'react';

import FocusTrap from '../focus-trap';
import Portal from '../portal';

type Props = {
    children?: React.Node,
    container?: HTMLElement,
};

const NotificationsWrapper = ({ children, container }: Props) => (
    <Portal className="notifications-wrapper" aria-live="polite" container={container}>
        {children ? <FocusTrap>{children}</FocusTrap> : null}
    </Portal>
);

export default NotificationsWrapper;
