import * as React from 'react';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

export interface SVGProps {
    /** Class for the svg */
    className?: string;
    /** Height for the svg */
    height?: number;
    /** Accessibility role for the svg */
    role?: string;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: React.ReactNode;
    /** View box for the svg */
    viewBox?: string;
    /** Width for the svg */
    width?: number;
}

export interface AccessibleSVGProps {
    /** SVG dom elements for the component */
    children: React.ReactElement | Array<React.ReactElement>;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: React.ReactNode;
}

class AccessibleSVG extends React.Component<AccessibleSVGProps & SVGProps> {
    id: string = uniqueId('icon');

    render() {
        const { children, title, ...rest } = this.props;
        const titleID = `${this.id}-title`;

        // Make sure parent doesn't accidentally override these values
        const svgProps: Record<string, string | number | React.ReactNode> = omit(rest, ['role', 'aria-labelledby']);

        // Accessibility fix for IE11, which treats all SVGs as focusable by default
        svgProps.focusable = 'false';

        if (title) {
            svgProps['aria-labelledby'] = titleID;
            svgProps.role = 'img';
        } else {
            svgProps['aria-hidden'] = 'true';
            svgProps.role = 'presentation';
        }

        return (
            <svg {...svgProps}>
                {title ? <title id={titleID}>{title}</title> : null}
                {children}
            </svg>
        );
    }
}

export default AccessibleSVG;
