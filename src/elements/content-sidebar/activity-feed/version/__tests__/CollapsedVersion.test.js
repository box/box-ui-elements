import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ACTION_TYPE_CREATED, ACTION_TYPE_RESTORED, ACTION_TYPE_TRASHED } from '../../../../../constants';
import CollapsedVersion from '../CollapsedVersion';
import selectors from '../../../../common/selectors/version';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
}));

describe('elements/content-sidebar/ActivityFeed/version/CollapsedVersion', () => {
    beforeEach(() => {
        selectors.getVersionAction = jest.fn().mockReturnValue('upload');
    });

    const intl = {
        formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
    };

    const renderComponent = props =>
        render(
            <IntlProvider locale="en">
                <CollapsedVersion
                    intl={intl}
                    collaborators={{ 1: { name: 'Person one', id: 1 } }}
                    version_start={1}
                    version_end={10}
                    versions={[]}
                    id={0}
                    {...props}
                />
            </IntlProvider>,
        );

    test('should correctly render for single collaborator', () => {
        renderComponent();

        expect(screen.getByText('Person one')).toBeInTheDocument();
        expect(screen.getByText('uploaded v')).toBeInTheDocument();
        expect(screen.getByText('1 - 10')).toBeInTheDocument();
    });

    test('should correctly render for multiple collaborators', () => {
        renderComponent({
            collaborators: { 1: { name: 'Person one', id: 1 }, 2: { name: 'Person two', id: 2 } },
        });

        expect(screen.getByText('2 collaborators uploaded v')).toBeInTheDocument();
        expect(screen.getByText('1 - 10')).toBeInTheDocument();
    });

    test('should correctly render info icon if onInfo is passed', () => {
        renderComponent({
            onInfo: () => {},
        });

        expect(screen.getByLabelText('Get version information')).toBeInTheDocument();
    });

    test('should not render a message if action is not upload', () => {
        selectors.getVersionAction.mockReturnValueOnce('delete');

        renderComponent();

        expect(screen.queryByText('Person one')).not.toBeInTheDocument();
    });

    test.each`
        actionType              | actionText
        ${ACTION_TYPE_RESTORED} | ${'restored v'}
        ${ACTION_TYPE_TRASHED}  | ${'deleted v'}
        ${ACTION_TYPE_CREATED}  | ${'uploaded v'}
    `('should correctly render when shouldUseUAA is true with actionType $actionType', ({ actionType, actionText }) => {
        renderComponent({
            shouldUseUAA: true,
            action_type: actionType,
            action_by: [{ name: 'John Doe', id: 3 }],
            version_start: 2,
            version_end: 4,
        });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(actionText)).toBeInTheDocument();
        expect(screen.getByText('2 - 4')).toBeInTheDocument();
    });
});
