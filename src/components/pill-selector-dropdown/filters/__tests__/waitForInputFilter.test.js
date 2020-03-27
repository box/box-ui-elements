// @flow
import waitForInputFilter from '../waitForInputFilter';

describe('components/pill-selector-dropdown/filters/waitForInputFilter', () => {
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

    test('should return empty array when input is empty', () => {
        expect(waitForInputFilter(options, null, '1')).toStrictEqual([
            { displayText: 'value1', value: 'value1' },
            { displayText: 'value11', value: 'value11' },
        ]);
        expect(waitForInputFilter(options, null, '')).toEqual([]);
        expect(waitForInputFilter(options, null)).toEqual([]);
    });

    test('should return empty array when input is empty and selected options are provided', () => {
        expect(waitForInputFilter(options, selectedOptions, '1')).toStrictEqual([
            { displayText: 'value1', value: 'value1' },
        ]);
        expect(waitForInputFilter(options, selectedOptions, '')).toEqual([]);
        expect(waitForInputFilter(options, selectedOptions)).toEqual([]);
    });
});
