// @flow
import { useEffect, useRef } from 'react';

function useOnOutsideClick(callback: Function) {
    const ref = useRef<?HTMLElement>();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && ref.current instanceof Element) {
                if (event.target instanceof Node && !ref.current.contains(event.target)) {
                    callback();
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return ref;
}

export default useOnOutsideClick;
