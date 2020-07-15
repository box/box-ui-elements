import { renderHook, act } from '@testing-library/react-hooks';
import useCallOnce from '../useCallOnce';

describe('components/targeting/utils/useCallOnce', () => {
    const callback = jest.fn(() => 1);

    test('should only call callback once', () => {
        const { result, rerender } = renderHook(() => useCallOnce(callback));

        act(() => expect(result.current()).toBe(1));
        expect(callback).toHaveBeenCalledTimes(1);
        [1, 2, 3].forEach(() => {
            rerender(() => {});
            act(() => expect(result.current()).toBe(undefined));
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});
