import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Button from '../../button/Button';
import ImageTooltip from '../ImageTooltip';
// @ts-ignore flow import
import testImageSrc from '../getTestImageSrc';

describe('components/image-tooltip/ImageTooltip', () => {
    test('should correctly render an ImageTooltip', () => {
        const image = <img alt="foo" src={testImageSrc} />;

        const wrapper: ShallowWrapper = shallow(
            <ImageTooltip content="Foo content" image={image} isShown title="Bar">
                <Button>Callout</Button>
            </ImageTooltip>,
        );

        expect(wrapper.find('Tooltip')).toBeTruthy();
        expect(wrapper.find('Button')).toBeTruthy();
    });
});
