import * as React from 'react';
import { shallow } from 'enzyme';
import range from 'lodash/range';
import sinon from 'sinon';

import SlidePanels from '../SlidePanels';
import Slide from '../Slide';

type SlidePanelsInstance = InstanceType<typeof SlidePanels>;

const sandbox = sinon.sandbox.create();

const getSlides = (numSlides: number) => range(numSlides).map(i => shallow(<Slide>`Slide ${i}`</Slide>));

describe('components/slide-carousel/SlidePanels', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const defaultProps = {
        getPanelIdFromValue: (value: number) => `panel-${value}`,
        onSelection: (index: number) => `blah${index}`,
        selectedIndex: 0,
    };

    const getNode = (props: Record<string, unknown> = {}) => <SlidePanels {...defaultProps} {...props} />;

    const getWrapper = (props: Record<string, unknown> = {}) => shallow(getNode(props));

    describe('handleKeyDown', () => {
        [
            // randow key shouldn't trigger a selection
            {
                currIndex: 0,
                numSlides: 5,
                key: 'A',
                expectedSelection: null,
            },
            // left arrow on first element should select last element
            {
                currIndex: 0,
                numSlides: 5,
                key: 'ArrowLeft',
                expectedSelection: 4,
            },
            // left arrow should select left element
            {
                currIndex: 3,
                numSlides: 5,
                key: 'ArrowLeft',
                expectedSelection: 2,
            },
            // right arrow should select right element
            {
                currIndex: 2,
                numSlides: 5,
                key: 'ArrowRight',
                expectedSelection: 3,
            },
            // right arrow on last eklement should select first element
            {
                currIndex: 4,
                numSlides: 5,
                key: 'ArrowRight',
                expectedSelection: 0,
            },
        ].forEach(({ currIndex, numSlides, key, expectedSelection }) => {
            test('should handle keypresses correctly', () => {
                const wrapper = getWrapper({
                    selectedIndex: currIndex,
                    children: getSlides(numSlides),
                });
                const instance = wrapper.instance() as SlidePanelsInstance;

                const handleSelectionSpy = sandbox.spy();
                instance.handleSelection = handleSelectionSpy;
                const shouldStopEvent = ['ArrowLeft', 'ArrowRight'].includes(key);
                const onKeyEvent = {
                    key,
                    preventDefault: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                    stopPropagation: shouldStopEvent ? sandbox.mock() : sandbox.mock().never(),
                };

                instance.handleKeyDown(onKeyEvent as unknown as React.KeyboardEvent<HTMLDivElement>);

                if (expectedSelection === null) {
                    sinon.assert.notCalled(handleSelectionSpy);
                } else {
                    sinon.assert.calledWithExactly(handleSelectionSpy, expectedSelection);
                }
            });
        });
    });

    test('handleSelection should focus the container and call the onSelection prop with the right index', () => {
        const focusOnContainerElementSpy = sandbox.spy();
        const onSelectionSpy = sandbox.spy();

        const wrapperInstance = getWrapper({
            onSelection: onSelectionSpy,
        }).instance() as SlidePanelsInstance;
        wrapperInstance.focusOnContainerElement = focusOnContainerElementSpy;

        const index = 2;
        wrapperInstance.handleSelection(index);

        sinon.assert.calledWithExactly(onSelectionSpy, index);
        sinon.assert.calledOnce(focusOnContainerElementSpy);
    });

    test('should render a div for every child', () => {
        const wrapper = getWrapper({ children: getSlides(5) });
        expect(wrapper.find('div.slide-panel')).toHaveLength(5);
    });

    test('should only show the selected slide', () => {
        const wrapper = getWrapper({
            children: getSlides(5),
            selectedIndex: 3,
        });
        const hiddenStates = wrapper.children().map(element => element.prop('aria-hidden'));
        expect(hiddenStates.every((isHidden, index) => (index === 3 ? !isHidden : isHidden))).toBe(true);
    });

    test('should use the getPanelIdFromValue prop to generate ids for slides', () => {
        const getPanelIdFromValue = (index: number) => `unique${index}`;
        const wrapper = getWrapper({
            children: getSlides(5),
            getPanelIdFromValue,
        });
        const panelIds = wrapper.children().map(element => element.prop('id'));
        expect(panelIds.every((id, index) => id === getPanelIdFromValue(index))).toBe(true);
    });
});
