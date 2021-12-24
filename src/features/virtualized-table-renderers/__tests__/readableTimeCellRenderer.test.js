// @flow
import readableTimeCellRenderer from '../readableTimeCellRenderer';

describe('features/virtualized-table-renderers/readableTimeCellRenderer', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: '2019-07-18T13:45:09-07:00',
        };
    });

    test('should render a DateCell with formatted date', () => {
        expect(readableTimeCellRenderer(cellRendererParams)).toMatchSnapshot();
    });

    test('should handle already parsed date', () => {
        cellRendererParams = { cellData: 1563482709000 };
        expect(readableTimeCellRenderer(cellRendererParams)).toMatchSnapshot();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(readableTimeCellRenderer(cellRendererParams)).toBe('--');
    });
});
