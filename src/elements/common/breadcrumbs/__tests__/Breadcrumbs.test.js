// @flow
import { shallow } from 'enzyme';
import { BreadcrumbsBase } from '../Breadcrumbs';

describe('Breadcrumbs', () => {
    let intl;
    const getWrapper = (props = {}) => shallow(BreadcrumbsBase(props));
    const allFilesLocalized = 'localizedValue';

    beforeEach(() => {
        intl = {
            formatMessage: jest.fn().mockReturnValue(allFilesLocalized),
        };
    });

    test('should render "All Files" breadcrumb in localized string', () => {
        const crumbs = [{ id: '0', name: 'All Files' }];
        const wrapper = getWrapper({ crumbs, delimiter: 'caret', onCrumbClick: jest.fn(), rootId: '123123', intl });
        const breadCrumb = wrapper.find('Breadcrumb');
        expect(breadCrumb.prop('name')).toBe(allFilesLocalized);
    });
});
