import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { scrollIntoView } from '../dom';

jest.mock('scroll-into-view-if-needed');

describe('util/dom', () => {
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
            expect(scrollIntoViewIfNeeded).toHaveBeenCalledWith(itemEl, false, undefined, parentEl);
        });

        test('should not call scrollIntoViewIfNeeded when parent element is evaluated as null', () => {
            const itemEl = document.querySelector('.input');
            scrollIntoView(itemEl);
            expect(scrollIntoViewIfNeeded).not.toHaveBeenCalled();
        });
    });
});
