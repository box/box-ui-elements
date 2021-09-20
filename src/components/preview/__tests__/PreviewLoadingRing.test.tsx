import React from 'react';
import { shallow } from 'enzyme';
import PreviewLoadingRing from '../PreviewLoadingRing';

const getWrapper = (props = {}) => shallow(<PreviewLoadingRing {...props} />);

describe('components/preview/PreviewLoadingRing', () => {
    describe('render()', () => {
        test('should use its default theme prop if one is not provided', () => {
            const wrapper = getWrapper();

            expect(wrapper.hasClass('bdl-PreviewLoadingRing--light')).toBe(true);
        });

        test.each(['dark', 'light'])('should pass its theme prop (%s) to a css class', theme => {
            const wrapper = getWrapper({ theme });

            expect(wrapper.hasClass(`bdl-PreviewLoadingRing--${theme}`)).toBe(true);
        });

        test('should pass its color prop to its border', () => {
            const wrapper = getWrapper({ color: '#fff' });

            expect(wrapper.exists({ style: { backgroundColor: '#fff' } })).toBe(true);
        });

        test('should not set a style if its color prop is empty', () => {
            const wrapper = getWrapper();

            expect(wrapper.exists({ style: { backgroundColor: undefined } })).toBe(false);
        });

        test('should render its children', () => {
            const Child = () => <div className="test">Test</div>;
            const wrapper = getWrapper({ children: <Child /> });

            expect(wrapper.exists(Child)).toBe(true);
        });
    });
});
