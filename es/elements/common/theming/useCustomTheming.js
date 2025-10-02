import { useEffect } from 'react';
import { convertTokensToCustomProperties } from './utils';
const useCustomTheming = ({
  selector,
  theme = {}
}) => {
  const {
    tokens
  } = theme;
  const customProperties = convertTokensToCustomProperties(tokens);
  const styles = Object.entries(customProperties).map(([token, value]) => `${token}: ${value}`).join(';');
  useEffect(() => {
    if (!styles) {
      return undefined;
    }
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleEl.sheet.insertRule(`${selector ?? ':root'} { ${styles} }`);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [selector, styles]);
};
export default useCustomTheming;
//# sourceMappingURL=useCustomTheming.js.map