import { renderHook, cleanup } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import useOnClickBody from '../useOnClickBody';

describe('components/targeting/utils/useOnClickBody', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('should properly act based on shouldAct function', () => {
        const onClick = jest.fn();
        const shouldAct = jest.fn();

        test('should run onClick when shouldAct returns true', () => {
            shouldAct.mockImplementation(() => true);
            renderHook(() => useOnClickBody(onClick, true, shouldAct));
            fireEvent.click(document);
            expect(shouldAct).toHaveBeenCalled();
            expect(onClick).toHaveBeenCalled();
        });

        test('should NOT run onClick when shouldAct returns false', () => {
            shouldAct.mockImplementation(() => false);
            renderHook(() => useOnClickBody(onClick, true, shouldAct));
            fireEvent.click(document);
            expect(shouldAct).toHaveBeenCalled();
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('should properly attach and remove event listener', () => {
        const onClick1 = jest.fn();
        const onClick2 = jest.fn();
        const addEventListener = jest.fn();
        const removeEventListener = jest.fn();

        beforeAll(() => {
            Object.defineProperty(document, 'addEventListener', {
                value: addEventListener,
            });
            Object.defineProperty(document, 'removeEventListener', {
                value: removeEventListener,
            });
        });

        test('should attach and remove event listener when enabled', async () => {
            renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
                initialProps: { onClick: onClick1, enable: true },
            });
            expect(addEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledTimes(0);
            expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(addEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
            await cleanup();
            expect(addEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(removeEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
        });

        test('should remove event listener when enable is turned off', async () => {
            const { rerender } = renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
                initialProps: { onClick: onClick1, enable: true },
            });
            expect(addEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledTimes(0);
            expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(addEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
            rerender({ onClick: onClick1, enable: false });
            expect(addEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(removeEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
            await cleanup();
        });

        test('should remove and reattach event listener when onClick changed', async () => {
            const { rerender } = renderHook(({ onClick, enable }) => useOnClickBody(onClick, enable), {
                initialProps: { onClick: onClick1, enable: true },
            });
            expect(addEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledTimes(0);
            expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(addEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
            rerender({ onClick: onClick2, enable: true });
            expect(addEventListener).toHaveBeenCalledTimes(4);
            expect(removeEventListener).toHaveBeenCalledTimes(2);
            expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(removeEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
            expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(addEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
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
            expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
            expect(addEventListener).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
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
});
