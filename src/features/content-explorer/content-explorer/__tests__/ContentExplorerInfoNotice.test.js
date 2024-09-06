import React from 'react';
import { render } from '@testing-library/react';

import ContentExplorerInfoNotice from '../ContentExplorerInfoNotice';

describe('features/content-explorer/content-explorer/ContentExplorerInfoNotice', () => {
    const renderComponent = infoNoticeText => render(<ContentExplorerInfoNotice infoNoticeText={infoNoticeText} />);

    test('should render correctly', () => {
        const infoNoticeText = 'This is an info notice';
        const { getByText } = renderComponent(infoNoticeText);
        expect(getByText(infoNoticeText)).toBeInTheDocument();
    });
});
