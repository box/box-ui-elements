// @flow
import neverTargeted from '../neverTargeted';
import { type TargetingApi } from '../types';

// This function takes in an array of targetingApi hooks (functions) and returns the first
// eligible targetingApi hook OR defaults to the neverTargeted hook.
//
// @TODO (online-sales): Incorporate priority for determining targeting in case we have multiple
// items in the array which are eligible (i.e. contextual messages having greater priority than onboarding).
const useCombined = (useTargetingApis: $ReadOnlyArray<() => TargetingApi>): TargetingApi => {
    const useGetTargetingApi = (useTargetingApi: () => TargetingApi): TargetingApi => useTargetingApi();
    const targetingApis = useTargetingApis.map(useGetTargetingApi);

    const firstEligibleTargetingApi = targetingApis.find(({ canShow }: TargetingApi): boolean => canShow);

    return firstEligibleTargetingApi || neverTargeted;
};

export default useCombined;
