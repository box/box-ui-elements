import * as React from 'react';

import IconFolderCollab from '../../icon/content/FolderShared32';
import IconFolderExternal from '../../icon/content/FolderExternal32';
import IconFolderPersonal from '../../icon/content/FolderPersonal32';

type FolderIconProps = {
    /** Dimension of the icon */
    dimension?: number | string;
    /** If true displays collaborated folder icon */
    isCollab?: boolean;
    /** If true displays externally collaborated folder icon */
    isExternal?: boolean;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.ReactElement<string>;
    /** Accessibility label for the icon */
    'aria-label'?: string;
    /** Additional class name */
    className?: string;
    /** Role attribute for accessibility */
    role?: string;
    /** Aria hidden attribute */
    'aria-hidden'?: boolean;
};

const FolderIcon = ({
    dimension = 32,
    isCollab = false,
    isExternal = false,
    title,
    role = 'img',
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
}: FolderIconProps): JSX.Element => {
    // Priority: Collab > External > Personal
    const getIconComponent = () => {
        if (isCollab) {
            return IconFolderCollab;
        }
        if (isExternal) {
            return IconFolderExternal;
        }
        return IconFolderPersonal;
    };
    const IconComponent = getIconComponent();

    // For backward compatibility, we keep both title and aria-label
    const accessibilityProps = {
        role,
        'aria-label': ariaLabel || title,
        'aria-hidden': ariaHidden,
        title: title || ariaLabel, // Ensure title is always set for backward compatibility
    };

    return (
        <IconComponent
            height={Number(dimension)}
            width={Number(dimension)}
            viewBox="0 0 32 32"
            {...accessibilityProps}
        />
    );
};

export default FolderIcon;
