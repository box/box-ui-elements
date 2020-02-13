// @flow
import React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import X from '../../icon/fill/X16';
// $FlowFixMe this imports from a typescript file
import LabelPill from '../label-pill';
import Avatar from '../avatar';

import './AvatarPill.scss';

type Props = {
    avatarUrl?: string,
    className?: string,
    hasWarning?: boolean,
    id?: string | number,
    isDisabled?: boolean,
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: () => any,
    showAvatar?: boolean,
    text: string,
};

const RemoveButton = ({ onClick, ...rest }: { onClick: () => any }) => (
    <X {...rest} aria-hidden="true" onClick={onClick} />
);

const AvatarPill = ({
    isDisabled = false,
    isSelected = false,
    hasWarning = false,
    isValid = true,
    onRemove,
    text,
    className,
    showAvatar = false,
    avatarUrl,
    id,
}: Props) => {
    const styles = classNames('bdl-AvatarPill', className, {
        'bdl-AvatarPill-isSelected': isSelected && !isDisabled,
        'bdl-AvatarPill-isDisabled': isDisabled,
        'bdl-AvatarPill--noAvatar': !showAvatar,
    });

    let pillType;

    if (hasWarning) {
        pillType = 'warning';
    }

    if (!isValid) {
        pillType = 'error';
    }

    const handleClickRemove = isDisabled ? noop : onRemove;

    const avatar = showAvatar ? (
        <Avatar className="bdl-AvatarPill-avatar" name={text} size="small" avatarUrl={avatarUrl} id={id} />
    ) : (
        undefined
    );

    return (
        <LabelPill.Pill size="large" className={styles} type={pillType}>
            {avatar}
            <LabelPill.Text className="bdl-AvatarPill-text">{text}</LabelPill.Text>
            <LabelPill.Icon className="bdl-AvatarPill-closeBtn" Component={RemoveButton} onClick={handleClickRemove} />
        </LabelPill.Pill>
    );
};

export default AvatarPill;
