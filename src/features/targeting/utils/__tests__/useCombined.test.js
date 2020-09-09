// @flow
import { renderHook } from '@testing-library/react-hooks';
import useCombined from '../useCombined';

describe('components/targeting/utils/useCombined', () => {
    const firstOnShow = jest.fn();
    const firstOnClose = jest.fn();
    const firstOnComplete = jest.fn();
    const firstTargetingApi = {
        canShow: false,
        onShow: firstOnShow,
        onClose: firstOnClose,
        onComplete: firstOnComplete,
    };
    const useFirstTargetingApi = () => firstTargetingApi;

    const secondOnShow = jest.fn();
    const secondOnClose = jest.fn();
    const secondOnComplete = jest.fn();
    const secondTargetingApi = {
        canShow: true,
        onShow: secondOnShow,
        onClose: secondOnClose,
        onComplete: secondOnComplete,
    };
    const useSecondTargetingApi = () => secondTargetingApi;

    test('should return the first eligible targetingApi from the array', () => {
        const {
            result: { current: targetingApi },
        } = renderHook(() => useCombined([useFirstTargetingApi, useSecondTargetingApi]));

        expect(targetingApi.canShow).toBe(true);
        targetingApi.onShow();
        targetingApi.onClose();
        targetingApi.onComplete();
        // Should have called the second targetingApi
        expect(secondOnShow).toHaveBeenCalledTimes(1);
        expect(secondOnClose).toHaveBeenCalledTimes(1);
        expect(secondOnComplete).toHaveBeenCalledTimes(1);
        // First, ineligible targetingApi should not have been called
        expect(firstOnShow).toHaveBeenCalledTimes(0);
        expect(firstOnClose).toHaveBeenCalledTimes(0);
        expect(firstOnComplete).toHaveBeenCalledTimes(0);
    });

    test('should return the neverTargeted if no eligible targetingApi is passed', () => {
        const {
            result: { current: targetingApi },
        } = renderHook(() => useCombined([useFirstTargetingApi]));

        expect(targetingApi.canShow).toBe(false);
        targetingApi.onShow();
        targetingApi.onClose();
        targetingApi.onComplete();
        expect(firstOnShow).toHaveBeenCalledTimes(0);
        expect(firstOnClose).toHaveBeenCalledTimes(0);
        expect(firstOnComplete).toHaveBeenCalledTimes(0);
    });
});
