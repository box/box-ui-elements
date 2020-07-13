import { renderHook, act } from '@testing-library/react-hooks';
import { alwaysTargeted, neverTargeted } from '..';
import makeUseShowOne from '../useShowOne';

describe('features/targeting/useShowOne', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern');
    });

    function makeAlwaysTargetedHook() {
        const onShow = jest.fn();
        return () => ({ ...alwaysTargeted, onShow });
    }
    function makeNeverTargetedHook() {
        const onShow = jest.fn();
        return () => ({ ...neverTargeted, onShow });
    }

    describe.each([
        [[makeAlwaysTargetedHook(), makeAlwaysTargetedHook(), makeAlwaysTargetedHook()], 0],
        [[makeAlwaysTargetedHook(), makeAlwaysTargetedHook(), makeNeverTargetedHook()], 0],
        [[makeNeverTargetedHook(), makeNeverTargetedHook(), makeAlwaysTargetedHook()], 2],
        [[makeNeverTargetedHook(), makeNeverTargetedHook(), makeNeverTargetedHook()], null],
        [[makeNeverTargetedHook(), makeAlwaysTargetedHook()], 1],
    ])('basic hook usage', (targetingApis, expectedIndexToBeShown) => {
        test(`should only show targetingApi at index: ${expectedIndexToBeShown}`, () => {
            const showOneTargetingApis = makeUseShowOne(targetingApis);

            const hooks = showOneTargetingApis.map(useShowOne => renderHook(() => useShowOne()));

            // call onShow on expected first
            if (expectedIndexToBeShown !== null) {
                const { result } = hooks[expectedIndexToBeShown];
                expect(result.current.canShow).toBe(true);
                act(() => result.current.onShow());
            }

            // call onShow on rest
            hooks.forEach(({ result }) => {
                act(() => result.current.onShow());
            });

            hooks.forEach(({ result, rerender }, index) => {
                let expected;

                if (expectedIndexToBeShown === null) {
                    const { result: originalHookResult } = renderHook(() => showOneTargetingApis[index](true));
                    // should be the original value of onShow
                    expected = originalHookResult.current.canShow;
                } else {
                    rerender();
                    // only expected can show as it was requested first
                    expected = index === expectedIndexToBeShown;
                }
                expect(result.current.canShow).toBe(expected);
            });

            targetingApis.forEach((targetingApi, index) => {
                if (index === expectedIndexToBeShown) {
                    expect(targetingApi().onShow).toHaveBeenCalled();
                } else {
                    expect(targetingApi().onShow).not.toHaveBeenCalled();
                }
            });
        });
    });
});
