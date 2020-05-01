import { getScrollShadowClassName, getScrollShadowState } from '../scrollShadow';

describe('components/core/collapsible-sidebar/utils/scrollShadow.js', () => {
    describe('getScrollShadowState', () => {
        test('should return no shadow if scroll height is equal to client height', () => {
            const state = getScrollShadowState(0, 10, 10);
            expect(state.isTopOverflowed).toBeFalsy();
            expect(state.isBottomOverflowed).toBeFalsy();
        });

        test('should return shouldShowTopScrollShadow is true if scrollTop is greater than 0', () => {
            const state = getScrollShadowState(10, 10, 10);
            expect(state.isTopOverflowed).toBeTruthy();
            expect(state.isBottomOverflowed).toBeFalsy();
        });

        test('should return shouldShowBottomScrollShadow is true if difference of scrollHeight and clientHeight is greater than scrollTop', () => {
            const state = getScrollShadowState(0, 30, 10);
            expect(state.isTopOverflowed).toBeFalsy();
            expect(state.isBottomOverflowed).toBeTruthy();
        });

        test('should return both states as true if both conditions are met', () => {
            const state = getScrollShadowState(10, 30, 10);
            expect(state.isTopOverflowed).toBeTruthy();
            expect(state.isBottomOverflowed).toBeTruthy();
        });
    });

    describe('getScrollShadowClassName', () => {
        test.each([
            [0, 10, 10, 'scroll-shadow-container'],
            [10, 20, 10, 'scroll-shadow-container is-showing-top-shadow'],
            [0, 30, 10, 'scroll-shadow-container is-showing-bottom-shadow'],
            [10, 30, 10, 'scroll-shadow-container is-showing-top-shadow is-showing-bottom-shadow'],
        ])('should set appropriate class based on scrollState', (scrollTop, scrollHeight, clientHeight, expected) => {
            expect(getScrollShadowClassName(scrollTop, scrollHeight, clientHeight)).toBe(expected);
        });
    });
});
