import React from 'react';

import Classification from '../Classification';
import ClassifiedBadge from '../ClassifiedBadge';
import SecurityControls from '../security-controls';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';

describe('features/classification/Classification', () => {
    const getWrapper = (props = {}) => shallow(<Classification {...props} />);

    test('should render a classified badge with no definition', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty when classification does not exist but is editable', () => {
        const wrapper = getWrapper();
        expect(wrapper.find(ClassifiedBadge).length).toBe(0);
        expect(wrapper.find('.bdl-Classification-definition').length).toBe(0);
        expect(wrapper.find('.bdl-Classification-missingMessage').length).toBe(0);
    });

    test('should render not classified message', () => {
        const wrapper = getWrapper({
            messageStyle: 'inline',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with an inline definition', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with definition in tooltip', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'tooltip',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with click functionality', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'tooltip',
            onClick: () => {},
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render classification last modified information when modified props are not provided', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
        });
        expect(wrapper.exists('[data-testid="classification-modifiedby"]')).toBe(false);
    });

    test('should not render classification last modified information when message is tooltip', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'tooltip',
            modifiedAt: '2020-07-16T00:51:10.000Z',
            modifiedBy: 'A User',
        });
        expect(wrapper.exists('[data-testid="classification-modifiedby"]')).toBe(false);
    });

    test('should render classification last modified information when provided and message style is inline', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
            modifiedAt: '2020-07-16T00:51:10.000Z',
            modifiedBy: 'A User',
        });
        expect(wrapper.exists('[data-testid="classification-modifiedby"]')).toBe(true);
    });

    test('should render a classified badge with security controls when provided and message style is inline', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
            controls: {
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render security controls when message style is tooltip', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
            controls: {
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            },
        });

        expect(wrapper.find(SecurityControls)).toHaveLength(1);
        wrapper.setProps({ messageStyle: 'tooltip' });
        expect(wrapper.find(SecurityControls)).toHaveLength(0);
    });

    test('should render loading indicator when isLoadingControls is true and controls are not provided', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
            isLoadingControls: true,
        });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(SecurityControls)).toHaveLength(0);
    });

    test('should render loading indicator when isLoadingControls is true and controls are provided', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
            isLoadingControls: true,
            controls: {
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            },
        });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(SecurityControls)).toHaveLength(0);
    });

    test('should not render loading indicator when item is not classified', () => {
        const wrapper = getWrapper({
            messageStyle: 'inline',
            isLoadingControls: true,
        });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper.find(SecurityControls)).toHaveLength(0);
    });

    test('should not render loading indicator when message style is not inline', () => {
        const wrapper = getWrapper({
            messageStyle: 'tooltip',
            isLoadingControls: true,
        });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper.find(SecurityControls)).toHaveLength(0);
    });
});
