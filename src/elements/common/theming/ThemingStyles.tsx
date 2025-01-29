import useCustomTheming from './useCustomTheming';
import { ThemingProps } from './types';

const ThemingStyles = ({ theme }: ThemingProps) => {
    useCustomTheming({ theme });

    return null;
};

export default ThemingStyles;
