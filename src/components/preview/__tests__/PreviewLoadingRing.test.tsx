import React from 'react';
import { shallow } from 'enzyme';
import PreviewLoadingRing from '../PreviewLoadingRing';

const getWrapper = (props = {}) => shallow(<PreviewLoadingRing {...props} />);

describe('components/preview/PreviewLoadingRing', () => {
    describe('render()', () => {
        test.each(['dark', 'light'])('should pass its theme prop (%s) to a css class', theme => {
            const wrapper = getWrapper({ theme });

            expect(wrapper.hasClass(`bdl-PreviewLoadingRing--${theme}`)).toBe(true);
        });

        test.each(['#fff', undefined])('should pass its color prop (%s) to its border', color => {
            const wrapper = getWrapper({ color });

            expect(wrapper.exists({ style: { backgroundColor: color } })).toBe(true);
        });

        test('should render its children', () => {
            const Child = () => <div className="test">Test</div>;
            const wrapper = getWrapper({ children: <Child /> });

            expect(wrapper.exists(Child)).toBe(true);
        });
    });
});
