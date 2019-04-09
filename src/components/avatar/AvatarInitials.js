// @flow
import React from 'react';
import { getInitials } from './helpers';

type Props = {
    className?: string,
    id?: string | number,
    name: string,
};

const AvatarInitials = ({ className = '', name }: Props) => {
    return <span className={`avatar-initials ${className}`}>{getInitials(name)}</span>;
};

export default AvatarInitials;
