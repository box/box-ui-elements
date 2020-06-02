import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Button from '../../button/Button';
import VisualTooltip from '../VisualTooltip';
import testImageSrc from '../getTestImageSrc';

describe('components/visual-tooltip/VisualTooltip', () => {
    test('should correctly render VisualTooltip', () => {
        const image = <img src={testImageSrc} alt="foo" />;

        const wrapper: ShallowWrapper = shallow(
            <VisualTooltip content="Foo content" image={image} isShown title="Bar">
                <Button>Callout</Button>
            </VisualTooltip>,
        );

        expect(wrapper.find('Tooltip')).toBeTruthy();
        expect(wrapper.find('Button')).toBeTruthy();
    });
});
