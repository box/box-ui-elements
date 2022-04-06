// @flow
import * as React from 'react';
import classNames from 'classnames';

import Button from '../button';
import IconClose from '../../icons/general/IconClose';
import { bdlGray62 } from '../../styles/variables';
import './styles/CloseButton.scss';

export type CloseButtonProps = {
    className?: string,
    onClick?: Function,
};

type Props = CloseButtonProps;

const CloseButton = ({ className, onClick }: Props) => {
    return (
        <Button onClick={onClick} className={classNames('close-btn', className)} type="button">
            <IconClose color={bdlGray62} height={18} width={18} />
        </Button>
    );
};

export default CloseButton;
