// @flow
import { shallow } from 'enzyme';
import filePathCellRenderer from '../filePathCellRenderer';

describe('features/virtualized-table-renderers/filePathCellRenderer', () => {
    let intl;
    const getWrapper = (props = {}) => shallow(filePathCellRenderer(intl)(props));

    beforeEach(() => {
        intl = {
            formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render a dash when cellData is missing', () => {
        expect(filePathCellRenderer(intl)({ cellData: null })).toBe('--');
    });

    test('should render a FilePathCell when all fields are available', () => {
        const cellData = {
            id: '123',
            name: 'fancy.jpg',
            itemType: 'file',
            itemPath: [
                { id: '123', name: 'YouFooMe' },
                { id: '234', name: 'CooMooFoo' },
            ],
            size: 123,
        };
        const wrapper = getWrapper({ cellData });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render a FilePathCell when only id is available', () => {
        const cellData = {
            id: '123',
        };
        const wrapper = getWrapper({ cellData });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render a FilePathCell with "All Files" text when given an external file', () => {
        const cellData = {
            id: '123',
            name: 'fancy.jpg',
            itemType: 'file',
            itemPath: [
                { id: '0', name: 'YouFooMe' },
                { id: '234', name: 'CooMooFoo', isExternal: true },
            ],
            size: 123,
            isExternal: true,
        };
        const wrapper = getWrapper({ cellData });

        expect(wrapper).toMatchSnapshot();
    });
});
