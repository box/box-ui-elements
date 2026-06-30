import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import SidebarFileProperties, { SidebarFilePropertiesComponent } from '../SidebarFileProperties';
import { PLACEHOLDER_USER } from '../../../constants';

describe('elements/content-sidebar/SidebarFileProperties', () => {
    const baseFile = {
        content_created_at: '2018-04-18T16:56:05.352Z',
        content_modified_at: '2018-04-18T16:56:05.352Z',
        created_by: { name: 'foo' },
        description: 'foo',
        metadata: {
            global: {
                archivedItemTemplate: { archiveDate: '1726832355000' },
            },
        },
        owned_by: { name: 'foo' },
        permissions: { can_rename: true },
        size: '1',
        uploader_display_name: 'File Request',
    };

    const baseProps = {
        file: baseFile,
        intl: { locale: 'en' },
        onDescriptionChange: jest.fn(),
    };

    test('should render ItemProperties with file details', () => {
        render(<SidebarFilePropertiesComponent {...baseProps} />);

        expect(screen.getByTestId('item-properties')).toBeVisible();
        expect(screen.getByText('Owner')).toBeVisible();
        expect(screen.getByText('Uploader')).toBeVisible();
        expect(screen.getByText('Created')).toBeVisible();
        expect(screen.getByText('Modified')).toBeVisible();
        expect(screen.getByText('Archived')).toBeVisible();
        expect(screen.getByText('Size')).toBeVisible();
        expect(screen.getAllByText('foo').length).toBeGreaterThan(0);
        expect(screen.getByText('1 B')).toBeVisible();

        const description = screen.getByDisplayValue('foo');
        expect(description).toHaveAttribute('data-resin-target', 'description');
    });

    test('should use uploader_display_name when uploader is anonymous', () => {
        const props = {
            ...baseProps,
            file: {
                ...baseFile,
                created_by: { ...baseFile.created_by, id: PLACEHOLDER_USER.id },
            },
        };

        render(<SidebarFilePropertiesComponent {...props} />);

        expect(screen.getByText('Uploader')).toBeVisible();
        expect(screen.getByText('File Request')).toBeVisible();
    });

    test('should render an inline error along with the wrapped component', () => {
        const fakeError = {
            defaultMessage: 'baz',
            description: 'bar',
            id: 'foo',
        };

        render(
            <SidebarFileProperties
                file={baseFile}
                inlineError={{ content: fakeError, title: fakeError }}
                onDescriptionChange={jest.fn()}
            />,
        );

        const errorTitles = screen.getAllByText('baz');
        expect(errorTitles.length).toBeGreaterThan(0);
        expect(screen.getByTestId('item-properties')).toBeVisible();
    });

    test('should render retention policy information when hasRetentionPolicy is set', () => {
        const onRetentionPolicyExtendClick = jest.fn();

        render(
            <SidebarFilePropertiesComponent
                file={{ size: '1' }}
                hasRetentionPolicy
                intl={{ locale: 'en' }}
                onRetentionPolicyExtendClick={onRetentionPolicyExtendClick}
                retentionPolicy={{
                    dispositionTime: 1556317461,
                    policyName: 'test policy',
                    policyType: 'finite',
                    retentionPolicyDescription: 'test policy (1 year retention & auto-deletion',
                }}
            />,
        );

        expect(screen.getByText('Policy')).toBeVisible();
        expect(screen.getByText('test policy (1 year retention & auto-deletion')).toBeVisible();
        expect(screen.getByText('Policy Expiration')).toBeVisible();
        expect(screen.getByRole('button', { name: 'Extend' })).toBeVisible();
    });
});
