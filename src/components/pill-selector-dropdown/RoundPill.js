// @flow
import React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import X from '../../icon/fill/X16';
// $FlowFixMe this imports from a typescript file
import LabelPill from '../label-pill';
import Avatar from '../avatar';

import './RoundPill.scss';

type Props = {
    className?: string,
    /** Function to retrieve the image URL associated with a pill */
    getPillImageUrl?: (data: { id: string | number, [key: string]: any }) => string,
    hasWarning?: boolean,
    id?: string | number,
    isDisabled?: boolean,
    isExternal?: boolean,
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: () => any,
    showAvatar?: boolean,
    text: string,
};

const RemoveButton = ({ onClick, ...rest }: { onClick: () => any }) => (
    <X {...rest} aria-hidden="true" onClick={onClick} />
);

const RoundPill = ({
    getPillImageUrl,
    isDisabled = false,
    isSelected = false,
    hasWarning = false,
    isExternal,
    isValid = true,
    onRemove,
    text,
    className,
    showAvatar = false,
    id,
}: Props) => {
    const styles = classNames('bdl-RoundPill', className, {
        'bdl-RoundPill--selected': isSelected && !isDisabled,
        'bdl-RoundPill--disabled': isDisabled,
        'bdl-RoundPill--warning': hasWarning,
        'bdl-RoundPill--error': !isValid,
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
        <LabelPill.Icon
            Component={Avatar}
            avatarUrl={getPillImageUrl && id ? getPillImageUrl({ id }) : undefined}
            id={id}
            isExternal={isExternal}
            name={text}
            size="small"
            shouldShowExternal
        />
    ) : null;

    return (
        <LabelPill.Pill size="large" className={styles} type={pillType}>
            {avatar}
            <LabelPill.Text className="bdl-RoundPill-text">{text}</LabelPill.Text>
            <LabelPill.Icon className="bdl-RoundPill-closeBtn" Component={RemoveButton} onClick={handleClickRemove} />
        </LabelPill.Pill>
    );
};

export default RoundPill;
