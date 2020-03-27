// @flow
import { shallow } from 'enzyme';
import PlainButton from '../../../components/plain-button/PlainButton';
import FileIcon from '../../../icons/file-icon';
import itemNameCellRenderer from '../itemNameCellRenderer';

describe('features/virtualized-table-renderers/itemNameCellRenderer', () => {
    let wrapper;
    let cellRendererParams;
    let intl;

    const getWrapper = (props = {}) => shallow(itemNameCellRenderer(intl)(props));

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                name: 'fancy.jpg',
                type: 'file',
                dataAttributes: {
                    'data-resin-target': 'file',
                },
            },
        };
        intl = {
            formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(itemNameCellRenderer(intl)(cellRendererParams)).toBe('--');
    });

    test('should render a itemNameCell', () => {
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render correct data and a span when type is file', () => {
        wrapper = getWrapper(cellRendererParams);

        const content = wrapper.find('.bdl-ItemNameCell-name');

        expect(content.text()).toBe('fancy.jpg');
        expect(content.props()['data-resin-target']).toBe('file');

        expect(wrapper.find(PlainButton)).toHaveLength(0);
        expect(wrapper.find('span')).toHaveLength(2);
    });

    test('should render a PlainButton when type is folder', () => {
        cellRendererParams.cellData.type = 'folder';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(PlainButton)).toHaveLength(1);
        expect(wrapper.find('span')).toHaveLength(1);
    });

    test('should get the extension from the file name and pass it to FileIcon', () => {
        cellRendererParams.cellData.name = 'file.pdf';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(FileIcon).props().extension).toBe('pdf');

        cellRendererParams.cellData.name = 'file.pdf.boxnote';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(FileIcon).props().extension).toBe('boxnote');
    });

    test('should render external file name when isExternal is true', () => {
        cellRendererParams.cellData.isExternal = true;
        wrapper = getWrapper(cellRendererParams);

        expect(wrapper.find('.bdl-ItemNameCell-name').text()).toBe('External File');
    });
});
