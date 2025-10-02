import * as React from 'react';
function makeUseShowOne(targetingApis) {
  let shown = null;
  function useShowOne(useTargetingApi, index) {
    const {
      canShow,
      onShow,
      onClose,
      onComplete
    } = useTargetingApi();
    return {
      canShow: (shown === null || shown === index) && canShow,
      onShow: React.useCallback(() => {
        if (shown === null && canShow) {
          shown = index;
          onShow();
        }
      }, [canShow, index, onShow]),
      onClose,
      onComplete
    };
  }
  return targetingApis.map((targetingApi, index) => {
    return () => useShowOne(targetingApi, index);
  });
}
export default makeUseShowOne;
//# sourceMappingURL=useShowOne.js.map