import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { Tab, TabViewPrimitive } from '..';

const sandbox = sinon.sandbox.create();

describe('components/tab-view/TabViewPrimitive', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const simulateKeyDown = (comp, key, shouldStopEvent = false, isShiftKey = false) => {
        // conveniently ensuring that the keydown event is attached to the tablist element,
        // not the entire container
        comp.find('[role="tablist"]')
            .at(0)
            .simulate('keyDown', {
                key,
                shiftKey: isShiftKey,
                preventDefault: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                stopPropagation: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
            });
    };

    test('should render tabview ui with tabs', () => {
        const onTabFocus = () => {};
        const onTabSelect = () => {};
        const component = shallow(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={0}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );

        expect(component.hasClass('tab-view')).toBe(true);
        expect(component.instance().handleKeyDown).toEqual(component.instance().handleKeyDown);
        expect(component.find('.tabs').find('button').length).toEqual(2);
        expect(component.find({ tabIndex: 0 }).toBeFalsy);
    });

    test('should render tabview ui with link tabs', () => {
        const onTabFocus = () => {};
        const onTabSelect = () => {};
        const component = shallow(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={0}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab href="https://www.box.com/" title="tab2" />
            </TabViewPrimitive>,
        );

        expect(component.find('.tabs').find('button').length).toEqual(1);
        expect(component.find('.tabs').find('LinkButton').length).toEqual(1);
    });

    test('should select appropriate tab when passed selectedIndex', () => {
        const onTabFocus = () => {};
        const onTabSelect = () => {};
        const component = shallow(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={1}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );

        const tabs = component.find('.tabs').find('button');
        expect(tabs.at(0).hasClass('is-selected')).toBe(false);
        expect(tabs.at(1).hasClass('is-selected')).toBe(true);
    });

    test('should call onTabSelect when tab selected', () => {
        const onTabFocus = sinon.spy();
        const onTabSelect = sinon.spy();
        const event = { type: 'click' };
        const component = shallow(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={1}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );
        const tabTwoButton = component
            .find('.tabs')
            .find('button')
            .at(1)
            .find('button');
        tabTwoButton.simulate('click', event);
        expect(onTabSelect.calledWith(1)).toBe(true);
        expect(onTabFocus.calledWith(1)).toBe(true);
    });

    test('should select the right tab on ArrowRight', () => {
        const onTabFocus = sinon.mock().withArgs(1);
        const onTabSelect = sinon.mock().never();
        const component = mount(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={0}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );

        simulateKeyDown(component, 'ArrowRight', true);
    });

    test('should focus first tab on ArrowRight from the last tab', () => {
        const onTabFocus = sinon.mock().withArgs(1);
        const onTabSelect = sinon.mock().never();
        const component = mount(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={1}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );

        simulateKeyDown(component, 'ArrowRight', true);
    });

    test('should focus the left tab on ArrowLeft', () => {
        const onTabFocus = sinon.mock().withArgs(0);
        const onTabSelect = sinon.mock().never();
        const component = mount(
            <TabViewPrimitive
                focusedIndex={1}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={1}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );

        simulateKeyDown(component, 'ArrowLeft', true);
    });

    test('should focus last tab on ArrowLeft from the first tab', () => {
        const onTabFocus = sinon.mock().withArgs(2);
        const onTabSelect = sinon.mock().never();
        const component = mount(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={() => {}}
                resetFocusedTab={() => {}}
                selectedIndex={0}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
                <Tab title="tab2">Tab 3</Tab>
            </TabViewPrimitive>,
        );

        simulateKeyDown(component, 'ArrowLeft', true);
    });

    test('should reset selected tab on Escape', () => {
        const onTabFocus = sinon.mock().never();
        const onTabSelect = sinon.mock().never();
        const resetActiveTab = sinon.mock();
        const component = mount(
            <TabViewPrimitive
                focusedIndex={0}
                onTabFocus={onTabFocus}
                onTabSelect={onTabSelect}
                resetActiveTab={resetActiveTab}
                resetFocusedTab={() => {}}
                selectedIndex={0}
            >
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabViewPrimitive>,
        );

        simulateKeyDown(component, 'Escape', false);
    });

    describe('render()', () => {
        [
            {
                tabsContainerOffsetLeft: 1,
                isDynamic: true,
                style: { left: '1px' },
            },
            {
                tabsContainerOffsetLeft: 1,
                isDynamic: false,
                style: {},
            },
        ].forEach(({ tabsContainerOffsetLeft, isDynamic, style }) => {
            test('should render tabs with correct style', () => {
                const component = shallow(
                    <TabViewPrimitive
                        focusedIndex={0}
                        isDynamic={isDynamic}
                        onTabFocus={sandbox.stub()}
                        onTabSelect={sandbox.stub()}
                        resetActiveTab={sandbox.stub()}
                        resetFocusedTab={sandbox.stub()}
                        selectedIndex={0}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                    </TabViewPrimitive>,
                );
                component.setState({ tabsContainerOffsetLeft });
                const tab = component.find('nav');

                expect(tab.prop('style')).toEqual(style);
            });
        });
    });

    describe('Dynamic Tabs', () => {
        describe('scrollToTab', () => {
            let component;
            beforeEach(() => {
                const onTabFocus = sinon.mock();
                const onTabSelect = sinon.mock();
                component = mount(
                    <TabViewPrimitive
                        focusedIndex={0}
                        isDynamic
                        onTabFocus={onTabFocus}
                        onTabSelect={onTabSelect}
                        resetActiveTab={() => {}}
                        resetFocusedTab={() => {}}
                        selectedIndex={0}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                    </TabViewPrimitive>,
                );
            });

            test('should not throw an error if scroll to index is out of bound', () => {
                component.instance().scrollToTab(-1);
                component.instance().scrollToTab(3); // 3 is more than the number of tabs
            });

            test('should not do anything if component is not dynamic', () => {
                component = mount(
                    <TabViewPrimitive
                        focusedIndex={0}
                        isDynamic
                        onTabFocus={() => {}}
                        onTabSelect={() => {}}
                        resetActiveTab={() => {}}
                        resetFocusedTab={() => {}}
                        selectedIndex={0}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                    </TabViewPrimitive>,
                );

                const instance = component.instance();
                instance.setState = sinon.mock();

                component.instance().scrollToTab(0);
                expect(instance.setState.never()).toBeTruthy();
            });

            test("should set tabsContainerOffsetLeft to 0 if last element's anchor point does not go beyond the view port width", () => {
                const tabsElements = [
                    {
                        offsetLeft: 0,
                        offsetWidth: 1,
                    },
                    {
                        offsetLeft: 1,
                        offsetWidth: 1,
                    },
                ];

                const instance = component.instance();
                instance.tabsElements = tabsElements;
                instance.tabsContainer = {
                    offsetWidth: 100,
                };

                instance.setState = sinon.mock();
                component.instance().scrollToTab(1);
                expect(
                    instance.setState.calledWith({
                        tabsContainerOffsetLeft: 0,
                    }),
                ).toBeTruthy();
            });

            test("should set tabsContainerOffsetLeft to -100 if last element's anchor point goes beyond the view port width", () => {
                const tabsElements = [
                    {
                        offsetLeft: 100,
                        offsetWidth: 100,
                    },
                ];

                const instance = component.instance();
                instance.tabsElements = tabsElements;
                instance.tabsContainer = {
                    offsetWidth: 100,
                };

                instance.setState = sinon.mock();
                component.instance().scrollToTab(0);
                expect(
                    instance.setState.calledWith({
                        tabsContainerOffsetLeft: -100,
                    }),
                ).toBeTruthy();
            });
        });

        describe('life cycle methods', () => {
            let component;
            beforeEach(() => {
                const onTabFocus = sinon.mock();
                const onTabSelect = sinon.mock();
                component = mount(
                    <TabViewPrimitive
                        focusedIndex={1}
                        isDynamic
                        onTabFocus={onTabFocus}
                        onTabSelect={onTabSelect}
                        resetActiveTab={() => {}}
                        resetFocusedTab={() => {}}
                        selectedIndex={0}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                    </TabViewPrimitive>,
                );
            });

            describe('componentDidMount', () => {
                test('should call scrollToTab when mounted to make sure the scroll position is correct and the button visiblity is adjusted', () => {
                    const instance = component.instance();
                    instance.scrollToTab = sinon.mock();
                    instance.componentDidMount();
                    expect(instance.scrollToTab.calledWith(1)).toBeTruthy();
                });

                test('should not call scrollToTab when mounted to make sure the scroll position is correct and the button visiblity is adjusted', () => {
                    const instance = component.instance();
                    component.setProps({ isDynamic: false });
                    instance.scrollToTab = sinon.mock();
                    instance.componentDidMount();
                    expect(instance.scrollToTab.never).toBeTruthy();
                });
            });

            describe('componentDidUpdate', () => {
                test('should not call focusOnTabElment if component is not dynamic', () => {
                    const instance = component.instance();
                    instance.focusOnTabElement = sinon.mock();

                    component.setProps({
                        focusedIndex: 0,
                        isDynamic: false,
                    });

                    expect(instance.focusOnTabElement.never).toBeTruthy();
                });

                test('should call focusOnTabElment if it was changed', () => {
                    const instance = component.instance();
                    instance.focusOnTabElement = sinon.mock();
                    const prevFocusedIndex = 2;
                    const newFocusedIndex = component.props().focusedIndex;
                    instance.componentDidUpdate({
                        focusedIndex: prevFocusedIndex,
                        isDynamic: true,
                    });
                    expect(instance.focusOnTabElement.calledWith(newFocusedIndex)).toBeTruthy();
                });

                test('should do nothing if it is not dynamic', () => {
                    const instance = component.instance();
                    instance.scrollToTab = sinon.mock();
                    instance.componentDidUpdate({
                        focusedIndex: 0,
                        isDynamic: false,
                        selectedIndex: 0,
                    });
                    expect(instance.scrollToTab.never).toBeTruthy();
                });

                test('should call scrollToTab with focusedIndex if it was changed', () => {
                    const instance = component.instance();
                    instance.scrollToTab = sinon.mock();

                    component.setProps({
                        focusedIndex: 2,
                        isDynamic: true,
                        selectedIndex: component.props().selectedIndex,
                    });

                    expect(instance.scrollToTab.calledWith(2)).toBeTruthy();
                });

                test('should call scrollToTab with selectedIndex if it was changed', () => {
                    const instance = component.instance();
                    instance.scrollToTab = sinon.mock();
                    const selectedIndex = 2;

                    component.setProps({
                        focusedIndex: component.props().focusedIndex,
                        isDynamic: true,
                        selectedIndex,
                    });

                    expect(instance.scrollToTab.calledWith(selectedIndex)).toBeTruthy();
                });
            });
        });

        describe('arrows', () => {
            let component;
            let onTabFocus;

            beforeEach(() => {
                onTabFocus = sinon.mock();
                const onTabSelect = sinon.mock();
                component = mount(
                    <TabViewPrimitive
                        focusedIndex={0}
                        isDynamic
                        onTabFocus={onTabFocus}
                        onTabSelect={onTabSelect}
                        resetActiveTab={() => {}}
                        resetFocusedTab={() => {}}
                        selectedIndex={0}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                        <Tab title="tab3">Tab 2</Tab>
                    </TabViewPrimitive>,
                );
            });

            describe('right arrow', () => {
                test('should make hidden if there is no tabsContainer meaning it has not been rendered', () => {
                    const result = component.instance().isRightArrowVisible();
                    expect(result).toBeFalsy();
                });

                test('should make hidden if last element is inside the viewport', () => {
                    const instance = component.instance();
                    instance.setState({
                        tabsContainerOffsetLeft: 100,
                    });

                    const lastElementIsInsideOfTabsContainer = {
                        offsetLeft: 0,
                        offsetWidth: 50,
                    };
                    instance.tabsElements = [lastElementIsInsideOfTabsContainer];

                    instance.tabsContainer = {
                        offsetWidth: 200,
                    };

                    expect(instance.isRightArrowVisible()).toBeFalsy();
                });

                test('should make visible if the last element is outside the viewport', () => {
                    const instance = component.instance();
                    instance.setState({
                        tabsContainerOffsetLeft: 100,
                    });

                    const lastElementIsOutsideOfTabsContainer = {
                        offsetLeft: 100,
                        offsetWidth: 100,
                    };
                    instance.tabsElements = [lastElementIsOutsideOfTabsContainer];

                    instance.tabsContainer = {
                        offsetWidth: 100,
                    };

                    expect(instance.isRightArrowVisible()).toBeTruthy();
                });

                test('should call onTabFocus when clicked', () => {
                    component.find('button.right-arrow').simulate('click');
                    expect(onTabFocus.calledWith(1)).toBeTruthy();
                });
            });

            describe('left arrow', () => {
                test('should make hidden when tabsContainer offset left is 0', () => {
                    const instance = component.instance();
                    instance.tabsContainer = {};
                    component.setProps({ focusedIndex: 0 });
                    component.setProps({ selectedIndex: 0 });
                    component.setState({ tabsContainerOffsetLeft: 0 });

                    expect(instance.isLeftArrowVisible()).toBeFalsy();
                });

                test('should make hidden when tabsContainer offset left is 0 when focus index is not 0', () => {
                    const instance = component.instance();
                    instance.tabsContainer = {};
                    component.setProps({ focusedIndex: 1 });
                    component.setState({ tabsContainerOffsetLeft: 0 });

                    expect(instance.isLeftArrowVisible()).toBeFalsy();
                });
                test('should make hidden when tabsContainer offset left is 0 when select index is not 0', () => {
                    const instance = component.instance();
                    instance.tabsContainer = {};
                    component.setProps({ selectedIndex: 1 });
                    component.setState({ tabsContainerOffsetLeft: 0 });

                    expect(instance.isLeftArrowVisible()).toBeFalsy();
                });

                test('should make visible when tabsContainer offset left is not 0 and the focused is not 0', () => {
                    const instance = component.instance();
                    instance.tabsContainer = {};
                    component.setProps({ focusedIndex: 1 });
                    component.setState({ tabsContainerOffsetLeft: 1 });

                    expect(instance.isLeftArrowVisible()).toBeTruthy();
                });

                test('should make visible when tabsContainer offset left is not 0 and the selected index is not 0', () => {
                    const instance = component.instance();
                    instance.tabsContainer = {};
                    component.setProps({ selectedIndex: 1 });
                    component.setState({ tabsContainerOffsetLeft: 1 });

                    expect(instance.isLeftArrowVisible()).toBeTruthy();
                });

                test('should call onTabFocus when clicked', () => {
                    component.find('button.left-arrow').simulate('click');
                    expect(onTabFocus.calledWith(-1)).toBeTruthy();
                });
            });
        });

        describe('accessibility with Tab key', () => {
            test('should refocus on the selected tab', () => {
                const resetFocusedTab = sinon.mock();
                const component = mount(
                    <TabViewPrimitive
                        focusedIndex={0}
                        isDynamic
                        onTabFocus={() => {}}
                        onTabSelect={() => {}}
                        resetActiveTab={() => {}}
                        resetFocusedTab={resetFocusedTab}
                        selectedIndex={1}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                    </TabViewPrimitive>,
                );

                simulateKeyDown(component, 'Tab', false);
                expect(resetFocusedTab.calledOnce).toBeTruthy();
            });
        });

        describe('focusOnTabElement', () => {
            let onTabFocus;
            let onTabSelect;
            let component;

            beforeEach(() => {
                onTabFocus = sinon.mock().withArgs(1);
                onTabSelect = sinon.mock().never();
                component = mount(
                    <TabViewPrimitive
                        focusedIndex={0}
                        isDynamic
                        onTabFocus={onTabFocus}
                        onTabSelect={onTabSelect}
                        resetActiveTab={() => {}}
                        resetFocusedTab={() => {}}
                        selectedIndex={0}
                    >
                        <Tab title="tab1">Tab 1</Tab>
                        <Tab title="tab2">Tab 2</Tab>
                    </TabViewPrimitive>,
                );
            });

            test('should not throw when index is less than 0', () => {
                component.instance().focusOnTabElement(-1);
            });

            test('should not throw when index is larger than then number of tabs', () => {
                component.instance().focusOnTabElement(3);
            });
        });
    });
});
