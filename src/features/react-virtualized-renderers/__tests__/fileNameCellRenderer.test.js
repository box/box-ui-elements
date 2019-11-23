// @flow
import { shallow } from 'enzyme';
import Link from '../../../components/link/Link';
import FileIcon from '../../../icons/file-icon';
import fileNameCellRenderer from '../fileNameCellRenderer';

describe('features/react-virtualized-renderers/fileNameCellRenderer', () => {
    let wrapper;
    let cellRendererParams;

    const getWrapper = (props = {}) => {
        return shallow(fileNameCellRenderer(props));
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
        expect(fileNameCellRenderer(cellRendererParams)).toBe('—');
    });

    test('should render a FileNameCell', () => {
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a Link with empty href when id is missing', () => {
        cellRendererParams.cellData.id = '1234';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(Link).props().href).toBe(`/file/${1234}`);

        cellRendererParams.cellData.id = '';
        wrapper = getWrapper(cellRendererParams);
        expect(wrapper.find(Link).props().href).toBe('');
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
