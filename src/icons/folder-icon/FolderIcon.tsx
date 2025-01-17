import * as React from 'react';

import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';
import IconFolderCollab from '../../icon/content/FolderShared32';
import IconFolderExternal from '../../icon/content/FolderExternal32';
import IconFolderPersonal from '../../icon/content/FolderPersonal32';

type FolderIconProps = SVGProps & {
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
    className,
}: FolderIconProps): JSX.Element => {
    // Priority: External > Collab > Personal
    let IconComponent;
    let defaultTitle;

    if (isExternal) {
        IconComponent = IconFolderExternal;
        defaultTitle = 'External Folder';
    } else if (isCollab) {
        IconComponent = IconFolderCollab;
        defaultTitle = 'Collaborated Folder';
    } else {
        IconComponent = IconFolderPersonal;
        defaultTitle = 'Personal Folder';
    }

    const effectiveTitle = title || ariaLabel || defaultTitle;

    return (
        <IconComponent
            className={className}
            height={Number(dimension)}
            width={Number(dimension)}
            title={effectiveTitle}
            viewBox="0 0 32 32"
            role={role}
            aria-label={effectiveTitle}
            aria-hidden={ariaHidden}
        />
    );
};

export default FolderIcon;
