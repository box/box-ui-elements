// @flow
import timeFromNow from '../../../utils/relativeTime';
import { formatUser } from '../FormattedUser';
import lastModifiedByCellRenderer from '../lastModifiedByCellRenderer';

jest.mock('../FormattedUser', () => ({
    formatUser: jest.fn().mockImplementation(({ id, name, email }) => `${id}-${name}-${email}`),
}));

describe('features/virtualized-table-renderers/lastModifiedByCellRenderer', () => {
    let cellRendererParams;
    let intl;

    beforeEach(() => {
        cellRendererParams = {
            cellData: {
                modified_at: '2019-07-18T13:45:09-07:00',
                modified_by: {
                    id: '123',
                    email: 'a@a.com',
                    name: 'Rando',
                    login: 'a@a.com',
                },
            },
        };

        intl = {
            formatDate: jest.fn().mockImplementation(value => value),
            formatRelativeTime: jest.fn().mockImplementation((value, unit) => `${Math.abs(value)} ${unit}s ago`),
            formatMessage: jest
                .fn()
                .mockImplementation((message, { lastModified, user }) => `${lastModified} by ${user}`),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render a dash when cellData is missing', () => {
        cellRendererParams.cellData = null;
        expect(lastModifiedByCellRenderer(intl)(cellRendererParams)).toBe('--');
    });

    test('should call support functions with appropriate values', () => {
        const { cellData } = cellRendererParams;
        const { modified_at, modified_by } = cellData;
        const { id, email, name } = modified_by;

        lastModifiedByCellRenderer(intl)(cellRendererParams);

        expect(formatUser).toHaveBeenCalledTimes(1);
        expect(formatUser).toHaveBeenCalledWith({ id, email, name }, intl);

        expect(intl.formatRelativeTime).toHaveBeenCalledTimes(1);
        const expectedTimeFromNowResult = timeFromNow(Date.parse(modified_at));

        expect(intl.formatRelativeTime).toHaveBeenCalledWith(
            expectedTimeFromNowResult.value,
            expectedTimeFromNowResult.unit,
        );

        expect(intl.formatMessage).toHaveBeenCalledTimes(1);
        expect(intl.formatMessage).toHaveBeenCalledWith(expect.any(Object), {
            lastModified: `${Math.abs(expectedTimeFromNowResult.value)} ${expectedTimeFromNowResult.unit}s ago`,
            user: `${id}-${name}-${email}`,
        });
    });

    test('should call formatTargetUser with login when email is empty', () => {
        const { cellData } = cellRendererParams;
        const { modified_by } = cellData;

        modified_by.email = '';
        modified_by.login = 'log@in.com';
        const { id, login, name } = cellData.modified_by;

        lastModifiedByCellRenderer(intl)(cellRendererParams);

        expect(formatUser).toHaveBeenCalledTimes(1);
        expect(formatUser).toHaveBeenCalledWith({ id, email: login, name }, intl);
    });

    test('should return only date component when modified_by is missing', () => {
        const { cellData } = cellRendererParams;
        const { modified_at } = cellData;
        delete cellData.modified_by;

        const result = lastModifiedByCellRenderer(intl)(cellRendererParams);
        const expectedTimeFromNowResult = timeFromNow(Date.parse(modified_at));

        expect(formatUser).toHaveBeenCalledTimes(0);
        expect(intl.formatMessage).toHaveBeenCalledTimes(0);
        expect(result).toBe(`${Math.abs(expectedTimeFromNowResult.value)} ${expectedTimeFromNowResult.unit}s ago`);
    });

    test('should call formatDate when dateFormat is provided', () => {
        const { cellData } = cellRendererParams;
        const { modified_at } = cellData;
        const dateFormat = { foo: 'bar' };

        lastModifiedByCellRenderer(intl, { dateFormat })(cellRendererParams);

        expect(intl.formatDate).toHaveBeenCalledTimes(1);
        expect(intl.formatDate).toHaveBeenCalledWith(modified_at, dateFormat);
        expect(intl.formatRelativeTime).toHaveBeenCalledTimes(0);
    });
});
