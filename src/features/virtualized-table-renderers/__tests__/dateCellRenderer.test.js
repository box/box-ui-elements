// @flow
import dateCellRenderer from '../dateCellRenderer';

jest.mock('../../../utils/datetime', () => ({
    formatDateTime: jest.fn().mockImplementation(value => `FORMATTED: ${value}`),
}));

describe('features/virtualized-table-renderers/dateCellRenderer', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: '2019-07-18T13:45:09-07:00',
        };
    });

    test('should render a DateCell with formatted date', () => {
        expect(dateCellRenderer(cellRendererParams)).toMatchSnapshot();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(dateCellRenderer(cellRendererParams)).toBe('—');
    });
});
