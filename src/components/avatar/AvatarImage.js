// @flow
import React from 'react';

type Props = {
    className?: string,
    url: string,
    onError?: Function,
};

const AvatarImage = ({ className = '', url, onError }: Props) => (
    <img
        alt=""
        className={`avatar-image ${className}`}
        src={url}
        onError={event => {
            if (typeof onError === 'function') {
                onError(event);
            }
        }}
    />
);

export default AvatarImage;
