// @flow
import userCellRenderer from '../userCellRenderer';

const intl = {
    formatMessage: jest.fn().mockImplementation(message => message),
};

describe('features/virtualized-table-renderers/userCellRenderer', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                id: '123',
                email: 'a@a.com',
                name: 'Marlon Rando',
                login: 'a@a.com',
            },
        };
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(userCellRenderer(intl)(cellRendererParams)).toBe('—');
    });

    test('should render a UserCell', () => {
        expect(userCellRenderer(intl)(cellRendererParams)).toMatchSnapshot();
    });

    test('should fall back to login when email is not provided', () => {
        expect(userCellRenderer(intl)(cellRendererParams)).toBe('Marlon Rando (a@a.com)');

        delete cellRendererParams.cellData.email;
        cellRendererParams.cellData.login = 'login@log.in';
        expect(userCellRenderer(intl)(cellRendererParams)).toBe('Marlon Rando (login@log.in)');
    });
});
