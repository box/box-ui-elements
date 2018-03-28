import React from 'react';
import { shallow, mount } from 'enzyme';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import SidebarFilePropertiesComponent, { SidebarFileProperties as WrappedComponent } from '../SidebarFileProperties';

jest.mock('box-react-ui/lib/components/error-mask/ErrorMask', () => 'error-mask-mock');

describe('components/ContentSidebar/SidebarFileProperties', () => {
    const getWrapper = (props) => shallow(<WrappedComponent {...props} />);

    test('should render the versions when total_count > 0', () => {
        const props = {
            file: {
                created_at: 'foo',
                description: 'foo',
                modified_at: 'foo',
                owned_by: {
                    name: 'foo'
                },
                created_by: {
                    name: 'foo'
                },
                size: '1',
                permissions: {
                    can_rename: true
                }
            },
            onDescriptionChange: jest.fn(),
            intl: {
                locale: 'en'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(ItemProperties)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error', () => {
        const props = {
            maskError: {
                errorHeader: {
                    defaultMessage: 'foo'
                }
            }
        };
        const wrapper = mount(<SidebarFilePropertiesComponent {...props} />);

        expect(wrapper.find(ErrorMask)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});
