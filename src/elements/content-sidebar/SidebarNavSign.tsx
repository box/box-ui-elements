import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import BoxSign28 from '../../icon/logo/BoxSign28';
import PlainButton, { PlainButtonProps } from '../../components/plain-button';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
// @ts-ignore Module is written in Flow
import messages from './messages';
import './SidebarNavSign.scss';

export type Props = PlainButtonProps & {
    intl: IntlShape;
    status?: string;
};

export function SidebarNavSign({ intl, status, ...rest }: Props) {
    const label = status === 'active' ? messages.boxSignSignature : messages.boxSignRequest;

    return (
        <Tooltip position={TooltipPosition.MIDDLE_LEFT} text={intl.formatMessage(label)}>
            <PlainButton aria-label={intl.formatMessage(label)} className="bcs-SidebarNavSign" {...rest}>
                <BoxSign28 className="bcs-SidebarNavSign-icon" />
            </PlainButton>
        </Tooltip>
    );
}

export default injectIntl(SidebarNavSign);
