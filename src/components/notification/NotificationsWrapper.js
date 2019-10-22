// @flow
import * as React from 'react';

import FocusTrap from '../focus-trap';
import Portal from '../portal';

type Props = {
    children?: React.Node,
};

const NotificationsWrapper = ({ children }: Props) => (
    <FocusTrap>
        <Portal className="notifications-wrapper" aria-live="polite">
            {children}
        </Portal>
    </FocusTrap>
);

export default NotificationsWrapper;
