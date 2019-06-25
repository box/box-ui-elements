import defaultInputParser from '../defaultInputParser';

describe('components/pill-selector-dropdown/defaultInputParser', () => {
    let options;

    beforeEach(() => {
        options = [
            {
                value: 'AS',
                displayText: 'American Samoa',
            },
            {
                value: 'CN',
                displayText: 'China',
            },
            {
                value: 'KR',
                displayText: 'Korea, Republic of',
            },
            {
                value: 'JP',
                displayText: 'Japan',
            },
        ];
    });

    test('should replace manual input tokens with matching options when available', () => {
        const inputValue = 'China,japan,no match';
        const mappedOptions = defaultInputParser(inputValue, options, []);

        expect(mappedOptions).toStrictEqual([
            {
                value: 'CN',
                displayText: 'China',
            },
            {
                value: 'JP',
                displayText: 'Japan',
            },
            {
                value: 'no match',
                displayText: 'no match',
            },
        ]);
    });

    test('should only map manual input tokens that are an exact, case insensitive match', () => {
        let mappedOptions;
        let inputValue = 'Korea';

        mappedOptions = defaultInputParser(inputValue, options, []);
        expect(mappedOptions).toEqual([
            {
                value: 'Korea',
                displayText: 'Korea',
            },
        ]);

        inputValue = 'jApAn';
        mappedOptions = defaultInputParser(inputValue, options, []);
        expect(mappedOptions).toStrictEqual([
            {
                value: 'JP',
                displayText: 'Japan',
            },
        ]);
    });

    test('should map manual input items that have an exact, case insensitive match with option values', () => {
        const inputValue = 'cn,jp';
        const mappedOptions = defaultInputParser(inputValue, options, []);

        expect(mappedOptions).toEqual([
            {
                value: 'CN',
                displayText: 'China',
            },
            {
                value: 'JP',
                displayText: 'Japan',
            },
        ]);
    });

    test('should match equivalent item names without comma', () => {
        const inputValue = 'Korea Republic of';
        const mappedOptions = defaultInputParser(inputValue, options, []);

        expect(mappedOptions).toEqual([
            {
                value: 'KR',
                displayText: 'Korea, Republic of',
            },
        ]);
    });

    test('should match equivalent item names without whitespace', () => {
        const inputValue = 'americansamoa';
        const mappedOptions = defaultInputParser(inputValue, options, []);

        expect(mappedOptions).toEqual([
            {
                value: 'AS',
                displayText: 'American Samoa',
            },
        ]);
    });

    test('should filter out duplicate entries', () => {
        const inputValue = 'japan,Japan';
        const mappedOptions = defaultInputParser(inputValue, options, []);

        expect(mappedOptions).toEqual([
            {
                value: 'JP',
                displayText: 'Japan',
            },
        ]);
    });

    test('should filter out tokens that match previously selected options', () => {
        const inputValue = 'china,japan,american samoa';
        const selectedOptions = [
            {
                value: 'CN',
                displayText: 'China',
            },
            {
                value: 'JP',
                displayText: 'Japan',
            },
        ];
        const mappedOptions = defaultInputParser(inputValue, options, selectedOptions);

        expect(mappedOptions).toEqual([
            {
                value: 'AS',
                displayText: 'American Samoa',
            },
        ]);
    });
});
