import React from 'react';
import Scrollbar from 'react-scrollbars-custom';
import { act } from 'react-dom/test-utils';

import { mountConnected } from '../../../../../test-utils/enzyme';
import { getScrollShadowClassName } from '../../../../collapsible-sidebar/utils/scrollShadow';
import CollapsibleScrollbar from '../CollapsibleScrollbar';

jest.mock('../../../../collapsible-sidebar/utils/scrollShadow', () => ({
    getScrollShadowClassName: jest.fn(),
}));

describe('components/message-center/components/collapsible-scrollbar/CollapsibleScrollbar', () => {
    const getWrapper = (props = {}) => {
        return mountConnected(<CollapsibleScrollbar {...props} />);
    };

    beforeEach(() => {
        getScrollShadowClassName.mockImplementation(() => 'foobar');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should check scroll shadow if content height changes', () => {
        const scrollbar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
        });

        scrollbar.setProps({
            children: [<span key="1">abc</span>, <span key="2">def</span>, <span key="3">foo</span>],
        });

        expect(getScrollShadowClassName).toBeCalled();
    });

    test('should check scroll shadow if scroller height changes', () => {
        const scrollbar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
        });

        scrollbar.find(Scrollbar).prop('onUpdate')({ clientHeight: 0 }, { clientHeight: 100 });
        expect(getScrollShadowClassName).toBeCalled();
    });

    test('scroll states are set when Scollbar component is scrolled', () => {
        const scrollbar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
            expanded: true,
            className: 'foo',
        });

        act(() => {
            scrollbar.find(Scrollbar).prop('onScroll')(
                { scrollHeight: 100, clientHeight: 200, scrollTop: 0 },
                { scrollHeight: 100, clientHeight: 200, scrollTop: 10 },
            );
        });

        scrollbar.update();

        expect(scrollbar.find('[data-testid="content-wrapper"]').hasClass('is-scrolling')).toBe(true);
        expect(scrollbar.find(Scrollbar).hasClass('foobar')).toBe(true);
    });
});
