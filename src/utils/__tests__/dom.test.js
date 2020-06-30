import { renderHook } from '@testing-library/react-hooks';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { isActivateKey, isFocusableElement, isLeftClick, scrollIntoView, useIsContentOverflowed } from '../dom';

jest.mock('scroll-into-view-if-needed');

describe('util/dom', () => {
    describe('isActivateKey', () => {
        test('should return true for enter and space keys', () => {
            expect(isActivateKey({ key: 'Enter' })).toBe(true);
            expect(isActivateKey({ key: ' ' })).toBe(true);
        });

        test('should return false for all other keys', () => {
            expect(isActivateKey({ key: 'Ctrl' })).toBe(false);
            expect(isActivateKey({ key: 'Tab' })).toBe(false);
        });
    });

    describe('isLeftClick', () => {
        test('should return true for unmodified left click events', () => {
            expect(isLeftClick({ button: 0 })).toBe(true);
        });

        test('should return false for modified left click events', () => {
            expect(isLeftClick({ button: 0, altKey: true })).toBe(false);
            expect(isLeftClick({ button: 0, ctrlKey: true })).toBe(false);
            expect(isLeftClick({ button: 0, metaKey: true })).toBe(false);
            expect(isLeftClick({ button: 0, shiftKey: true })).toBe(false);
        });

        test('should return false for unmodified right click events', () => {
            expect(isLeftClick({ button: 1 })).toBe(false);
        });
    });

    describe('scrollIntoView()', () => {
        beforeEach(() => {
            // Set up a place to mount
            document.body.innerHTML = '<div class="modal"> <div class="button" /> </div>';
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        test('should call scrollIntoViewIfNeeded when parent element is found', () => {
            const itemEl = document.querySelector('.button');
            const parentEl = document.querySelector('.modal');
            scrollIntoView(itemEl);
            expect(scrollIntoViewIfNeeded).toHaveBeenCalledWith(itemEl, {
                boundary: parentEl,
                scrollMode: 'if-needed',
            });
        });

        test('should not call scrollIntoViewIfNeeded when parent element is evaluated as null', () => {
            const itemEl = document.querySelector('.input');
            scrollIntoView(itemEl);
            expect(scrollIntoViewIfNeeded).not.toHaveBeenCalled();
        });
    });

    describe('isFocusableElement', () => {
        afterEach(() => {
            document.body.innerHTML = '';
        });

        test.each`
            innerHTMLValue                                                                       | result   | description
            ${null}                                                                              | ${false} | ${'null'}
            ${'<span class="checkbox-pointer-target"/>'}                                         | ${true}  | ${'an element with a checkbox class'}
            ${'<div class="checkbox-label"><span class="other-classname"></span></div>'}         | ${true}  | ${'an element with a parent with a checkbox class'}
            ${'<div class="other-parent-classname"><span class="other-classname"></span></div>'} | ${false} | ${'an element with no checkbox classes and a parent without a checkbox class'}
            ${'<span class="other-classname"/>'}                                                 | ${false} | ${'an element with no checkbox classes and no parent element'}
            ${'<span class="btn-content"/>'}                                                     | ${true}  | ${'an element with a button class'}
            ${'<button class="btn" type="submit"><span class="other-classname"/></div>'}         | ${true}  | ${'an element with a parent with a button class'}
            ${'<button class="bdl-Button" type="submit"><span class="other-classname"/></div>'}  | ${true}  | ${'an element with a parent with a bdl-namespaced button class'}
            ${'<div class="other-parent-classname"><span class="other-classname"/></div>'}       | ${false} | ${'an element with no button classes and a parent without a button class'}
            ${'<span className="other-classname" />'}                                            | ${false} | ${'an element with no button classes and no parent element'}
        `('returns $result when given $description', ({ innerHTMLValue, result }) => {
            document.body.innerHTML = innerHTMLValue;
            const spanElement = document.querySelector('span');
            expect(isFocusableElement(spanElement)).toBe(result);
        });
    });

    describe('useIsContentOverflowed', () => {
        test.each`
            ref                                                  | isOverflowed | note
            ${{ current: { offsetWidth: 10, scrollWidth: 20 } }} | ${true}      | ${'offset < scroll'}
            ${{ current: { offsetWidth: 20, scrollWidth: 10 } }} | ${false}     | ${'offset > scroll'}
            ${{ current: { offsetWidth: 20, scrollWidth: 20 } }} | ${false}     | ${'offset == scroll'}
            ${{ current: null }}                                 | ${false}     | ${'null ref'}
        `('given $note, result is $isOverflowed', ({ ref, isOverflowed }) => {
            const { result } = renderHook(() => useIsContentOverflowed(ref));
            expect(result.current).toBe(isOverflowed);
        });

        test('responds to change in ref value with new result', async () => {
            const ref = { current: { offsetWidth: 20, scrollWidth: 10 } };
            const { result, rerender } = renderHook(() => useIsContentOverflowed(ref));
            expect(result.current).toBe(false);
            ref.current = { offsetWidth: 10, scrollWidth: 20 };
            rerender();
            expect(result.current).toBe(true);
        });
    });
});
