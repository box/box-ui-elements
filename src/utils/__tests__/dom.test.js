import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { isActivateKey, isLeftClick, scrollIntoView } from '../dom';

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
});
