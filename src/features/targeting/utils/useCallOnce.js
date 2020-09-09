// @flow
import { useState } from 'react';

/**
 * This hook will call the callback once in the life cycle of the component
 */
function useCallOnce<V>(callback: () => V): () => V | void {
    const [hasCalled, setHasCalled] = useState<boolean>(false);
    return () => {
        if (!hasCalled) {
            setHasCalled(true);
            return callback();
        }
        return undefined;
    };
}

export default useCallOnce;
