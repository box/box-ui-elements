import React from 'react';

import ContentExplorerInfoNotice from '../ContentExplorerInfoNotice';

describe('features/content-explorer/content-explorer/ContentExplorerInfoNotice', () => {
    const renderComponent = infoNoticeText => shallow(<ContentExplorerInfoNotice infoNoticeText={infoNoticeText} />);

    test('should render correctly', () => {
        const wrapper = renderComponent('This is an info notice');
        expect(wrapper).toMatchSnapshot();
    });
});
