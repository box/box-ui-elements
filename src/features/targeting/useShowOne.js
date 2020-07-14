// @flow
import * as React from 'react';
import { type UseTargetingApi, type TargetingApi } from './types';

function makeUseShowOne(targetingApis: Array<UseTargetingApi>): Array<UseTargetingApi> {
    let shown: number | null = null;

    function useShowOne(useTargetingApi: UseTargetingApi, index: number): TargetingApi {
        const { canShow, onShow, onClose, onComplete } = useTargetingApi();

        return {
            canShow: (shown === null || shown === index) && canShow,
            onShow: React.useCallback(() => {
                if (shown === null && canShow) {
                    shown = index;
                    onShow();
                }
            }, [canShow, index, onShow]),
            onClose,
            onComplete,
        };
    }

    return targetingApis.map((targetingApi, index) => {
        return () => useShowOne(targetingApi, index);
    });
}

export default makeUseShowOne;
