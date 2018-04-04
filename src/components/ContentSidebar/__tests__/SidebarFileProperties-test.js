import React from 'react';
import { shallow } from 'enzyme';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import SidebarFileProperties, { SidebarFilePropertiesComponent } from '../SidebarFileProperties';

describe('components/ContentSidebar/SidebarFileProperties', () => {
    const getWrapper = (props) => shallow(<SidebarFilePropertiesComponent {...props} />);

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
            inlineError: {
                title: 'foo',
                content: 'bar'
            }
        };
        const wrapper = shallow(<SidebarFileProperties {...props} />).dive();

        expect(wrapper.find(InlineError)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});
