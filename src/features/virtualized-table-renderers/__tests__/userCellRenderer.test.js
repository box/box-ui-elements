// @flow
import { mount } from 'enzyme';
import userCellRenderer from '../userCellRenderer';

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
        expect(userCellRenderer(cellRendererParams)).toBe('—');
    });

    test('should render a UserCell', () => {
        expect(userCellRenderer(cellRendererParams)).toMatchSnapshot();
    });

    test('should fall back to login when email is not provided', () => {
        let result = mount(userCellRenderer(cellRendererParams));
        expect(result.text()).toBe('Marlon Rando (a@a.com)');

        delete cellRendererParams.cellData.email;
        cellRendererParams.cellData.login = 'login@log.in';
        result = mount(userCellRenderer(cellRendererParams));
        expect(result.text()).toBe('Marlon Rando (login@log.in)');
    });
});
