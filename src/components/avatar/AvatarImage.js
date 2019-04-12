// @flow
import * as React from 'react';

type Props = {
    className?: string,
    onError?: Function,
    url: string,
};

const AvatarImage = ({ className = '', url, onError, ...rest }: Props) => (
    <img
        {...rest}
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
