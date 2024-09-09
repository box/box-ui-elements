import React from 'react';

import { render } from '../../../../test-utils/testing-library';

import ContentExplorerInfoNotice from '../ContentExplorerInfoNotice';

describe('features/content-explorer/content-explorer/ContentExplorerInfoNotice', () => {
    const renderComponent = (infoNoticeText: string) =>
        render(<ContentExplorerInfoNotice infoNoticeText={infoNoticeText} />);

    test('should render correctly', () => {
        const infoNoticeText = 'This is an info notice';
        const { getByText } = renderComponent(infoNoticeText);
        expect(getByText(infoNoticeText)).toBeInTheDocument();
    });
});
