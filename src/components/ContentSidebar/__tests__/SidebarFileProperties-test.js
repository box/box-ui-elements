import React from 'react';
import { shallow, mount } from 'enzyme';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import SidebarFileProperties, {
    SidebarFilePropertiesComponent,
    getClassificationModal,
} from '../SidebarFileProperties';
import { KEY_CLASSIFICATION_TYPE } from '../../../constants';

describe('components/ContentSidebar/SidebarFileProperties', () => {
    const getWrapper = props => shallow(<SidebarFilePropertiesComponent {...props} />);
    const getMountWrapper = props => mount(<SidebarFilePropertiesComponent {...props} />);
    const props = {
        file: {
            created_at: '2018-04-18T16:56:05.352Z',
            description: 'foo',
            content_modified_at: '2018-04-18T16:56:05.352Z',
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
        },
        onDescriptionChange: jest.fn(),
        intl: {
            locale: 'en',
        },
    };

    const classificationProps = {
        hasClassification: true,
        onClassificationClick: jest.fn(),
        bannerPolicy: {
            body: 'tooltip value',
        },
        file: {
            size: '1',
            permissions: {
                can_upload: false,
            },
        },
        intl: {
            locale: 'en',
        },
        classification: {
            [KEY_CLASSIFICATION_TYPE]: 'Public',
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

        test('should not render classification information if hasClassification is false', () => {
            const wrapper = getMountWrapper({
                ...props,
                hasClassification: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render classification information and not link when given proper metadata', () => {
            const wrapper = getMountWrapper(classificationProps);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render classification link only when given callback and has_upload permission is true', () => {
            // Only onClassificationClick callback is passed
            const wrapper = getMountWrapper({
                ...classificationProps,
                file: {
                    ...classificationProps.file,
                    permissions: {
                        can_upload: true,
                    },
                    metadata: null,
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not render a tooltip if no banner policy body is provided', () => {
            const wrapper = getMountWrapper({
                ...classificationProps,
                bannerPolicy: undefined,
                file: {
                    ...classificationProps.file,
                    permissions: {
                        can_upload: true,
                    },
                    metadata: null,
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render retention policy information when given proper props and callback', () => {
            const wrapper = getMountWrapper(retentionPolicyProps);
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('getClassificationModal()', () => {
        test('should not have onClassificationClick prop on SidebarFileProperties when can_upload is falsy', () => {
            expect(
                getClassificationModal(classificationProps.file, classificationProps.onClassificationClick),
            ).toBeUndefined();
        });

        test('should have onClassificationClick prop on SidebarFileProperties when can_upload is true', () => {
            expect(
                getClassificationModal(
                    {
                        ...classificationProps.file,
                        permissions: {
                            can_upload: true,
                        },
                    },
                    classificationProps.onClassificationClick,
                ),
            ).toEqual(classificationProps.onClassificationClick);
        });
    });
});
