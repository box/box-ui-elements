import React from 'react';
import { shallow } from 'enzyme';

import OverlayHeader from '../OverlayHeader';

describe('components/fullscreen-flyout/OverlayHeader', () => {
    describe('render()', () => {
        test('should render a empty header with no props', () => {
            const wrapper = shallow(<OverlayHeader />);
            expect(wrapper.prop('className')).toEqual('bdl-overlay-header');
            expect(wrapper.childAt(0).prop('className')).toEqual('bdl-oh-content');
            expect(wrapper.childAt(1).prop('className')).toEqual('bdl-oh-close-btn');
        });

        test('should pass className to header', () => {
            const wrapper = shallow(<OverlayHeader className="new-class" />);
            expect(wrapper.prop('className')).toEqual('bdl-overlay-header new-class');
        });

        test('should render children in header', () => {
            const wrapper = shallow(
                <OverlayHeader>
                    <div className="header-content">Hello</div>
                </OverlayHeader>,
            );

            expect(wrapper.find('.bdl-oh-content .header-content').length).toBeTruthy();
        });
    });
});
