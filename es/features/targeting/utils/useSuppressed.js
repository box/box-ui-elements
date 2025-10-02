import neverTargeted from '../neverTargeted';
/**
 * Returns a targetingApi that will be targeted as long as the input targeting api is targeted
 * and should suppress is false.
 */
const useSuppressed = (useTargetingApi, useShouldSuppress) => {
  const targetingApi = useTargetingApi();
  const shouldSuppress = useShouldSuppress();
  if (shouldSuppress) {
    return neverTargeted;
  }
  return targetingApi;
};
export default useSuppressed;
//# sourceMappingURL=useSuppressed.js.map