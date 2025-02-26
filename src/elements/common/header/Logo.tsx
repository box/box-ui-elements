import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BoxLogo } from '@box/blueprint-web-assets/icons/Logo';
import messages from '../messages';
import './Logo.scss';

export interface LogoProps {
    url?: string;
}

function getLogo(url?: string) {
    if (url === 'box') {
        return <BoxLogo height={25} width={45} />;
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

const Logo = ({ url }: LogoProps) => (
    <div className="be-logo" data-testid="be-Logo">
        {getLogo(url)}
    </div>
);

export default Logo;
