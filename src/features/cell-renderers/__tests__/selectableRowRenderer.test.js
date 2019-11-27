// @flow
import { defaultRowRenderer } from 'react-virtualized/dist/es/Table/index';
import selectableRowRenderer from '../selectableRowRenderer';

jest.mock('react-virtualized/dist/es/Table/index');

describe('features/cell-renderers/selectableRowRenderer', () => {
    const alertId = '123';
    const paramsMock = {
        className: 'foo',
        rowData: { id: alertId },
    };

    afterEach(() => jest.resetAllMocks());

    test('should have defaultRowRenderer call with is-selected class when id matches selectedAlert', () => {
        selectableRowRenderer(paramsMock, '456');

        expect(defaultRowRenderer).toBeCalledWith({
            className: 'foo',
            rowData: {
                id: '123',
            },
        });

        selectableRowRenderer(paramsMock, alertId);

        expect(defaultRowRenderer).toBeCalledWith({
            className: 'foo is-selected',
            rowData: {
                id: '123',
            },
        });
    });

    test('should not have defaultRowRenderer call with is-selected class when id is not available', () => {
        selectableRowRenderer(paramsMock);

        expect(defaultRowRenderer).toBeCalledWith({
            className: 'foo',
            rowData: {
                id: '123',
            },
        });
    });
});
