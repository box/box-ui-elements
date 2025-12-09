import * as React from 'react';
import { screen, render } from '../../../../test-utils/testing-library';
import VersionsItemBadge from '../VersionsItemBadge';

describe('elements/content-sidebar/versions/VersionsItemBadge', () => {
    const renderComponent = (props = {}) => render(<VersionsItemBadge {...props} />);

    describe('render', () => {
        test('should render version number badge', () => {
            renderComponent({ versionNumber: '1' });

            expect(screen.getByText('V1')).toBeInTheDocument();
        });

        test('should have correct aria-label', () => {
            renderComponent({ versionNumber: '5' });

            expect(screen.getByLabelText('Version number 5')).toBeInTheDocument();
        });

        test.each`
            isCurrent    | shouldHaveCurrentClass
            ${true}      | ${true}
            ${false}     | ${false}
            ${undefined} | ${false}
        `(
            'should apply current class correctly when isCurrent is $isCurrent',
            ({ isCurrent, shouldHaveCurrentClass }) => {
                renderComponent({ versionNumber: '1', isCurrent });

                const badge = screen.getByText('V1');
                expect(badge).toHaveClass('bcs-VersionsItemBadge');
                if (shouldHaveCurrentClass) {
                    expect(badge).toHaveClass('bcs-VersionsItemBadge--current');
                } else {
                    expect(badge).not.toHaveClass('bcs-VersionsItemBadge--current');
                }
            },
        );
    });
});
