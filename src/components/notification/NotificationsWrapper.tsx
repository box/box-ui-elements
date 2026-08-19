import * as React from 'react';

import FocusTrap from '../focus-trap';
import Portal from '../portal';

export interface NotificationsWrapperProps {
    /** Notification elements to render inside the live region */
    children?: React.ReactNode;
}

const NotificationsWrapper = ({ children }: NotificationsWrapperProps) => (
    // @ts-ignore Portal forwards children and extra HTML attributes at runtime
    <Portal className="notifications-wrapper" aria-live="polite">
        {children ? <FocusTrap className="notification-container">{children}</FocusTrap> : null}
    </Portal>
);

export default NotificationsWrapper;
