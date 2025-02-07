// @flow
import { shallow } from 'enzyme';
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
    const getWrapper = (props = {}) => shallow(Breadcrumbs(props));

    test('should render "All Files" breadcrumb in localized string', () => {
        const crumbs = [{ id: '0', name: 'All Files' }];
        const wrapper = getWrapper({ crumbs, delimiter: 'caret', onCrumbClick: jest.fn(), rootId: '123123' });
        const breadCrumb = wrapper.find('Breadcrumb');
        expect(breadCrumb.prop('name')).toBe('All Files');
    });
});
