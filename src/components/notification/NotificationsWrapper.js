// @flow
import * as React from 'react';

import Portal from '../portal';

type Props = {
    children?: React.Node,
};

const NotificationsWrapper = ({ children }: Props) => <Portal className="box-ui-component notifications-wrapper">{children}</Portal>;

export default NotificationsWrapper;
