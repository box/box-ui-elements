import set from 'lodash/set';
import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemProperties from '../../../features/item-details/ItemProperties';
import InlineError from '../../../components/inline-error/InlineError';
import SidebarFileProperties, { SidebarFilePropertiesComponent } from '../SidebarFileProperties';
import { PLACEHOLDER_USER } from '../../../constants';

describe('elements/content-sidebar/SidebarFileProperties', () => {
    const getWrapper = props => shallow(<SidebarFilePropertiesComponent {...props} />);
    const getMountWrapper = props => mount(<SidebarFilePropertiesComponent {...props} />);
    const props = {
        file: {
            content_created_at: '2018-04-18T16:56:05.352Z',
            content_modified_at: '2018-04-18T16:56:05.352Z',
            description: 'foo',
            owned_by: {
                name: 'foo',
            },
            created_by: {
                name: 'foo',
            },
            size: '1',
            permissions: {
                can_rename: true,
            },
            uploader_display_name: 'File Request',
        },
        onDescriptionChange: jest.fn(),
        intl: {
            locale: 'en',
        },
    };

    const retentionPolicyProps = {
        file: {
            size: '1',
        },
        hasRetentionPolicy: true,
        onRetentionPolicyExtendClick: jest.fn(),
        retentionPolicy: {
            dispositionTime: 1556317461,
            policyName: 'test policy',
            policyType: 'finite',
            retentionPolicyDescription: 'test policy (1 year retention & auto-deletion',
        },
        intl: {
            locale: 'en',
        },
    };

    describe('render()', () => {
        test('should render ItemProperties', () => {
            const wrapper = getWrapper(props);

            expect(wrapper.find(ItemProperties)).toHaveLength(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render ItemProperties for anonymous uploaders', () => {
            const propsHere = set({ ...props }, 'file.created_by.id', PLACEHOLDER_USER.id);
            const wrapper = getWrapper(propsHere);

            expect(wrapper.find(ItemProperties)).toHaveLength(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render an error', () => {
            const fakeError = {
                id: 'foo',
                description: 'bar',
                defaultMessage: 'baz',
            };

            const errorProps = {
                inlineError: {
                    title: fakeError,
                    content: fakeError,
                },
            };
            const wrapper = shallow(<SidebarFileProperties {...errorProps} />).dive();

            expect(wrapper.find(InlineError)).toHaveLength(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render retention policy information when given proper props and callback', () => {
            const wrapper = getMountWrapper(retentionPolicyProps);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
