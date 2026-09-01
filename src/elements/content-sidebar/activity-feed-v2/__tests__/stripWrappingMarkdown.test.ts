import { stripWrappingMarkdown } from '../stripWrappingMarkdown';

describe('stripWrappingMarkdown', () => {
    test('returns empty input unchanged', () => {
        expect(stripWrappingMarkdown('')).toBe('');
    });

    test('strips bold, italic, and underline wraps', () => {
        expect(stripWrappingMarkdown('**bold**')).toBe('bold');
        expect(stripWrappingMarkdown('_italic_')).toBe('italic');
        expect(stripWrappingMarkdown('*italic*')).toBe('italic');
        expect(stripWrappingMarkdown('++under++')).toBe('under');
        expect(stripWrappingMarkdown('__bold__')).toBe('bold');
    });

    test('strips stacked wraps', () => {
        expect(stripWrappingMarkdown('++**_stacked_**++')).toBe('stacked');
    });

    test('preserves mention tokens and strips wraps around adjacent text', () => {
        expect(stripWrappingMarkdown('@[7340978551:Jose Gaston] ++pie++')).toBe('@[7340978551:Jose Gaston] pie');
        expect(stripWrappingMarkdown('**@[7340978551:Jose Gaston]**')).toBe('@[7340978551:Jose Gaston]');
    });

    test('leaves list markers unchanged', () => {
        expect(stripWrappingMarkdown('- @[7340978551:Jose Gaston] dogs')).toBe('- @[7340978551:Jose Gaston] dogs');
        expect(stripWrappingMarkdown('1. numbered')).toBe('1. numbered');
    });

    test('leaves plain text and newlines unchanged', () => {
        expect(stripWrappingMarkdown('Hello world')).toBe('Hello world');
        expect(stripWrappingMarkdown('Line 1\nLine 2')).toBe('Line 1\nLine 2');
    });

    test('leaves unclosed underline literal', () => {
        expect(stripWrappingMarkdown('++unclosed')).toBe('++unclosed');
    });
});
