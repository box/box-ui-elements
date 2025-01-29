import { useEffect } from 'react';
import { convertTokensToCustomProperties } from './utils';
import { ThemingProps } from './types';

const useCustomTheming = ({ theme = {} }: ThemingProps) => {
    const { tokens } = theme;

    const customProperties = convertTokensToCustomProperties(tokens);
    const styles = Object.entries(customProperties)
        .map(([token, value]) => `${token}: ${value}`)
        .join(';');

    useEffect(() => {
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);

        styleEl.sheet.insertRule(`:root { ${styles} }`);

        return () => {
            document.head.removeChild(styleEl);
        };
    }, [styles]);
};

export default useCustomTheming;
