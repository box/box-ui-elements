// @flow
import { shallow } from 'enzyme';
import Link from '../../../components/link/Link';
import FileIcon from '../../../icons/file-icon';
import fileNameCellRenderer from '../fileNameCellRenderer';

const intl = {
    formatMessage: jest.fn().mockImplementation(message => message),
};

describe('features/cell-renderers/fileNameCellRenderer', () => {
    let wrapper;
    let cellRendererParams;

    const getWrapper = (props = {}) => {
        return shallow(fileNameCellRenderer(intl)(props));
    };

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                id: '123',
                name: 'fancy.jpg',
            },
        };
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(fileNameCellRenderer(intl)(cellRendererParams)).toBe('—');
    });

    test('should render a FileNameCell', () => {
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a span instead of Link when id is missing', () => {
        cellRendererParams.cellData.id = '1234';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(Link).props().href).toBe(`/file/${1234}`);

        cellRendererParams.cellData.id = '';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(Link)).toHaveLength(0);
        expect(wrapper.find('span')).toBeTruthy();
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
