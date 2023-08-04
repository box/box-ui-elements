import * as React from 'react';
import classNames from 'classnames';

import { injectIntl, IntlShape } from 'react-intl';

import Button, { ButtonType } from '../button';
import IconClose from '../../icons/general/IconClose';
import { bdlGray65 } from '../../styles/variables';

// @ts-ignore flow import
import messages from '../../common/messages';

import './CloseButton.scss';

export interface CloseButtonProps {
    /** Custom class for the close button */
    className?: string;
    /** Intl object */
    intl: IntlShape;
    /** onClick handler for the close button */
    onClick?: Function;
}

const CloseButton = ({ className, intl, onClick }: CloseButtonProps) => {
    return (
        <Button
            aria-label={intl.formatMessage(messages.close)}
            className={classNames('bdl-CloseButton', className)}
            data-testid="bdl-CloseButton"
            onClick={onClick}
            type={ButtonType.BUTTON}
        >
            <IconClose color={bdlGray65} height={18} width={18} />
        </Button>
    );
};

export default injectIntl(CloseButton);
