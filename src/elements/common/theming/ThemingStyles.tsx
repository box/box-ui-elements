import useCustomTheming from './useCustomTheming';
import { ThemingProps } from './types';

const ThemingStyles = ({ selector, theme }: ThemingProps) => {
    useCustomTheming({ selector, theme });

    return null;
};

export default ThemingStyles;
