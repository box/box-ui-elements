import defaultDropdownRenderer from '../defaultDropdownRenderer';

describe('components/pill-selector-dropdown/defaultDropdownRenderer', () => {
    test('should render a list of data list items', () => {
        expect(
            defaultDropdownRenderer([
                { displayText: 'value1', value: 'value1' },
                { displayText: 'value2', value: 'value2' },
                { displayText: 'value3', value: 'value3' },
            ]),
        ).toMatchSnapshot();
    });
});
