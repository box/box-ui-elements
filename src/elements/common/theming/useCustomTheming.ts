import { useEffect } from 'react';
import { convertTokensToCustomProperties } from './utils';
import { ThemingProps } from './types';

const useCustomTheming = ({ selector, theme = {} }: ThemingProps) => {
    const { tokens } = theme;

    const customProperties = convertTokensToCustomProperties(tokens);
    const styles = Object.entries(customProperties)
        .map(([token, value]) => `${token}: ${value}`)
        .join(';');

    useEffect(() => {
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);

        styleEl.sheet.insertRule(`${selector ?? ':root'} { ${styles} }`);

        return () => {
            document.head.removeChild(styleEl);
        };
    }, [selector, styles]);
};

export default useCustomTheming;
