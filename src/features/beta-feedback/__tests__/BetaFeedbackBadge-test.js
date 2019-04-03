import React from 'react';

import BetaFeedbackBadge from '../BetaFeedbackBadge';

describe('features/beta-feedback/BetaFeedbackBadge', () => {
    const getWrapper = (
        props = {
            formUrl: 'http://example.org/',
        },
    ) => shallow(<BetaFeedbackBadge {...props} />);

    test('should render default component', () => {
        const component = getWrapper();

        expect(component).toMatchSnapshot();
    });

    test('should render component with tooltip as requested', () => {
        const component = getWrapper({ tooltip: true });

        expect(component).toMatchSnapshot();
    });
});
