import * as React from 'react';
import { useIntl } from 'react-intl';
import { LoadingIndicator } from '@box/blueprint-web';
import { IconCtaIconHover, Size5 } from '@box/blueprint-web-assets/tokens/tokens';
import { XMark } from '@box/blueprint-web-assets/icons/Fill';
import messages from '../common/messages';

const IconInProgress = () => {
    const { formatMessage } = useIntl();

    return (
        <div className="bcu-IconInProgress">
            <XMark color={IconCtaIconHover} height={Size5} width={Size5} />
            <LoadingIndicator aria-label={formatMessage(messages.loading)} className="bcu-IconInProgress-loading" />
        </div>
    );
};

export default IconInProgress;
