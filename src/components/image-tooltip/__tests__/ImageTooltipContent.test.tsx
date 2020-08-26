import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ImageTooltipContent from '../ImageTooltipContent';
import testImageSrc from '../getTestImageSrc';

describe('components/image-tooltip/ImageTooltipContent', () => {
    test('should correctly render an ImageTooltipContent', () => {
        const tooltipContent = 'Hey I am content';
        const tooltipTitle = 'I am a title';
        const image = <img src={testImageSrc} alt="foo" />;
        const onImageLoadMock = jest.fn();

        const wrapper: ShallowWrapper = shallow(
            <ImageTooltipContent content={tooltipContent} onImageLoad={onImageLoadMock} title={tooltipTitle}>
                {image}
            </ImageTooltipContent>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
