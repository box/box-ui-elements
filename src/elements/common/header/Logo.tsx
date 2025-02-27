/**
 * @file Logo for the header
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconLogo from '../../../icons/general/IconLogo';
import messages from '../messages';
import './Logo.scss';

interface LogoProps {
    url?: string;
    isSmall?: boolean;
}

function getLogo(url?: string): React.ReactNode {
    if (url === 'box') {
        return <IconLogo />;
    }
    if (typeof url === 'string') {
        return <img alt="" className="be-logo-custom" src={url} />;
    }

    return (
        <div className="be-logo-placeholder">
            <FormattedMessage {...messages.logo} />
        </div>
    );
}

const Logo = ({ url, isSmall }: LogoProps): JSX.Element => (
    <div className={`be-logo ${isSmall ? 'be-logo--small' : ''}`} data-testid="be-Logo">
        {getLogo(url)}
    </div>
);

export default Logo;
