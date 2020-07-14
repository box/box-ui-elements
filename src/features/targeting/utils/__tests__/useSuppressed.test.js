import { renderHook } from '@testing-library/react-hooks';
import useSuppressed from '../useSuppressed';

describe('components/targeting/utils/useSuppressed', () => {
    const onShow = jest.fn();
    const onClose = jest.fn();
    const onComplete = jest.fn();
    const targetingApi = { canShow: true, onShow, onClose, onComplete };
    const useTargetingApi = () => targetingApi;

    test('should suppress targetingApi if shouldSuppress is true', () => {
        const { result, rerender } = renderHook(
            useShouldSuppress => useSuppressed(useTargetingApi, useShouldSuppress),
            {
                initialProps: () => false,
            },
        );
        // when not suppressed
        const unsuppressed = result.current;
        expect(unsuppressed.canShow).toBe(true);
        unsuppressed.onShow();
        unsuppressed.onClose();
        unsuppressed.onComplete();
        expect(onShow).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledTimes(1);
        // when suppressed
        rerender(() => true);
        const suppressed = result.current;
        expect(suppressed.canShow).toBe(false);
        suppressed.onShow();
        expect(onShow).toHaveBeenCalledTimes(1);
        suppressed.onClose();
        expect(onClose).toHaveBeenCalledTimes(1);
        suppressed.onComplete();
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});
