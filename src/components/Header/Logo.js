/**
 * @flow
 * @file Logo for the header
 * @author Box
 */

import React from 'react';
import IconDefaultLogo from '../icons/IconDefaultLogo';
import IconBoxLogo from '../icons/IconBoxLogo';
import './Logo.scss';

type Props = {
    url?: string
};

function getLogo(url?: string) {
    if (url === 'box') {
        return <IconBoxLogo />;
    } else if (typeof url === 'string') {
        return <img alt='' src={url} className='buik-logo-custom' />;
    }
    return <IconDefaultLogo />;
}

const Logo = ({ url }: Props) =>
    <div className='buik-logo'>
        {getLogo(url)}
    </div>;

export default Logo;
