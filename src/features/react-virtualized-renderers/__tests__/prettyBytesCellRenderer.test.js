// @flow
import getSize from '../../../utils/size';

import { BYTES_IN_MB } from '../../../constants';

import prettyBytesCellRenderer from '../prettyBytesCellRenderer';

jest.mock('../../../utils/size');

describe('features/react-virtualized-renderers/prettyBytesCellRenderer', () => {
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
        expect(prettyBytesCellRenderer()(cellRendererParams)).toBe('—');
    });

    test('should render a PrettyBytesCell', () => {
        expect(prettyBytesCellRenderer()(cellRendererParams)).toMatchSnapshot();
    });

    test('should set default multiplier when not provided', () => {
        cellRendererParams.cellData = 1;
        prettyBytesCellRenderer()(cellRendererParams);
        expect(getSize).toHaveBeenCalledTimes(1);
        expect(getSize).toHaveBeenCalledWith(BYTES_IN_MB);
    });

    test('should call getSize with provided multiplier', () => {
        cellRendererParams.cellData = 1;

        prettyBytesCellRenderer(200)(cellRendererParams);
        expect(getSize).toHaveBeenLastCalledWith(200);
        expect(getSize).toHaveBeenCalledTimes(1);

        prettyBytesCellRenderer(500)(cellRendererParams);
        expect(getSize).toHaveBeenLastCalledWith(500);
        expect(getSize).toHaveBeenCalledTimes(2);
    });

    test('should call getSize with numeric equivalent of cellData', () => {
        cellRendererParams.cellData = '123';

        prettyBytesCellRenderer(1)(cellRendererParams);
        expect(getSize).toHaveBeenCalledWith(123);
        expect(getSize).toHaveBeenCalledTimes(1);
    });
});
