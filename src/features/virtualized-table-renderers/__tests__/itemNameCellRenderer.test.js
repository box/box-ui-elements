// @flow
import { shallow } from 'enzyme';
import PlainButton from '../../../components/plain-button/PlainButton';
import FileIcon from '../../../icons/file-icon';
import itemNameCellRenderer from '../itemNameCellRenderer';

const intl = {
    formatMessage: jest.fn().mockImplementation(message => message),
};

describe('features/virtualized-table-renderers/itemNameCellRenderer', () => {
    let wrapper;
    let cellRendererParams;

    const getWrapper = (props = {}) => {
        return shallow(itemNameCellRenderer(intl)(props));
    };

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                id: '123',
                name: 'fancy.jpg',
                type: 'file',
            },
        };
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(itemNameCellRenderer(intl)(cellRendererParams)).toBe('—');
    });

    test('should render a itemNameCell', () => {
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a span when type is file', () => {
        wrapper = getWrapper(cellRendererParams);
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

        expect(wrapper).toMatchSnapshot();
    });
});
