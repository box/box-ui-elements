// @flow
import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils/testing-library';

import * as libDom from '../../../utils/dom';
import ThumbnailCardDetails from '../ThumbnailCardDetails';

const renderComponent = (props = {}) => render(<ThumbnailCardDetails title={<div>Foo Bar!</div>} {...props} />);

jest.mock('../../../utils/dom', () => ({ useIsContentOverflowed: jest.fn() }));

describe('components/thumbnail-card/ThumbnailCardDetails', () => {
    beforeEach(() => {
        libDom.useIsContentOverflowed.mockReturnValue(false);
    });

    test('should render', () => {
        const { container } = renderComponent();

        expect(container.querySelector('.thumbnail-card-details')).toBeInTheDocument();
    });

    test('should render icon', () => {
        const icon = <img alt="icon" />;
        renderComponent({ icon });

        expect(screen.queryByAltText('icon')).toBeInTheDocument();
    });

    test('should render subtitle', () => {
        const subtitle = <div>Subtitle!</div>;
        const { container } = renderComponent({ subtitle });

        expect(container.querySelector('.thumbnail-card-subtitle')).toBeInTheDocument();
    });

    test('should render actionItem', () => {
        const actionText = 'Click Me';
        const actionItem = <button type="button">{actionText}</button>;
        renderComponent({ actionItem });

        expect(screen.getByText(actionText)).toBeInTheDocument();
    });

    test('should render a Tooltip if text is overflowed', async () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);
        renderComponent();

        await userEvent.tab();

        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    test('should accept a keydown callback', async () => {
        const someFunction = jest.fn();
        const { container } = renderComponent({ onKeyDown: someFunction });
        const title = container.querySelector('.thumbnail-card-title');

        await userEvent.type(title, '{enter}');

        expect(someFunction).toHaveBeenCalled();
    });
});
