import React from 'react';
import { screen, render } from '../../../test-utils/testing-library';
import BoxAISidebarComponent, { BoxAISidebarProps } from '../BoxAISidebar';

describe('elements/content-sidebar/BoxAISidebar', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            onExpandPressed: jest.fn(),
        } satisfies BoxAISidebarProps;

        render(<BoxAISidebarComponent {...defaultProps} {...props} />);
    };

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Box AI' })).toBeInTheDocument();
    });
});
