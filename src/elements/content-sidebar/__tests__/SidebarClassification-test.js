import React from 'react';
import { shallow } from 'enzyme';

import Collapsible from '../../../components/collapsible';
import { SidebarClassificationComponent as SidebarClassification } from '../SidebarClassification';

describe('elements/content-sidebar/SidebarClassification', () => {
    const getWrapper = props => shallow(<SidebarClassification {...props} />);

    describe('render()', () => {
        test('should render nothing when unclassified and can_upload is false', () => {
            const props = {
                file: {
                    permissions: {
                        can_upload: false,
                    },
                },
                onEdit: jest.fn(),
                intl: {
                    formatMessage: jest.fn(),
                },
            };
            const wrapper = getWrapper(props);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render classification with an edit button when can_upload is true', () => {
            const props = {
                classification: {
                    name: 'Public',
                    advisoryMessage: 'message',
                },
                file: {
                    permissions: {
                        can_upload: true,
                    },
                },
                onEdit: jest.fn(),
                intl: {
                    formatMessage: jest.fn(),
                },
            };
            const wrapper = getWrapper(props);
            const collapsible = wrapper.find(Collapsible);
            const button = shallow(collapsible.prop('headerActionItems'));
            expect(collapsible).toHaveLength(1);
            expect(wrapper).toMatchSnapshot();
            button.simulate('click');
            expect(props.onEdit).toHaveBeenCalled();
        });

        test('should render classification with no edit button when can_upload is false', () => {
            const wrapper = getWrapper({
                classification: {
                    name: 'Public',
                    advisoryMessage: 'message',
                },
                onEdit: jest.fn(),
                intl: {
                    formatMessage: jest.fn(),
                },
            });
            const collapsible = wrapper.find(Collapsible);
            expect(collapsible.prop('headerActionItems')).toBeNull();
            expect(collapsible).toHaveLength(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render classification with no edit button when onEdit is null', () => {
            const wrapper = getWrapper({
                classification: {
                    name: 'Public',
                    advisoryMessage: 'message',
                },
                onEdit: null,
                file: {
                    permissions: {
                        can_upload: true,
                    },
                },
                intl: {
                    formatMessage: jest.fn(),
                },
            });
            const collapsible = wrapper.find(Collapsible);
            expect(collapsible.prop('headerActionItems')).toBeNull();
            expect(collapsible).toHaveLength(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
