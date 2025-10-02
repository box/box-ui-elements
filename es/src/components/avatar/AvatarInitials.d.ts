import * as React from 'react';
export interface AvatarInitialsProps {
    className?: string;
    id?: string | number | null;
    name: string;
}
declare const AvatarInitials: ({ className, id, name }: AvatarInitialsProps) => React.JSX.Element;
export default AvatarInitials;
