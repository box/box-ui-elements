// @flow
import baseCellRenderer from '../baseCellRenderer';

describe('features/virtualized-table-renderers/baseCellRenderer', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: 'cellData',
        };
    });

    test('should return a dash and avoid calling renderValue when cellData is null or undefined or empty', () => {
        let result;
        const renderValue = jest.fn();

        cellRendererParams.cellData = undefined;
        result = baseCellRenderer(cellRendererParams, renderValue);
        expect(result).toBe('--');

        cellRendererParams.cellData = null;
        result = baseCellRenderer(cellRendererParams, renderValue);
        expect(result).toBe('--');

        cellRendererParams.cellData = '';
        result = baseCellRenderer(cellRendererParams, renderValue);
        expect(result).toBe('--');

        expect(renderValue).toHaveBeenCalledTimes(0);
    });

    test('should render string representation of cellData when renderValue is not provided', () => {
        cellRendererParams.cellData = 123;
        expect(baseCellRenderer(cellRendererParams)).toBe('123');
    });

    test('should call renderValue with cellData when value is defined', () => {
        const renderValue = jest.fn();

        cellRendererParams.cellData = 123;
        baseCellRenderer(cellRendererParams, renderValue);

        expect(renderValue).toHaveBeenCalledTimes(1);
        expect(renderValue).toHaveBeenCalledWith(123);
    });
});
