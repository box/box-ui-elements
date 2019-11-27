// @flow
import { mount } from 'enzyme';
import lastModifiedByCellRenderer from '../lastModifiedByCellRenderer';

describe('features/cell-renderers/lastModifiedByCellRenderer', () => {
    let cellRendererParams;

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                modifiedAt: '2019-07-18T13:45:09-07:00',
                modifiedBy: {
                    id: '123',
                    email: 'a@a.com',
                    name: 'Rando',
                    login: 'a@a.com',
                },
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(lastModifiedByCellRenderer()(cellRendererParams)).toBe('—');
    });

    test('should render a LastModifiedByCell', () => {
        expect(lastModifiedByCellRenderer()(cellRendererParams)).toMatchSnapshot();
    });

    test('should call support functions with appropriate values', () => {
        const { cellData } = cellRendererParams;
        const { modifiedBy } = cellData;
        const { id, email, name } = modifiedBy;

        const formattedMessage = mount(lastModifiedByCellRenderer()(cellRendererParams));
        const formattedUser = mount(formattedMessage.props().values.user);

        expect(formattedUser.props()).toEqual({ id, email, name });
    });

    test('should call formatTargetUser with login when email is empty', () => {
        const { cellData } = cellRendererParams;
        const { modifiedBy } = cellData;

        modifiedBy.email = '';
        modifiedBy.login = 'log@in.com';
        const { id, login, name } = cellData.modifiedBy;

        const formattedMessage = mount(lastModifiedByCellRenderer()(cellRendererParams));
        const formattedUser = mount(formattedMessage.props().values.user);

        expect(formattedUser.props()).toEqual({ id, email: login, name });
    });

    test('should return only date component when modifiedBy is missing', () => {
        const { cellData } = cellRendererParams;
        const { modifiedAt } = cellData;
        delete cellData.modifiedBy;

        const result = mount(lastModifiedByCellRenderer()(cellRendererParams));

        expect(result.props().value.user).toBeUndefined();
        expect(result.props().value).toBe(Date.parse(modifiedAt));
    });
});
