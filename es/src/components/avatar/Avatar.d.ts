import * as React from 'react';
import { IntlShape } from 'react-intl';
import './Avatar.scss';
declare const SIZES: {
    small: boolean;
    large: boolean;
};
export interface AvatarProps {
    /**
     * Url to avatar image.  If passed in, component will render the avatar image instead of the initials
     *
     * Required if "name" is not specified.
     */
    avatarUrl?: string | null;
    /**
     * Icon React Element that will be shown as a badge in bottom right corner of Avatar.
     *
     * Will not be used if `shouldShowExternal` and `isExternal` is true, then GlobalBadge will be shown.
     */
    badgeIcon?: React.ReactElement;
    /** classname to add to the container element. */
    className?: string;
    /** Users id */
    id?: string | number | null;
    /** Intl object */
    intl: IntlShape;
    /** Whether this avatar should be labeled as external in the current context */
    isExternal?: boolean;
    /**
     * Users full name.
     *
     * Required if "avatarUrl" is not specified.
     */
    name?: string | null;
    /** Show the external avatar marker if the avatar is marked as for an external user */
    shouldShowExternal?: boolean;
    size?: keyof typeof SIZES | '';
}
declare function Avatar({ avatarUrl, badgeIcon, className, name, id, intl, isExternal, shouldShowExternal, size, }: AvatarProps): React.JSX.Element;
export { Avatar as AvatarBase };
declare const _default: React.FC<import("react-intl").WithIntlProps<AvatarProps>> & {
    WrappedComponent: React.ComponentType<AvatarProps>;
};
export default _default;
