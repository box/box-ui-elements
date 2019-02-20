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

        test('should call scrollIntoView', () => {
            const itemEl = document.querySelector('.button');
            scrollIntoView(itemEl);
            expect(scrollIntoViewIfNeeded).toHaveBeenCalled();
        });
    });
});
