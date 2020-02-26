import * as React from 'react';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

export interface AccessibleSVGIconProps extends SVGProps {
    'aria-labelledby'?: string;
    focusable?: boolean | 'false' | 'true' | 'auto' | undefined;
    opacity?: number;
}

class AccessibleSVG extends React.Component<AccessibleSVGIconProps> {
    id: string = uniqueId('icon');

    render() {
        const { children, title, ...rest } = this.props;
        const titleID = `${this.id}-title`;

        // Make sure parent doesn't accidentally override these values
        const svgProps: AccessibleSVGIconProps = omit(rest, ['role', 'aria-labelledby']);

        // Accessibility fix for IE11, which treats all SVGs as focusable by default
        svgProps.focusable = 'false';

        if (title) {
            svgProps['aria-labelledby'] = titleID;
            svgProps.role = 'img';
        } else {
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
