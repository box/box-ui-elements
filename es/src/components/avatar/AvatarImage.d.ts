import * as React from 'react';
export interface AvatarImageProps {
    className?: string;
    onError?: Function;
    url: string;
}
declare const AvatarImage: ({ className, url, onError }: AvatarImageProps) => React.JSX.Element;
export default AvatarImage;
