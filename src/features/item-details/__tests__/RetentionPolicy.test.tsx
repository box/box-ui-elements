import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';

import RetentionPolicy from '../RetentionPolicy';

const dispositionTime = 1489899991883;

const formattedDispositionDate = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
}).format(new Date(dispositionTime));

describe('features/item-details/RetentionPolicy', () => {
    const renderPolicy = (props: React.ComponentProps<typeof RetentionPolicy> = {}) =>
        render(
            <dl>
                <RetentionPolicy {...props} />
            </dl>,
        );

    test('renders nothing when the policy description is missing', () => {
        renderPolicy();

        expect(screen.queryByText('Policy')).not.toBeInTheDocument();
    });

    test('renders the policy name without an expiration when the policy is indefinite', () => {
        renderPolicy({
            policyType: 'indefinite',
            retentionPolicyDescription: 'Policy one',
        });

        expect(screen.getByText('Policy')).toBeVisible();
        expect(screen.getByText('Policy one')).toBeVisible();
        expect(screen.queryByText('Policy Expiration')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Extend' })).not.toBeInTheDocument();
    });

    test('renders the expiration date when the policy is finite', () => {
        renderPolicy({
            dispositionTime,
            policyType: 'finite',
            retentionPolicyDescription: 'Policy one',
        });

        expect(screen.getByText('Policy')).toBeVisible();
        expect(screen.getByText('Policy one')).toBeVisible();
        expect(screen.getByText('Policy Expiration')).toBeVisible();
        expect(screen.getByText(formattedDispositionDate)).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Extend' })).not.toBeInTheDocument();
    });

    test('calls openModal when Extend is clicked', async () => {
        const openModal = jest.fn();

        renderPolicy({
            dispositionTime,
            openModal,
            policyType: 'finite',
            retentionPolicyDescription: 'Retention',
        });

        await userEvent.click(screen.getByRole('button', { name: 'Extend' }));

        expect(openModal).toHaveBeenCalledTimes(1);
    });
});
