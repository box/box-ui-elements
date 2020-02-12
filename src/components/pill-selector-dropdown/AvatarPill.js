// @flow
import React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import X from '../../icon/fill/X16';
// $FlowFixMe this imports from a typescript file
import LabelPill from '../label-pill';

import './AvatarPill.scss';

type Props = {
    className?: string,
    isDisabled?: boolean,
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: () => any,
    text: string,
};

const RemoveButton = ({ onClick, ...rest }: { onClick: () => any }) => (
    <X {...rest} aria-hidden="true" onClick={onClick} />
);

const AvatarPill = ({ isDisabled = false, isSelected = false, isValid = true, onRemove, text, className }: Props) => {
    const styles = classNames('bdl-AvatarPill', className, {
        'bdl-AvatarPill-isSelected': isSelected && !isDisabled,
        'bdl-AvatarPill-isDisabled': isDisabled,
    });

    let pillType;

    if (!isValid) {
        pillType = 'error';
    }

    const handleClickRemove = isDisabled ? noop : onRemove;

    return (
        <LabelPill.Pill size="large" className={styles} type={pillType}>
            <LabelPill.Text className="bdl-AvatarPill-text">{text}</LabelPill.Text>
            <LabelPill.Icon className="bdl-AvatarPill-closeBtn" Component={RemoveButton} onClick={handleClickRemove} />
        </LabelPill.Pill>
    );
};

export default AvatarPill;
