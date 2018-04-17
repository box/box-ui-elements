import React from 'react';
import { shallow, mount } from 'enzyme';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import ClassificationProperty from 'box-react-ui/lib/features/classification/ClassificationProperty';
import SidebarFileProperties, { SidebarFilePropertiesComponent } from '../SidebarFileProperties';
import { KEY_CLASSIFICATION, KEY_CLASSIFICATION_TYPE } from '../../../constants';

describe('components/ContentSidebar/SidebarFileProperties', () => {
    const getWrapper = (props) => shallow(<SidebarFilePropertiesComponent {...props} />);
    const getMountWrapper = (props) => mount(<SidebarFilePropertiesComponent {...props} />);
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

    jest.mock('box-react-ui/lib/features/classification/ClassificationProperty', () => 'classification-property');

    test('should render ItemProperties', () => {
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

        const wrapper = getMountWrapper(props);
        expect(wrapper.find(ClassificationProperty)).toHaveLength(1);
    });
});
