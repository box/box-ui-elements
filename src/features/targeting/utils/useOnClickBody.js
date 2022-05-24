// @flow
import * as React from 'react';
/**
 * onClick will be called if enable is true when document is clicked.
 * optionally shouldAct function can be passed to decide whether onClick
 * should be called or not
 * options such as capture and once are directly passed to event listener.
 * Recommend to use once
 */
const useOnClickBody = (
    onClick: () => void,
    enable: boolean,
    shouldAct: (e: React.nativeEvent) => boolean = () => true,
) => {
    React.useEffect(() => {
        const clickHandler = (e: React.nativeEvent) => {
            if (shouldAct(e)) {
                onClick();
            }
        };

        if (enable) {
            if (document.body) {
                document.body.addEventListener('click', clickHandler, true);
            }
            if (document.body) {
                document.body.addEventListener('contextmenu', clickHandler, true);
            }
        }
        return () => {
            if (enable) {
                if (document.body) {
                    document.body.removeEventListener('click', clickHandler, true);
                }
                if (document.body) {
                    document.body.removeEventListener('contextmenu', clickHandler, true);
                }
            }
        };
    }, [onClick, enable, shouldAct]);
};

export default useOnClickBody;
