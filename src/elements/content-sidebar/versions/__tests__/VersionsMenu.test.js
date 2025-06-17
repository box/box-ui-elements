import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import VersionsMenu from '../VersionsMenu';

jest.mock('../VersionsGroup', () => {
    const MockVersionsGroup = jest.fn(
        ({
            heading,
            versions,
            fileId,
            versionCount,
            versionLimit,
            currentId,
            routerDisabled,
            internalSidebarNavigation,
        }) => (
            <div>
                <h1>{heading}</h1>
                <span>{versions.length} versions</span>
                {fileId && <span data-testid="fileId">{fileId}</span>}
                {versionCount !== undefined && <span data-testid="versionCount">{versionCount}</span>}
                {versionLimit !== undefined && <span data-testid="versionLimit">{versionLimit}</span>}
                {currentId && <span data-testid="currentId">{currentId}</span>}
                {routerDisabled !== undefined && <span data-testid="routerDisabled">{String(routerDisabled)}</span>}
                {internalSidebarNavigation && (
                    <span data-testid="internalSidebarNavigation">{JSON.stringify(internalSidebarNavigation)}</span>
                )}
            </div>
        ),
    );
    return MockVersionsGroup;
});

describe('elements/content-sidebar/versions/VersionsMenu', () => {
    const defaultDate = '2019-06-20T20:00:00.000Z';
    const defaultDateMs = new Date(defaultDate).valueOf();
    const defaultVersion = {
        id: '12345',
        action: 'upload',
        created_at: new Date(defaultDate),
        modified_at: new Date(defaultDate),
        modified_by: { name: 'Test User', id: '098765' },
    };
    const getVersion = (overrides = {}) => ({ ...defaultVersion, ...overrides });
    const renderComponent = (props = {}) => render(<VersionsMenu {...props} />);
    const GlobalDate = Date;

    beforeEach(() => {
        jest.clearAllMocks();
        global.Date = jest.fn(date => new GlobalDate(date || defaultDate));
        global.Date.now = () => defaultDateMs;
    });

    afterEach(() => {
        global.Date = GlobalDate;
    });

    describe('render', () => {
        test('should render version groups based on their created_at date', () => {
            const versions = [
                getVersion({ created_at: '2019-06-20T20:00:00.000Z', id: '10' }),
                getVersion({ created_at: '2019-06-20T18:00:00.000Z', id: '9' }),
                getVersion({ created_at: '2019-06-19T20:00:00.000Z', id: '8' }),
                getVersion({ created_at: '2019-06-18T20:00:00.000Z', id: '7' }),
                getVersion({ created_at: '2019-06-17T20:00:00.000Z', id: '6' }),
                getVersion({ created_at: '2019-06-16T20:00:00.000Z', id: '5' }),
                getVersion({ created_at: '2019-06-01T20:00:00.000Z', id: '4' }),
                getVersion({ created_at: '2019-05-30T20:00:00.000Z', id: '3' }),
                getVersion({ created_at: '2019-02-01T20:00:00.000Z', id: '2' }),
                getVersion({ created_at: '2018-05-01T20:00:00.000Z', id: '1' }),
            ];
            renderComponent({ versions });
            const headings = [
                'Today',
                'Yesterday',
                'Tuesday',
                'Monday',
                'Last Week',
                'This Month',
                'May',
                'February',
                '2018',
            ];
            const versionCounts = [2, 1, 1, 1, 1, 1, 1, 1, 1];

            expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(9);

            headings.forEach((heading, index) => {
                const headingElement = screen.getByText(heading);
                const groupContainer = headingElement.parentElement;

                expect(groupContainer).toHaveTextContent(`${versionCounts[index]} versions`);
            });
        });

        test('should pass down other props to VersionsGroup', () => {
            const versions = [getVersion({ id: '10' })];
            const props = {
                versions,
                fileId: 'f_123',
                versionCount: 10,
                versionLimit: 100,
                currentId: '10',
                routerDisabled: false,
                internalSidebarNavigation: { open: false, sidebar: 'activity' },
            };
            renderComponent(props);

            expect(screen.getByTestId('fileId')).toHaveTextContent('f_123');
            expect(screen.getByTestId('versionCount')).toHaveTextContent('10');
            expect(screen.getByTestId('versionLimit')).toHaveTextContent('100');
            expect(screen.getByTestId('currentId')).toHaveTextContent('10');
            expect(screen.getByTestId('routerDisabled')).toHaveTextContent('false');
            expect(screen.getByTestId('internalSidebarNavigation')).toHaveTextContent(
                JSON.stringify(props.internalSidebarNavigation),
            );
        });
    });
});
