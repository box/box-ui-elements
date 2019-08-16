// @flow
import defaultNavLinkRenderer from '../defaultNavLinkRenderer';

describe('feature/left-sidebar/defaultNavLinkRenderer', () => {
    const getWrapper = (props = {}) => shallow(defaultNavLinkRenderer(props));

    test('should render default NavLink comoponent', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
});
