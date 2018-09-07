/**
 * @flow
 * @file Logo for the header
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import IconLogo from 'box-react-ui/lib/icons/general/IconLogo';
import messages from '../messages';
import './Logo.scss';

type Props = {
    url?: string,
};

function getLogo(url?: string) {
    if (url === 'box') {
        return <IconLogo />;
    } else if (typeof url === 'string') {
        return <img alt="" src={url} className="be-logo-custom" />;
    }

    return (
        <div className="be-logo-placeholder">
            <FormattedMessage {...messages.logo} />
        </div>
    );
}

const Logo = ({ url }: Props) => <div className="be-logo">{getLogo(url)}</div>;

export default Logo;
