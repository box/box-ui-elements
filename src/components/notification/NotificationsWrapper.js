// @flow
import * as React from 'react';

import FocusTrap from '../focus-trap';
import Portal from '../portal';

type Props = {
    children?: React.Node,
};

const NotificationsWrapper = ({ children }: Props) => (
    <Portal aria-live="polite" className="notifications-wrapper">
        {children ? <FocusTrap>{children}</FocusTrap> : null}
    </Portal>
);

export default NotificationsWrapper;
