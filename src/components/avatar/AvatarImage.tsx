import * as React from 'react';

export interface AvatarImageProps {
    className?: string;
    onError?: Function;
    url: string;
}

const AvatarImage = ({ className = '', url, onError }: AvatarImageProps) => (
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
