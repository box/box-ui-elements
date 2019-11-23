// @flow
import intl from 'react-intl';

import { formatTargetUser } from '../../../utils/targetUser';

import lastModifiedByCellRenderer from '../lastModifiedByCellRenderer';

jest.mock('react-intl', () => ({
    defineMessages: jest.fn().mockImplementation(value => value),
    formatDate: jest.fn().mockImplementation(value => value),
    formatRelative: jest.fn().mockImplementation(value => `${value} eons ago`),
    formatMessage: jest.fn().mockImplementation((message, { lastModified, user }) => `${lastModified} by ${user}`),
}));

jest.mock('../../../utils/targetUser', () => ({
    formatTargetUser: jest.fn().mockImplementation(({ id, name, email }) => `${id}-${name}-${email}`),
}));

describe('features/react-virtualized-renderers/lastModifiedByCellRenderer', () => {
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
        // const { modifiedAt, modifiedBy } = cellData;
        const { modifiedBy } = cellData;
        const { id, email, name } = modifiedBy;

        lastModifiedByCellRenderer()(cellRendererParams);

        expect(formatTargetUser).toHaveBeenCalledTimes(1);
        expect(formatTargetUser).toHaveBeenCalledWith({ id, email, name });
    });

    test('should call formatTargetUser with login when email is empty', () => {
        const { cellData } = cellRendererParams;
        const { modifiedBy } = cellData;

        modifiedBy.email = '';
        modifiedBy.login = 'log@in.com';
        const { id, login, name } = cellData.modifiedBy;

        lastModifiedByCellRenderer()(cellRendererParams);

        expect(formatTargetUser).toHaveBeenCalledTimes(1);
        expect(formatTargetUser).toHaveBeenCalledWith({ id, email: login, name });
    });

    test('should return only date component when modifiedBy is missing', () => {
        const { cellData } = cellRendererParams;
        const { modifiedAt } = cellData;
        delete cellData.modifiedBy;

        const result = lastModifiedByCellRenderer()(cellRendererParams);

        expect(formatTargetUser).toHaveBeenCalledTimes(0);
        expect(intl.formatMessage).toHaveBeenCalledTimes(0);
        expect(result.props.value).toBe(Date.parse(modifiedAt));
    });
});
