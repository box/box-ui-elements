import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import Button from '../../button/Button';
import VisualTooltip from '../VisualTooltip';
import testImageSrc from '../getTestImageSrc';

describe('components/visual-tooltip/VisualTooltip', () => {
    test('should correctly render default component', () => {
        const tooltipContent = 'Hey I am content';
        const tooltipTitle = 'I am a title';
        const wrapper: ReactWrapper = mount(
            <VisualTooltip content={tooltipContent} imageSrc={testImageSrc} isShown title={tooltipTitle}>
                <Button>Callout</Button>
            </VisualTooltip>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
