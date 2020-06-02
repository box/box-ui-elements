import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import VisualTooltipContent from '../VisualTooltipContent';
import testImageSrc from '../getTestImageSrc';

describe('components/visual-tooltip/VisualTooltipContent', () => {
    test('should correctly render VisualTooltipContent', () => {
        const tooltipContent = 'Hey I am content';
        const tooltipTitle = 'I am a title';
        const wrapper: ShallowWrapper = shallow(
            <VisualTooltipContent content={tooltipContent} imageSrc={testImageSrc} title={tooltipTitle} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
