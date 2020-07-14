// @flow
import { useEffect } from 'react';
/**
 * onClick will be called if enable is true when document is clicked.
 * options such as capture and once are directly passed to event listener.
 * Recommend to use once
 */
const useOnClickBody = (onClick: () => void, enable: boolean) => {
    useEffect(() => {
        if (enable) {
            if (document.body) {
                document.body.addEventListener('click', onClick);
            }
            if (document.body) {
                document.body.addEventListener('contextmenu', onClick);
            }
        }
        return () => {
            if (enable) {
                if (document.body) {
                    document.body.removeEventListener('click', onClick);
                }
                if (document.body) {
                    document.body.removeEventListener('contextmenu', onClick);
                }
            }
        };
    }, [onClick, enable]);
};

export default useOnClickBody;
