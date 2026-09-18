import * as React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SlideButton from '../SlideButton';
import SlideNavigator from '../SlideNavigator';

type SlideNavigatorInstance = InstanceType<typeof SlideNavigator>;

const sandbox = sinon.sandbox.create();

describe('components/slide-carousel/SlideNavigator', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const defaultProps = {
        getButtonIdFromValue: (value: number) => `button-${value}`,
        getPanelIdFromValue: (value: number) => `panel-${value}`,
        onSelection: (index: number) => `blah${index}`,
        numOptions: 5,
        selectedIndex: 0,
    };

    const getWrapper = (props: Record<string, unknown> = {}) =>
        shallow(<SlideNavigator {...defaultProps} {...props} />);

    describe('handleKeyDown', () => {
        [
            // randow key shouldn't trigger a selection
            {
                currIndex: 0,
                numOptions: 5,
                key: 'A',
                expectedSelection: null,
            },
            // left arrow on first element should select last element
            {
                currIndex: 0,
                numOptions: 5,
                key: 'ArrowLeft',
                expectedSelection: 4,
            },
            // left arrow should select left element
            {
                currIndex: 3,
                numOptions: 5,
                key: 'ArrowLeft',
                expectedSelection: 2,
            },
            // right arrow should select right element
            {
                currIndex: 2,
                numOptions: 5,
                key: 'ArrowRight',
                expectedSelection: 3,
            },
            // right arrow on last element should select first element
            {
                currIndex: 4,
                numOptions: 5,
                key: 'ArrowRight',
                expectedSelection: 0,
            },
        ].forEach(({ currIndex, numOptions, key, expectedSelection }) => {
            test('should handle keypresses correctly', () => {
                const wrapper = getWrapper({
                    selectedIndex: currIndex,
                    numOptions,
                });
                const instance = wrapper.instance() as SlideNavigatorInstance;

                const handleSelectionSpy = sandbox.spy();
                instance.handleSelection = handleSelectionSpy;
                const shouldStopEvent = ['ArrowLeft', 'ArrowRight'].includes(key);
                const onKeyEvent = {
                    key,
                    preventDefault: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                    stopPropagation: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                };

                instance.handleKeyDown(onKeyEvent as unknown as React.KeyboardEvent<HTMLElement>);

                if (expectedSelection === null) {
                    sinon.assert.notCalled(handleSelectionSpy);
                } else {
                    sinon.assert.calledWithExactly(handleSelectionSpy, expectedSelection);
                }
            });
        });
    });

    describe('handleSelection', () => {
        test('should call the right methods', () => {
            const onSelectionSpy = sandbox.spy();
            const focusOnButtonElementSpy = sandbox.spy();

            const wrapperInstance = getWrapper({
                onSelection: onSelectionSpy,
            }).instance() as SlideNavigatorInstance;
            wrapperInstance.focusOnButtonElement = focusOnButtonElementSpy;

            const index = 2;
            wrapperInstance.handleSelection(index);

            sinon.assert.calledWithExactly(onSelectionSpy, index);
            sinon.assert.calledWithExactly(focusOnButtonElementSpy, index);
        });
    });

    test('should create as many buttons as the given number of options', () => {
        const wrapper = getWrapper({ numOptions: 7 });
        expect(wrapper.children().filter(SlideButton)).toHaveLength(7);
    });

    test('should call handleKeyDown on key press', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance() as SlideNavigatorInstance;
        const handleKeyDownSpy = sandbox.spy(instance, 'handleKeyDown');
        wrapper.setProps({});

        wrapper.simulate('keyDown', { key: 'A' });

        sinon.assert.calledOnce(handleKeyDownSpy);
    });

    test('should use the getButtonIdFromValue prop to generate ids for slide buttons', () => {
        const getButtonIdFromValue = (index: number) => `unique${index}`;
        const wrapper = getWrapper({
            numOptions: 6,
            getButtonIdFromValue,
        });
        const buttonIds = wrapper.find(SlideButton).map(element => element.prop('id'));
        expect(buttonIds.every((id, index) => id === getButtonIdFromValue(index))).toBe(true);
    });

    test('should use the getPanelIdFromValue prop to set ids on aria-controls', () => {
        const getPanelIdFromValue = (index: number) => `unique${index}`;
        const wrapper = getWrapper({
            numOptions: 6,
            getPanelIdFromValue,
        });
        const controlledPanelIds = wrapper.find(SlideButton).map(element => element.prop('aria-controls'));
        expect(controlledPanelIds.every((id, index) => id === getPanelIdFromValue(index))).toBe(true);
    });

    test('should only mark the button associated to the current selection as selected', () => {
        const testIndex = 4;
        const wrapper = getWrapper({ numOptions: 6, selectedIndex: testIndex });
        const selectedStates = wrapper.find(SlideButton).map(element => element.prop('isSelected'));
        expect(selectedStates.every((isSelected, index) => isSelected === (index === testIndex))).toBe(true);
    });

    test('should remove all but the button associated to the selected slide from tabbing order', () => {
        const testIndex = 2;
        const wrapper = getWrapper({ numOptions: 6, selectedIndex: testIndex });
        const tabIndexes = wrapper.find(SlideButton).map(element => element.prop('tabIndex') as unknown as string);
        expect(tabIndexes.every((tabIndex, index) => tabIndex === (index === testIndex ? '0' : '-1'))).toBe(true);
    });
});
