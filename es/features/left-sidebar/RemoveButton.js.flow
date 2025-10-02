// @flow
import * as React from 'react';

import PlainButton from '../../components/plain-button';
import IconClose from '../../icons/general/IconClose';

import './styles/RemoveButton.scss';

type Props = {
    onClickRemove: Function,
    removeButtonHtmlAttributes?: Object,
};

const RemoveButton = ({ onClickRemove, removeButtonHtmlAttributes = {} }: Props) => (
    <PlainButton className="lsb-remove-button" onClick={onClickRemove} {...removeButtonHtmlAttributes}>
        <IconClose className="lsb-remove-button-icon" width={13} />
    </PlainButton>
);

export default RemoveButton;
