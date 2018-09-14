/**
 * @flow
 * @file Open With button contents
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';

type Props = {
    children: any,
};

const OpenWithButtonContents = ({ children }: Props) => (
    <React.Fragment>
        {children}
        <span className="bcow-btn-header-text">
            <FormattedMessage {...messages.open} />
        </span>
    </React.Fragment>
);

export default OpenWithButtonContents;
