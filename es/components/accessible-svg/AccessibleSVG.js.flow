// @flow
import * as React from 'react';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

type Props = {
    children: React.Node,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
};

class AccessibleSVG extends React.Component<Props> {
    id: string = uniqueId('icon');

    render() {
        const { children, title, ...rest } = this.props;
        const titleID = `${this.id}-title`;

        // Make sure parent doesn't accidentally override these values
        const svgProps = omit(rest, ['role', 'aria-labelledby']);

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
