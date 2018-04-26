import React from 'react';
import { shallow, mount } from 'enzyme';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import SidebarFileProperties, { SidebarFilePropertiesComponent } from '../SidebarFileProperties';
import { KEY_CLASSIFICATION, KEY_CLASSIFICATION_TYPE } from '../../../constants';

describe('components/ContentSidebar/SidebarFileProperties', () => {
    const getWrapper = (props) => shallow(<SidebarFilePropertiesComponent {...props} />);
    const getMountWrapper = (props) => mount(<SidebarFilePropertiesComponent {...props} />);
    const props = {
        file: {
            created_at: '2018-04-18T16:56:05.352Z',
            description: 'foo',
            modified_at: '2018-04-18T16:56:05.352Z',
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

    const classificationProps = {
        hasClassification: true,
        onClassificationClick: jest.fn(),
        file: {
            size: '1',
            metadata: {
                enterprise: {
                    [KEY_CLASSIFICATION]: {
                        [KEY_CLASSIFICATION_TYPE]: 'Public'
                    }
                }
            }
        },
        intl: {
            locale: 'en'
        }
    };

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

    test('should not render classification information if no props are included', () => {
        props.hasClassification = false;
        const wrapper = getMountWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render classification information when given proper metadata and callback', () => {
        const wrapper = getMountWrapper(classificationProps);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render classification link when given correct callback', () => {
        // Only onClassificationClick callback is passed
        classificationProps.file.metadata = null;
        const wrapper = getMountWrapper(classificationProps);
        expect(wrapper).toMatchSnapshot();
    });
});
