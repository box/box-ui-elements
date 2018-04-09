import React from 'react';
import { shallow } from 'enzyme';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import SidebarFileProperties, { SidebarFilePropertiesComponent } from '../SidebarFileProperties';
import { KEY_CLASSIFICATION, KEY_CLASSIFICATION_TYPE } from '../../../constants';

describe('components/ContentSidebar/SidebarFileProperties', () => {
    const getWrapper = (props) => shallow(<SidebarFilePropertiesComponent {...props} />);
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
    test('should render the versions when total_count > 0', () => {
        const wrapper = getWrapper(props);

        expect(wrapper.find(ItemProperties)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error', () => {
        const fakeError = {
            id: 'foo',
            description: 'bar',
            defaultMessage: 'baz'
        };

        const errorProps = {
            inlineError: {
                title: fakeError,
                content: fakeError
            }
        };
        const wrapper = shallow(<SidebarFileProperties {...errorProps} />).dive();

        expect(wrapper.find(InlineError)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render classification information', () => {
        props.hasClassification = true;
        props.onClassificationClick = jest.fn();
        props.file.metadata = {
            enterprise: {
                [KEY_CLASSIFICATION]: {
                    [KEY_CLASSIFICATION_TYPE]: 'Public'
                }
            }
        };

        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });
});
