import * as React from 'react';
import classNames from 'classnames';

import Button, { ButtonType } from '../button';
import IconClose from '../../icons/general/IconClose';
import { bdlGray65 } from '../../styles/variables';

import './CloseButton.scss';

export interface CloseButtonProps {
    /** ariaLabel defines a string value that labels the current element */
    ariaLabel?: string;
    /** Custom class for the close button */
    className?: string;
    /** onClick handler for the close button */
    onClick?: Function;
}

const CloseButton = ({ className, onClick, ariaLabel = 'close' }: CloseButtonProps) => {
    return (
        <Button
            ariaLabel={ariaLabel}
            className={classNames('bdl-CloseButton', className)}
            data-testid="bdl-CloseButton"
            onClick={onClick}
            type={ButtonType.BUTTON}
        >
            <IconClose color={bdlGray65} height={18} width={18} />
        </Button>
    );
};

export default CloseButton;
