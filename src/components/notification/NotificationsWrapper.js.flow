// @flow
import * as React from 'react';

import FocusTrap from '../focus-trap';
import Portal from '../portal';

type Props = {
    children?: React.Node,
};

const NotificationsWrapper = ({ children }: Props) => (
    <Portal className="notifications-wrapper" aria-live="polite">
        {children ? <FocusTrap className="notification-container">{children}</FocusTrap> : null}
    </Portal>
);

export default NotificationsWrapper;
