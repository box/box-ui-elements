// @flow
import mapRowToCellData from '../mapRowToCellData';

describe('features/virtualized-table/mapRowToCellData', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: 'cellData',
            rowData: {
                id: 'id',
                name: 'name',
                description: 'description',
            },
        };
    });

    test('should call cell renderer and pass cellRendererParams with cellData mapped using the specified rowData keys', () => {
        const cellRenderer = jest.fn();
        const mappedCellRenderer = mapRowToCellData(cellRenderer, 'name', 'description');

        mappedCellRenderer(cellRendererParams);

        expect(cellRenderer).toHaveBeenCalledTimes(1);
        expect(cellRenderer).toHaveBeenCalledWith({
            ...cellRendererParams,
            cellData: {
                name: 'name',
                description: 'description',
            },
        });
    });
});
