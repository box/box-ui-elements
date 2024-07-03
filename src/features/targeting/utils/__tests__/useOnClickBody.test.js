import { renderHook } from '@testing-library/react';
import useOnClickBody from '../useOnClickBody';

describe('useOnClickBody', () => {
    let addEventListenerSpy;
    let removeEventListenerSpy;

    beforeEach(() => {
        addEventListenerSpy = jest.spyOn(document.body, 'addEventListener');
        removeEventListenerSpy = jest.spyOn(document.body, 'removeEventListener');
        jest.clearAllMocks();
    });

    test('attaches click and contextmenu event listeners when enabled', () => {
        const onClick = jest.fn();
        renderHook(() => useOnClickBody(onClick, true));

        expect(addEventListenerSpy).toHaveBeenCalledWith('click', onClick);
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', onClick);
    });

    test('does not attach event listeners when not enabled', () => {
        const onClick = jest.fn();
        renderHook(() => useOnClickBody(onClick, false));

        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    test('removes event listeners on cleanup when enabled', () => {
        const onClick = jest.fn();
        const { unmount } = renderHook(() => useOnClickBody(onClick, true));
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('click', onClick);
        expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', onClick);
    });

    test('does not remove event listeners on cleanup when not enabled', () => {
        const onClick = jest.fn();
        const { unmount } = renderHook(() => useOnClickBody(onClick, false));
        unmount();

        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    test('re-attaches event listeners when onClick handler changes', () => {
        const onClick1 = jest.fn();
        const onClick2 = jest.fn();
        const { rerender } = renderHook(({ onClick }) => useOnClickBody(onClick, true), {
            initialProps: { onClick: onClick1 },
        });

        rerender({ onClick: onClick2 });

        expect(removeEventListenerSpy).toHaveBeenCalledWith('click', onClick1);
        expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', onClick1);
        expect(addEventListenerSpy).toHaveBeenCalledWith('click', onClick2);
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', onClick2);
    });

    test('does not re-attach event listeners when enable state changes but onClick remains the same', () => {
        const onClick = jest.fn();
        const { rerender } = renderHook(({ enable }) => useOnClickBody(onClick, enable), {
            initialProps: { enable: true },
        });

        rerender({ enable: false });
        expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

        rerender({ enable: true });
        expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
});
