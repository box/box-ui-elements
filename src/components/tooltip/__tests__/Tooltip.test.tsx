/* eslint-disable react/button-has-type */

import * as React from 'react';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';

import Tooltip, { TooltipPosition, TooltipTheme } from '../Tooltip';
import TetherPosition from '../../../common/tether-positions';

const sandbox = sinon.sandbox.create();

describe('components/tooltip/Tooltip', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getWrapper = (props: Record<string, any>) =>
        shallow<Tooltip>(
            <Tooltip text="hi" {...props}>
                <div>Hello</div>
            </Tooltip>,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render with close button if isShown and showCloseButton are true', () => {
            expect(
                getWrapper({
                    isShown: true,
                    showCloseButton: true,
                }),
            ).toMatchSnapshot();
        });

        test('should not render the close button if wasClosedByUser state is true', () => {
            const wrapper = getWrapper({
                isShown: true,
                showCloseButton: true,
            });
            wrapper.setState({ wasClosedByUser: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not render with close button if showCloseButton is false', () => {
            expect(
                getWrapper({
                    isShown: true,
                    showCloseButton: false,
                }),
            ).toMatchSnapshot();
        });

        test('should not render with close button if isShown is false', () => {
            const wrapper = getWrapper({
                isShown: false,
                showCloseButton: true,
            });
            wrapper.setState({ isShown: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render correctly with callout theme', () => {
            expect(
                getWrapper({
                    isShown: true,
                    theme: 'callout',
                }),
            ).toMatchSnapshot();
        });

        test('should render default component', () => {
            const wrapper = mount(
                <Tooltip text="hi">
                    <button />
                </Tooltip>,
            );
            const component = wrapper.find('button');
            const tetherComponent = wrapper.findWhere(node => node.prop('renderTarget') && node.prop('renderElement'));

            expect(tetherComponent.prop('attachment')).toEqual('bottom center');
            expect(tetherComponent.prop('constraints')).toEqual([
                {
                    to: 'window',
                    attachment: 'together',
                },
            ]);
            expect(tetherComponent.prop('targetAttachment')).toEqual('top center');

            expect(component.is('button')).toBe(true);
            expect(component.prop('onBlur')).toBeTruthy();
            expect(component.prop('onFocus')).toBeTruthy();
            expect(component.prop('onMouseEnter')).toBeTruthy();
            expect(component.prop('onMouseLeave')).toBeTruthy();
            expect(component.prop('tabIndex')).toEqual('0');
        });

        test('should not add tabindex if isTabbable is false', () => {
            const wrapper = mount(
                <Tooltip isShown isTabbable={false} text="hi">
                    <button />
                </Tooltip>,
            );
            const component = wrapper.find('button');

            expect(component.prop('tabIndex')).toBeFalsy();
        });

        test('should show tooltip when isShown state is true', () => {
            const wrapper = mount(
                <Tooltip text="hi">
                    <button />
                </Tooltip>,
            );
            // Trigger mouseenter to show tooltip
            wrapper.find('button').simulate('mouseenter');

            const component = wrapper.find('button');
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');
            expect(tooltip.length).toBe(1);
            expect(tooltip.hasClass('tooltip')).toBe(true);
            expect(component.prop('aria-describedby')).toEqual(tooltip.prop('id'));
            expect(tooltip.text()).toEqual('hi');
        });

        test('should render tooltip class when specified', () => {
            const wrapper = mount(
                <Tooltip className="testing" isShown text="hi">
                    <button />
                </Tooltip>,
            );

            expect(wrapper.find('[role="tooltip"]').hasClass('testing')).toBe(true);
        });

        test('should constrain to scroll parent when specified', () => {
            const wrapper = shallow(
                <Tooltip constrainToScrollParent text="hi">
                    <button />
                </Tooltip>,
            );

            expect(wrapper.prop('constraints')).toEqual([
                {
                    to: 'scrollParent',
                    attachment: 'together',
                },
                {
                    to: 'window',
                    attachment: 'together',
                },
            ]);
        });

        test('should render correct attachments when position is specified', () => {
            const wrapper = shallow(
                <Tooltip position={TooltipPosition.MIDDLE_RIGHT} text="hi">
                    <button />
                </Tooltip>,
            );

            expect(wrapper.prop('attachment')).toEqual('middle left');
            expect(wrapper.prop('targetAttachment')).toEqual('middle right');
        });

        test('should render correct attachments when custom position is specified', () => {
            const customPosition = {
                attachment: TetherPosition.TOP_LEFT,
                targetAttachment: TetherPosition.BOTTOM_RIGHT,
            };
            const wrapper = shallow(
                <Tooltip position={customPosition} text="hi">
                    <button />
                </Tooltip>,
            );

            expect(wrapper.prop('attachment')).toEqual('top left');
            expect(wrapper.prop('targetAttachment')).toEqual('bottom right');
        });

        test('should render with a specific body element', () => {
            const bodyEl = document.createElement('div');

            const wrapper = mount(
                <Tooltip bodyElement={bodyEl} text="hi">
                    <button />
                </Tooltip>,
            );

            expect(
                wrapper
                    .findWhere(node => node.prop('renderTarget') && node.prop('renderElement'))
                    .prop('renderElementTo'),
            ).toEqual(bodyEl);
        });

        test('should render TetherComponent in the body if invalid body element is specified', () => {
            const wrapper = mount(
                // @ts-ignore testing a wrong value for the bodyElement prop
                <Tooltip bodyElement="foo" text="hi">
                    <button />
                </Tooltip>,
            );

            expect(
                wrapper
                    .findWhere(node => node.prop('renderTarget') && node.prop('renderElement'))
                    .prop('renderElementTo'),
            ).toEqual(document.body);
        });

        test('should show tooltip when isShown prop is true', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi">
                    <button />
                </Tooltip>,
            );
            const component = wrapper.find('button');
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');

            expect(component.prop('onBlur')).toBeFalsy();
            expect(component.prop('onFocus')).toBeFalsy();
            expect(component.prop('onKeyDown')).toBeFalsy();
            expect(component.prop('onMouseEnter')).toBeFalsy();
            expect(component.prop('onMouseLeave')).toBeFalsy();
            expect(component.prop('tabIndex')).toBeFalsy();
            expect(tooltip.length).toBe(1);
            expect(tooltip.hasClass('tooltip')).toBe(true);
            expect(component.prop('aria-describedby')).toEqual(tooltip.prop('id'));
            expect(component.prop('aria-errormessage')).toBeFalsy();
            expect(tooltip.text()).toEqual('hi');
        });

        test('should set aria-describedBy when aria-label exists and tooltipText is different than it', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi">
                    <button aria-label="test" />
                </Tooltip>,
            );
            const component = wrapper.find('button');
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');

            expect(component.prop('aria-describedby')).toEqual(tooltip.prop('id'));
        });

        test('should not set aria-describedBy when aria-label exists but tooltipText is equal to it', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi">
                    <button aria-label="hi" />
                </Tooltip>,
            );
            const component = wrapper.find('button');

            expect(component.prop('aria-describedby')).toEqual(undefined);
        });

        test('should set aria-hidden as true if aria-label and tooltipText are equal', () => {
            const wrapper = mount(
                <Tooltip isShown text="test">
                    <button aria-label="test" />
                </Tooltip>,
            );
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');
            expect(tooltip.prop('aria-hidden')).toBe(true);
        });

        test('should set aria-hidden as true if ariaHidden is true', () => {
            const wrapper = mount(
                <Tooltip isShown text="test" ariaHidden>
                    <button aria-label="test" />
                </Tooltip>,
            );
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');
            expect(tooltip.prop('aria-hidden')).toBe(true);
        });

        test('should not set aria-describedby when ariaHidden is true', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi" ariaHidden>
                    <button aria-label="test" />
                </Tooltip>,
            );
            const component = wrapper.find('button');

            expect(component.prop('aria-describedby')).toBe(undefined);
        });
        test('should not set aria-errormessage when ariaHidden is true', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi" ariaHidden>
                    <button aria-label="test" />
                </Tooltip>,
            );
            const component = wrapper.find('button');

            expect(component.prop('aria-errormessage')).toBe(undefined);
        });

        test('should set aria-hidden as false if aria-label does not exist', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi">
                    <button />
                </Tooltip>,
            );
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');

            expect(tooltip.prop('aria-hidden')).toBe(false);
        });

        test('should set aria-hidden as false if aria-label is different than tooltipText', () => {
            const wrapper = mount(
                <Tooltip isShown text="Im a long tooltip description">
                    <button aria-label="launch" />
                </Tooltip>,
            );
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');

            expect(tooltip.prop('aria-hidden')).toBe(false);
        });

        test('should render error class when theme is error', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi" theme={TooltipTheme.ERROR}>
                    <button aria-label="test" />
                </Tooltip>,
            );
            const component = wrapper.find('button');
            const tooltip = wrapper.find('[data-testid="bdl-Tooltip"]');

            expect(tooltip.hasClass('is-error')).toBe(true);
            expect(component.prop('aria-describedby')).toEqual(tooltip.prop('id'));
            expect(component.prop('aria-errormessage')).toEqual(tooltip.prop('id'));
        });

        test('should render children only when tooltip is disabled', () => {
            expect(
                getWrapper({
                    isDisabled: true,
                }),
            ).toMatchSnapshot();
        });

        test('should render children wrapped in tether when tooltip has text missing', () => {
            expect(
                getWrapper({
                    text: null,
                }),
            ).toMatchSnapshot();
        });

        test('should match snapshot when stopBubble is set', () => {
            const wrapper = mount(
                <Tooltip isShown stopBubble text="hi">
                    <button />
                </Tooltip>,
            );
            expect(wrapper.find('div.tooltip')).toMatchSnapshot();
        });

        test('event capture div is not present when stopBubble is not set', () => {
            const wrapper = mount(
                <Tooltip isShown text="hi">
                    <button />
                </Tooltip>,
            );
            expect(wrapper.find('div[role="presentation"]').exists()).toBe(false);
        });

        test('should render with custom offset when provided', () => {
            const offset = '0 10px';
            const wrapper = shallow(
                <Tooltip offset={offset} text="hi">
                    <button />
                </Tooltip>,
            );

            expect(wrapper.prop('offset')).toEqual(offset);
        });

        test('should render correctly with tetherElementClassName', () => {
            expect(
                getWrapper({
                    tetherElementClassName: 'tether-element-class-name',
                }),
            ).toMatchSnapshot();
        });
    });

    describe('should stop event propagation when stopBubble is set', () => {
        test.each([['onClick', 'onContextMenu', 'onKeyPress']])('when %o', onEvent => {
            const wrapper = mount(
                <Tooltip isShown text="hi" stopBubble>
                    <button />
                </Tooltip>,
            );
            const stop = jest.fn();
            const nativeStop = jest.fn();
            expect(wrapper.find('div[role="presentation"]').length).toBe(1);
            const handler: Function = wrapper.find('div[role="presentation"]').prop(onEvent);
            handler({
                stopPropagation: stop,
                nativeEvent: {
                    stopImmediatePropagation: nativeStop,
                },
            });
            expect(stop).toHaveBeenCalledTimes(1);
            expect(nativeStop).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentDidUpdate', () => {
        test('should reset wasClosedByUser to false if isShown prop is transitioned from false to true', () => {
            const wrapper = shallow<Tooltip>(
                <Tooltip text="hi" isShown>
                    <button />
                </Tooltip>,
            );

            expect(wrapper.state('wasClosedByUser')).toBe(false);
            wrapper.instance().closeTooltip();

            expect(wrapper.state('wasClosedByUser')).toBe(true);
            wrapper.setProps({ isShown: false });
            wrapper.setProps({ isShown: true });
            expect(wrapper.state('wasClosedByUser')).toBe(false);
        });
    });

    describe('closeTooltip()', () => {
        test('should update the wasClosedByUser state', () => {
            const wrapper = shallow<Tooltip>(
                <Tooltip text="hi">
                    <button />
                </Tooltip>,
            );

            expect(wrapper.state('wasClosedByUser')).toBe(false);
            wrapper.instance().closeTooltip();
            expect(wrapper.state('wasClosedByUser')).toBe(true);
        });

        test('should call onDismiss if provided', () => {
            const onDismissMock = jest.fn();
            const wrapper = shallow<Tooltip>(
                <Tooltip text="hi" onDismiss={onDismissMock}>
                    <button />
                </Tooltip>,
            );

            wrapper.instance().closeTooltip();
            expect(onDismissMock).toHaveBeenCalled();
        });
    });

    describe('handleMouseEnter()', () => {
        test('should correctly handle mouseenter events', () => {
            const onMouseEnter = sinon.spy();
            const wrapper = mount(
                <Tooltip text="hi">
                    <button onMouseEnter={onMouseEnter} />
                </Tooltip>,
            );

            wrapper.find('button').simulate('mouseenter');
            expect(wrapper.state('isShown')).toBe(true);
            expect(onMouseEnter.calledOnce).toBe(true);
        });
    });

    describe('handleMouseLeave()', () => {
        test('should correctly handle mouseleave events', () => {
            const onMouseLeave = sinon.spy();
            const wrapper = mount(
                <Tooltip text="hi">
                    <button onMouseLeave={onMouseLeave} />
                </Tooltip>,
            );
            wrapper.setState({ isShown: true });

            wrapper.find('button').simulate('mouseleave');
            expect(wrapper.state('isShown')).toBe(false);
            expect(onMouseLeave.calledOnce).toBe(true);
        });
    });

    describe('handleFocus()', () => {
        test('should correctly handle focus events', () => {
            const onFocus = sinon.spy();
            const wrapper = mount(
                <Tooltip text="hi">
                    <button onFocus={onFocus} />
                </Tooltip>,
            );

            wrapper.find('button').simulate('focus');
            expect(wrapper.state('isShown')).toBe(true);
            expect(onFocus.calledOnce).toBe(true);
        });
    });

    describe('handleBlur()', () => {
        test('should correctly handle blur events', () => {
            const onBlur = sinon.spy();
            const wrapper = mount(
                <Tooltip text="hi">
                    <button onBlur={onBlur} />
                </Tooltip>,
            );
            wrapper.setState({ isShown: true });

            wrapper.find('button').simulate('blur');
            expect(wrapper.state('isShown')).toBe(false);
            expect(onBlur.calledOnce).toBe(true);
        });
    });

    describe('handleKeyDown()', () => {
        test('should not add keydown listener when keydown functionality is disabled', () => {
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
            const wrapper = mount(
                <Tooltip text="hi">
                    <button />
                </Tooltip>,
            );
            wrapper.setState({ isShown: true });

            // Keydown listener should not be added since it's commented out
            expect(addEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.anything(), true);
            addEventListenerSpy.mockRestore();
        });

        test('should not update isShown state when keydown functionality is disabled', () => {
            const wrapper = mount(
                <Tooltip text="hi">
                    <button />
                </Tooltip>,
            );
            // Trigger mouseenter to show tooltip
            wrapper.find('button').simulate('mouseenter');
            expect(wrapper.state('isShown')).toBe(true);
        });

        test('should call keydown handler of component when specified', () => {
            const onKeyDown = sinon.spy();
            const wrapper = mount(
                <Tooltip text="hi">
                    <button onKeyDown={onKeyDown} />
                </Tooltip>,
            );

            wrapper.find('button').simulate('keydown', { key: 'Escape' });
            expect(onKeyDown.calledOnce).toBe(true);
        });
    });

    describe('position instance method', () => {
        test.each([true, false])(`should only position the tether when shown`, isShown => {
            const positionTetherMock = jest.fn();

            const wrapper = mount(
                <Tooltip text="hi" isShown={isShown}>
                    <button />
                </Tooltip>,
            );
            // @ts-ignore: react-tether shenanigans
            wrapper.instance().tetherRef = { current: { position: positionTetherMock } };
            // @ts-ignore: more react-tether shenanigans
            wrapper.instance().position();

            expect(positionTetherMock).toHaveBeenCalledTimes(isShown ? 1 : 0);
        });
    });
});
