import defaultDropdownFilter from '../defaultDropdownFilter';

describe('components/pill-selector-dropdown/filters/defaultDropdownFilter', () => {
    const options = [
        { displayText: 'value1', value: 'value1' },
        { displayText: 'value11', value: 'value11' },
        { displayText: 'value2', value: 'value2' },
        { displayText: 'value3', value: 'value3' },
        { displayText: 'value4', value: 'value4' },
        { displayText: 'value5', value: 'value5' },
    ];
    const selectedOptions = [
        { displayText: 'value11', value: 'value11' },
        { displayText: 'value2', value: 'value2' },
        { displayText: 'value5', value: 'value5' },
    ];

    test('should return all items when nothing to filter', () => {
        expect(defaultDropdownFilter(options)).toStrictEqual(options);
    });

    test('should return filtered items when selected options are provided', () => {
        expect(defaultDropdownFilter(options, selectedOptions)).toStrictEqual([
            { displayText: 'value1', value: 'value1' },
            { displayText: 'value3', value: 'value3' },
            { displayText: 'value4', value: 'value4' },
        ]);
    });

    test('should return filtered items when input text is provided', () => {
        expect(defaultDropdownFilter(options, null, '1')).toStrictEqual([
            { displayText: 'value1', value: 'value1' },
            { displayText: 'value11', value: 'value11' },
        ]);
    });

    test('should return filtered items when both selected options and input text is provided', () => {
        expect(defaultDropdownFilter(options, selectedOptions, '1')).toStrictEqual([
            { displayText: 'value1', value: 'value1' },
        ]);
    });
});
