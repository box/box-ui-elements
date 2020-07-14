import { renderHook, cleanup } from '@testing-library/react-hooks';
import useOnClickBody from '../useOnClickBody';

const addEventListener = jest.fn();
const removeEventListener = jest.fn();
const onClick1 = jest.fn();
const onClick2 = jest.fn();

Object.defineProperty(document, 'body', {
    value: {
        addEventListener,
        removeEventListener,
    },
});

describe('components/targeting/utils/useOnClickBody', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should attach and remove event listener when enabled', async () => {
        renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
            initialProps: { onClick: onClick1, enable: true },
        });
        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        expect(addEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(addEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
        await cleanup();
        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(removeEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
    });

    test('should remove event listener when enable is turned off', async () => {
        const { rerender } = renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
            initialProps: { onClick: onClick1, enable: true },
        });
        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        expect(addEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(addEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
        rerender({ onClick: onClick1, enable: false });
        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(removeEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
        await cleanup();
    });

    test('should remove and reattach event listener when onClick changed', async () => {
        const { rerender } = renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
            initialProps: { onClick: onClick1, enable: true },
        });
        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        expect(addEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(addEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
        rerender({ onClick: onClick2, enable: true });
        expect(addEventListener).toHaveBeenCalledTimes(4);
        expect(removeEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(removeEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
        expect(addEventListener).toHaveBeenCalledWith('click', onClick2);
        expect(addEventListener).toHaveBeenCalledWith('contextmenu', onClick2);
        await cleanup();
    });

    test('should not attach or remove event listener when not enabled', async () => {
        renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
            initialProps: { onClick: onClick1, enable: false },
        });
        expect(addEventListener).toHaveBeenCalledTimes(0);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        await cleanup();
        expect(addEventListener).toHaveBeenCalledTimes(0);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
    });

    test('should add event listener when enable is turned on', async () => {
        const { rerender } = renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
            initialProps: { onClick: onClick1, enable: false },
        });
        expect(addEventListener).toHaveBeenCalledTimes(0);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        rerender({ onClick: onClick1, enable: true });
        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        expect(addEventListener).toHaveBeenCalledWith('click', onClick1);
        expect(addEventListener).toHaveBeenCalledWith('contextmenu', onClick1);
        await cleanup();
    });

    test('should not attach event listener when onClick changed but enable is off', async () => {
        const { rerender } = renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
            initialProps: { onClick: onClick1, enable: false },
        });
        expect(addEventListener).toHaveBeenCalledTimes(0);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        rerender({ onClick: onClick2, enable: false });
        expect(addEventListener).toHaveBeenCalledTimes(0);
        expect(removeEventListener).toHaveBeenCalledTimes(0);
        await cleanup();
    });
});
