import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { Tab, TabView } from '..';

const sandbox = sinon.sandbox.create();

describe('components/tab-view/TabView', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render tabview with tabs', () => {
        const component = shallow(
            <TabView>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        expect(component.find('TabViewPrimitive').length).toEqual(1);
        expect(component.props().selectedIndex).toEqual(0);
        expect(component.props().onTabSelect).toEqual(component.instance().handleOnTabSelect);
        expect(typeof component.props().resetActiveTab).toBe('function');
    });

    test('should set state when handleOnTabSelect() is called', () => {
        const component = shallow(
            <TabView>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        component.instance().handleOnTabSelect(100);

        expect(component.state('selectedIndex')).toEqual(100);
    });

    test('should call onTabSelect when handleOnTabSelect() is called', () => {
        const cb = jest.fn();
        const component = shallow(
            <TabView onTabSelect={cb}>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        const selectedTabId = 100;

        component.instance().handleOnTabSelect(selectedTabId);
        expect(cb).toHaveBeenCalledWith(selectedTabId);
    });

    test('should set state when handleOnTabFocus() is called', () => {
        const component = shallow(
            <TabView>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        component.instance().handleOnTabFocus(100);

        expect(component.state('focusedIndex')).toEqual(100);
    });

    test('should use defaultSelectedIndex when defined', () => {
        const component = shallow(
            <TabView defaultSelectedIndex={1}>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        expect(component.find('TabViewPrimitive').length).toEqual(1);
        expect(component.props().selectedIndex).toEqual(1);
        expect(component.props().focusedIndex).toEqual(1);
    });

    test('should reset focused tab to selected tab when resetFocusedTab is called', () => {
        const component = shallow(
            <TabView defaultSelectedIndex={0}>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        const selectedIndex = 1;
        component.setState({ selectedIndex, focusedIndex: 2 });
        expect(component.props().selectedIndex).toEqual(selectedIndex);
        component.instance().resetFocusedTab();
        component.update();
        expect(component.props().focusedIndex).toEqual(selectedIndex);
    });

    test('should reset selected Tab to default when resetActiveTab is called', () => {
        const component = shallow(
            <TabView defaultSelectedIndex={0}>
                <Tab title="tab1">Tab 1</Tab>
                <Tab title="tab2">Tab 2</Tab>
            </TabView>,
        );

        component.setState({ selectedIndex: 1 });
        expect(component.props().selectedIndex).toEqual(1);
        component.instance().resetActiveTab();
        component.update();
        expect(component.props().selectedIndex).toEqual(0);
    });

    test('should render Tabs with resin data on the buttons', () => {
        const component = mount(
            <TabView defaultSelectedIndex={0}>
                <Tab data-resin-tag="test1" title="tab1">
                    Tab 1
                </Tab>
                <Tab data-resin-tag="test2" title="tab2">
                    Tab 2
                </Tab>
            </TabView>,
        );
        expect(
            component
                .find('button')
                .at(0)
                .prop('data-resin-tag'),
        ).toEqual('test1');
        expect(
            component
                .find('button')
                .at(1)
                .prop('data-resin-tag'),
        ).toEqual('test2');
    });

    describe('life cycle methods', () => {
        let component;
        beforeEach(() => {
            component = mount(
                <TabView defaultSelectedIndex={0}>
                    <Tab title="tab1">Tab 1</Tab>
                    <Tab title="tab2">Tab 2</Tab>
                </TabView>,
            );
        });

        describe('componentDidUpdate', () => {
            test('should not call resetActiveTab if defaultSelectedIndex was not changed', () => {
                const instance = component.instance();
                const resetActiveTabSpy = jest.spyOn(instance, 'resetActiveTab');
                instance.componentDidUpdate({
                    defaultSelectedIndex: 0,
                });
                expect(resetActiveTabSpy).not.toHaveBeenCalled();
            });

            test('should call resetActiveTab if defaultSelectedIndex was changed', () => {
                const instance = component.instance();
                const resetActiveTabSpy = jest.spyOn(instance, 'resetActiveTab');
                instance.componentDidUpdate({
                    defaultSelectedIndex: 1,
                });
                expect(resetActiveTabSpy).toHaveBeenCalled();
            });
        });
    });

    describe('handleKeyUp', () => {
        let component;

        beforeEach(() => {
            component = mount(
                <TabView defaultSelectedIndex={0}>
                    <Tab data-resin-tag="test1" title="tab1">
                        Tab 1
                    </Tab>
                    <Tab data-resin-tag="test2" title="tab2">
                        Tab 2
                    </Tab>
                </TabView>,
            );
        });

        test('should set show outline state to true when tabpanel obtained focused with the Tab key', () => {
            component.instance().setState = sandbox.mock();
            component.instance().getActiveDocElement = sandbox.mock().returns({
                getAttribute: sandbox.mock().returns('tabpanel'),
            });

            component.instance().handleKeyUp({
                key: 'Tab',
            });

            expect(component.instance().setState.calledWith({ showOutline: true })).toBeTruthy();
        });

        test('should set show outline state to false when tabpanel does not have focus and outlet was set to true', () => {
            component.setState({ showOutline: true });
            expect(component.state('showOutline')).toBeTruthy();

            component.instance().setState = sandbox.mock();
            component.instance().getActiveDocElement = sandbox.mock().returns({
                getAttribute: sandbox.mock().returns('not-tabpanel'),
            });

            component.instance().handleKeyUp({
                key: 'randomkey',
            });

            expect(component.instance().setState.calledWith({ showOutline: false })).toBeTruthy();
        });
    });
});
