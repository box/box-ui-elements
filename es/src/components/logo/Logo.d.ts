import * as React from 'react';
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
declare const Logo: ({ color, height, width, title }: LogoProps) => React.JSX.Element;
export default Logo;
