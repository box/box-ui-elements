import React from 'react';
import sinon from 'sinon';

import SlideButton from '../SlideButton';
import SlideNavigator from '../SlideNavigator';

const sandbox = sinon.sandbox.create();

describe('components/slide-carousel/SlideNavigator', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const defaultProps = {
        getButtonIdFromValue: val => `button-${val}`,
        getPanelIdFromValue: val => `panel-${val}`,
        onSelection: i => `blah${i}`,
        numOptions: 5,
        selectedIndex: 0,
    };

    const getWrapper = props => shallow(<SlideNavigator {...defaultProps} {...props} />);

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
                const instance = wrapper.instance();

                instance.handleSelection = sandbox.spy();
                const shouldStopEvent = ['ArrowLeft', 'ArrowRight'].includes(key);
                const onKeyEvent = {
                    key,
                    preventDefault: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                    stopPropagation: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                };

                instance.handleKeyDown(onKeyEvent);

                if (expectedSelection === null) {
                    sinon.assert.notCalled(instance.handleSelection);
                } else {
                    sinon.assert.calledWithExactly(instance.handleSelection, expectedSelection);
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
            }).instance();
            wrapperInstance.focusOnButtonElement = focusOnButtonElementSpy;

            const index = 2;
            wrapperInstance.handleSelection(index);

            sinon.assert.calledWithExactly(onSelectionSpy, index);
            sinon.assert.calledWithExactly(focusOnButtonElementSpy, index);
        });
    });

    test('should create as many buttons as the given number of options', () => {
        const wrapper = getWrapper({ numOptions: 7 });
        expect(wrapper.children().filter(SlideButton).length).toBe(7);
    });

    test('should call handleKeyDown on key press', () => {
        const wrapper = getWrapper();
        sandbox.spy(wrapper.instance(), 'handleKeyDown');
        wrapper.setProps({});

        wrapper.simulate('keyDown', { key: 'A' });

        sinon.assert.calledOnce(wrapper.instance().handleKeyDown);
    });

    test('should use the getButtonIdFromValue prop to generate ids for slide buttons', () => {
        const getButtonIdFromValue = i => `unique${i}`;
        const wrapper = getWrapper({
            numOptions: 6,
            getButtonIdFromValue,
        });
        expect(wrapper.find(SlideButton).everyWhere((el, i) => el.prop('id') === getButtonIdFromValue(i))).toBe(true);
    });

    test('should use the getPanelIdFromValue prop to set ids on aria-controls', () => {
        const getPanelIdFromValue = i => `unique${i}`;
        const wrapper = getWrapper({
            numOptions: 6,
            getPanelIdFromValue,
        });
        expect(
            wrapper.find(SlideButton).everyWhere((el, i) => el.prop('aria-controls') === getPanelIdFromValue(i)),
        ).toBe(true);
    });

    test('should only mark the button associated to the current selection as selected', () => {
        const testIndex = 4;
        const wrapper = getWrapper({ numOptions: 6, selectedIndex: testIndex });
        expect(wrapper.find(SlideButton).everyWhere((el, i) => el.prop('isSelected') === (i === testIndex))).toBe(true);
    });

    test('should remove all but the button associated to the selected slide from tabbing order', () => {
        const testIndex = 2;
        const wrapper = getWrapper({ numOptions: 6, selectedIndex: testIndex });
        expect(
            wrapper
                .find(SlideButton)
                .everyWhere((el, i) => (i === testIndex ? el.prop('tabIndex') === '0' : el.prop('tabIndex') === '-1')),
        ).toBe(true);
    });
});
