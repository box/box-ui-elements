import React from 'react';
import { mount } from 'enzyme';

import OverlayHeader from '../OverlayHeader';
import PrimaryButton from '../../primary-button/PrimaryButton';

describe('components/fullscreen-flyout/OverlayHeader', () => {
    describe('render()', () => {
        test('should render a div no props when called', () => {
            const wrapper = mount(<OverlayHeader className="oh-class" />);

            expect(wrapper.childAt(0).prop('className')).toEqual('overlay-header oh-class');
            expect(wrapper.find('div.oh-text').children.length).toBe(1);
            expect(wrapper.find('div.oh-buttons').children.length).toBe(1);
        });

        test('should render a div with primaryTitle props called', () => {
            const wrapper = mount(<OverlayHeader primaryTitle="primary" />);

            expect(wrapper.childAt(0).prop('className')).toEqual('overlay-header');
            expect(wrapper.find('div.oh-text').children.length).toBe(1);
            expect(wrapper.find('div.oh-buttons').children.length).toBe(1);
        });

        test('should render a div with all props called', () => {
            const wrapper = mount(
                <OverlayHeader
                    primaryTitle="primary"
                    secondaryTitle="secondary"
                    actionButton={<PrimaryButton>Button</PrimaryButton>}
                />,
            );

            expect(wrapper.childAt(0).prop('className')).toEqual('overlay-header');
            expect(wrapper.find('div.oh-text').children.length).toBe(1);
            expect(wrapper.find('div.oh-buttons').children.length).toBe(1);
        });
    });
});
