import React from 'react';
import sinon from 'sinon';
import ContentInsightsSection, { CheckboxWrapper } from '../ContentInsightsSection';

describe('features/unified-share-modal/ContentInsightsSection', () => {
    const defaultItem = {
        type: 'file',
    };
    const defaultConfig = {
        isActive: true,
        requireEmail: false,
        requireNotification: false,
    };

    const getWrapper = (props = {}, contentInsightsConfig = defaultConfig) =>
        shallow(<ContentInsightsSection contentInsightsConfig={contentInsightsConfig} item={defaultItem} {...props} />);

    test('should wrap the component inside a MenuItem component', () => {
        const CheckboxWrapperComponent = shallow(CheckboxWrapper({ wrapComponent: true }));
        expect(CheckboxWrapperComponent).toMatchSnapshot();
    });

    test('should not wrap the component inside a MenuItem component', () => {
        const CheckboxWrapperComponent = CheckboxWrapper({ wrapComponent: false });
        expect(CheckboxWrapperComponent).toBe(undefined);
    });

    test('should not render aything if contentInsightsConfig is empty', () => {
        expect(getWrapper({}, null)).toMatchSnapshot();
    });

    test('should render default component with content insights on', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should render default component with content insights off', () => {
        expect(getWrapper({}, { isActive: false })).toMatchSnapshot();
    });

    test('should render the option checkboxes below if isActive is set to true and renderOptionsInDropdown is false', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('.shared-link-checkgroup-row').length).toBe(1);
        expect(wrapper.find('DropdownMenu').length).toBe(0);
        expect(wrapper.find('Checkbox').length).toBe(2);
    });

    test('should render the option checkboxes in a Dropdown if isActive is set to true and renderOptionsInDropdown is true', () => {
        const wrapper = getWrapper({ renderOptionsInDropdown: true });

        expect(wrapper.find('.shared-link-checkgroup-row').length).toBe(0);
        expect(wrapper.find('DropdownMenu').length).toBe(1);
        expect(wrapper.find('Checkbox').length).toBe(2);
    });

    test('should not render the option checkboxes if isActive is set to false', () => {
        const wrapper = getWrapper({}, { isActive: false });
        expect(wrapper.find('Checkbox').length).toBe(0);
    });

    test.each`
        props                                | config                 | showDescriptionBelow | showDescriptionInTooltip | should
        ${undefined}                         | ${undefined}           | ${false}             | ${true}                  | ${'should render the description inside a tooltip if renderOptionsInDropdown is false'}
        ${{ renderOptionsInDropdown: true }} | ${undefined}           | ${false}             | ${true}                  | ${'should render the description inside a tooltip if isActive is set to true and renderOptionsInDropdown is true'}
        ${{ renderOptionsInDropdown: true }} | ${{ isActive: false }} | ${true}              | ${false}                 | ${'should render the description below the toggle if isActive is set to false and renderOptionsInDropdown is true'}
    `('$should', ({ props, config, showDescriptionBelow, showDescriptionInTooltip }) => {
        const wrapper = getWrapper(props, config);
        expect(wrapper.find('.ContentInsightsSection-description').exists()).toBe(showDescriptionBelow);
        expect(wrapper.find('Tooltip').exists()).toBe(showDescriptionInTooltip);
    });

    test('should call the callback function if the email toggle changes', () => {
        const onAdvancedInsightsEmailToggle = sinon.spy();
        const wrapper = getWrapper({ onAdvancedInsightsEmailToggle }, { isActive: true });
        const requireEmailCheckbox = wrapper.find('[data-testid="require-email"]');
        expect(requireEmailCheckbox.length).toBe(1);
        requireEmailCheckbox.simulate('change');
        expect(onAdvancedInsightsEmailToggle.calledOnce).toBe(true);
    });

    test('should call the event stop propagation when the email toggle is clicked', () => {
        const onAdvancedInsightsEmailToggle = sinon.spy();
        const wrapper = getWrapper({ onAdvancedInsightsEmailToggle }, { isActive: true });
        const requireEmailCheckbox = wrapper.find('[data-testid="require-email"]');
        const event = {
            stopPropagation: jest.fn(),
        };

        requireEmailCheckbox.simulate('click', event);

        expect(event.stopPropagation).toBeCalled();
    });

    test('should call the callback function if the notification toggle changes', () => {
        const onAdvancedInsightsNotificationToggle = sinon.spy();
        const wrapper = getWrapper({ onAdvancedInsightsNotificationToggle }, { isActive: true });
        const requireNotificationCheckbox = wrapper.find('[data-testid="require-notify"]');
        expect(requireNotificationCheckbox.length).toBe(1);
        requireNotificationCheckbox.simulate('change');
        expect(onAdvancedInsightsNotificationToggle.calledOnce).toBe(true);
    });

    test('should call the event stop propagation when the notification toggle is clicked', () => {
        const onAdvancedInsightsNotificationToggle = sinon.spy();
        const wrapper = getWrapper({ onAdvancedInsightsNotificationToggle }, { isActive: true });
        const requireNotificationCheckbox = wrapper.find('[data-testid="require-notify"]');
        const event = {
            stopPropagation: jest.fn(),
        };

        requireNotificationCheckbox.simulate('click', event);

        expect(event.stopPropagation).toBeCalled();
    });

    test('should call the callback function if the email toggle changes', () => {
        const onAdvancedInsightsToggle = sinon.spy();
        const wrapper = getWrapper({ onAdvancedInsightsToggle }, { isActive: true });
        const contentInsightsToggle = wrapper.find('[data-testid="insights-toggle"]');
        expect(contentInsightsToggle.length).toBe(1);
        contentInsightsToggle.simulate('change');
        expect(onAdvancedInsightsToggle.calledOnce).toBe(true);
    });
});
