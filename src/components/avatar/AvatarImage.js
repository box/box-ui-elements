// @flow
import React from 'react';

type Props = {
    className?: string,
    onError?: Function,
    url: string,
};

const AvatarImage = ({ className = '', url, onError }: Props) => (
    <img
        alt=""
        className={`avatar-image ${className}`}
        onError={event => {
            if (typeof onError === 'function') {
                onError(event);
            }
        }}
        src={url}
    />
);

export default AvatarImage;
