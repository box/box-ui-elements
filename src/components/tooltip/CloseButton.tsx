import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import IconClose from '../../icon/fill/X16';
import PlainButton from '../plain-button';

// @ts-ignore flow import
import messages from '../../common/messages';

type Props = {
    intl: IntlShape;
    onClick: (event: React.SyntheticEvent<HTMLButtonElement, Event>) => void;
};

const CloseButton = ({ intl, onClick }: Props) => (
    <PlainButton aria-label={intl.formatMessage(messages.close)} className="tooltip-close-button" onClick={onClick}>
        <IconClose className="bdl-Tooltip-iconClose" width={14} height={14} />
    </PlainButton>
);

export { CloseButton as CloseButtonBase };
export default injectIntl(CloseButton);
