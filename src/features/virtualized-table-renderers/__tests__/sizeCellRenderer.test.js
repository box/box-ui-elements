// @flow
import getSize from '../../../utils/size';
import sizeCellRenderer from '../sizeCellRenderer';
import { DEFAULT_MULTIPLIER } from '../constants';

jest.mock('../../../utils/size');

describe('features/virtualized-table-renderers/sizeCellRenderer', () => {
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
        expect(sizeCellRenderer()(cellRendererParams)).toBe('--');
    });

    test('should render a sizeCell', () => {
        expect(sizeCellRenderer()(cellRendererParams)).toMatchSnapshot();
    });

    test('should set default multiplier when not provided', () => {
        cellRendererParams.cellData = 1;
        sizeCellRenderer()(cellRendererParams);
        expect(getSize).toHaveBeenCalledTimes(1);
        expect(getSize).toHaveBeenCalledWith(1 * DEFAULT_MULTIPLIER);
    });

    test('should call getSize with provided multiplier', () => {
        cellRendererParams.cellData = 1;

        sizeCellRenderer(200)(cellRendererParams);
        expect(getSize).toHaveBeenLastCalledWith(1 * 200);
        expect(getSize).toHaveBeenCalledTimes(1);

        sizeCellRenderer(500)(cellRendererParams);
        expect(getSize).toHaveBeenLastCalledWith(1 * 500);
        expect(getSize).toHaveBeenCalledTimes(2);
    });

    test('should call getSize with numeric equivalent of cellData', () => {
        cellRendererParams.cellData = '123';

        sizeCellRenderer(DEFAULT_MULTIPLIER)(cellRendererParams);
        expect(getSize).toHaveBeenCalledWith(123 * DEFAULT_MULTIPLIER);
        expect(getSize).toHaveBeenCalledTimes(1);
    });
});
