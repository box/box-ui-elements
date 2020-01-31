// @flow
import userCellRenderer from '../userCellRenderer';

describe('features/virtualized-table-renderers/userCellRenderer', () => {
    let cellRendererParams;
    let intl;

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                id: '123',
                email: 'a@a.com',
                name: 'Marlon Rando',
                login: 'a@a.com',
            },
        };
        intl = {
            formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(userCellRenderer(intl)(cellRendererParams)).toBe('--');
    });

    test('should fall back to login when email is not provided', () => {
        expect(userCellRenderer(intl)(cellRendererParams)).toBe('Marlon Rando (a@a.com)');

        delete cellRendererParams.cellData.email;
        cellRendererParams.cellData.login = 'login@log.in';
        expect(userCellRenderer(intl)(cellRendererParams)).toBe('Marlon Rando (login@log.in)');
    });
});
