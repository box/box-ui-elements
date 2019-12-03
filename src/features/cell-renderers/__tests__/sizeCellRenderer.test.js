// @flow
import getSize from '../../../utils/size';
import sizeCellRenderer from '../sizeCellRenderer';

jest.mock('../../../utils/size');

describe('features/cell-renderers/sizeCellRenderer', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: 2000,
        };
        getSize.mockImplementation(value => `${value} petaflops`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(sizeCellRenderer()(cellRendererParams)).toBe('—');
    });

    test('should render a PrettyBytesCell', () => {
        expect(sizeCellRenderer()(cellRendererParams)).toMatchSnapshot();
    });

    test('should set default multiplier when not provided', () => {
        cellRendererParams.cellData = 1;
        sizeCellRenderer()(cellRendererParams);
        expect(getSize).toHaveBeenCalledTimes(1);
        expect(getSize).toHaveBeenCalledWith(1);
    });

    test('should call getSize with provided multiplier', () => {
        cellRendererParams.cellData = 1;

        sizeCellRenderer(200)(cellRendererParams);
        expect(getSize).toHaveBeenLastCalledWith(200);
        expect(getSize).toHaveBeenCalledTimes(1);

        sizeCellRenderer(500)(cellRendererParams);
        expect(getSize).toHaveBeenLastCalledWith(500);
        expect(getSize).toHaveBeenCalledTimes(2);
    });

    test('should call getSize with numeric equivalent of cellData', () => {
        cellRendererParams.cellData = '123';

        sizeCellRenderer(1)(cellRendererParams);
        expect(getSize).toHaveBeenCalledWith(123);
        expect(getSize).toHaveBeenCalledTimes(1);
    });
});
