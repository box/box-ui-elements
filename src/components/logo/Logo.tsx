import * as React from 'react';

import { bdlBoxBlue } from '../../styles/variables';
import IconLogo from '../../icons/general/IconLogo';

export interface LogoProps {
    /** Color that the logo will be rendered in. Should be a hex value. */
    color?: string;

    /** Height of the logo image to be rendered. */
    height?: number;

    /** Title attribute on the logo image. */
    title?: string | React.ReactElement<string>;

    /** Width of the logo image to be rendered. */
    width?: number;
}

const Logo = ({ color = bdlBoxBlue, height = 25, width = 45, title }: LogoProps) => (
    <div className="logo">
        <IconLogo color={color} height={height} title={title} width={width} />
    </div>
);

export default Logo;
