import { decode } from '../keys';

describe('decode()', () => {
    test('should return empty when no key', () => {
        expect(
            decode({
                key: '',
            }),
        ).toBe('');
    });
    test('should return empty when modifier and key are same', () => {
        expect(
            decode({
                key: 'Control',
                ctrlKey: true,
            }),
        ).toBe('');
    });
    test('should return correct wtesth ctrl modifier', () => {
        expect(
            decode({
                key: '1',
                ctrlKey: true,
            }),
        ).toBe('Control+1');
    });
    test('should return correct wtesth shift modifier', () => {
        expect(
            decode({
                key: '1',
                shiftKey: true,
            }),
        ).toBe('Shift+1');
    });
    test('should return correct wtesth meta modifier', () => {
        expect(
            decode({
                key: '1',
                metaKey: true,
            }),
        ).toBe('Meta+1');
    });
    test('should return space key', () => {
        expect(
            decode({
                key: ' ',
            }),
        ).toBe('Space');
    });
    test('should return right arrow key', () => {
        expect(
            decode({
                key: 'Right',
            }),
        ).toBe('ArrowRight');
    });
    test('should return left arrow key', () => {
        expect(
            decode({
                key: 'Left',
            }),
        ).toBe('ArrowLeft');
    });
    test('should return up arrow key', () => {
        expect(
            decode({
                key: 'Up',
            }),
        ).toBe('ArrowUp');
    });
    test('should return down arrow key', () => {
        expect(
            decode({
                key: 'Down',
            }),
        ).toBe('ArrowDown');
    });
    test('should return esc key', () => {
        expect(
            decode({
                key: 'U+001B',
            }),
        ).toBe('Escape');
    });
    test('should decode correct UTF8 key', () => {
        expect(
            decode({
                key: 'U+0041',
            }),
        ).toBe('A');
    });
});
