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
    isSmall: boolean
};

function getLogo(isSmall: boolean, url?: string) {
    if (url === 'box') {
        return <IconLogo />;
    } else if (typeof url === 'string') {
        return <img alt='' src={url} className='buik-logo-custom' />;
    }
    return (
        <div className='buik-logo-placeholder'>
            <FormattedMessage {...messages.logo} />
        </div>
    );
}

const Logo = ({ url, isSmall }: Props) =>
    <div className='buik-logo'>
        {getLogo(isSmall, url)}
    </div>;

export default Logo;
