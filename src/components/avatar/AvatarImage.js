// @flow
import * as React from 'react';

type Props = {
    className?: string,
    id?: string | number,
    onError?: Function,
    url: string,
};

const AvatarImage = React.memo<Props>(({ className = '', url, onError, ...rest }: Props) => (
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
));

export default AvatarImage;
