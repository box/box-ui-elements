import * as React from 'react';
import { Set } from 'immutable';
import sinon from 'sinon';

import isEqual from 'lodash/isEqual';

import makeSelectable from '../makeSelectable';
import shiftSelect from '../shiftSelect';

const sandbox = sinon.sandbox.create();

jest.mock('../shiftSelect');
jest.useFakeTimers();

describe('components/table/makeSelectable', () => {
    const Table = (props = {}) => <table {...props} />;

    const SelectableTable = makeSelectable(Table);

    const data = ['a', 'b', 'c', 'd', 'e'];

    const getWrapper = (props = {}) =>
        shallow(<SelectableTable onSelect={sandbox.stub()} data={data} selectedItems={[]} enableHotkeys {...props} />);

    const testClassNamePreventsArrowNavigation = (className, hotKey, isGridView = false) => {
        const wrapper = getWrapper({
            gridColumnCount: 3,
            isGridView,
            selectedItems: ['a'],
        });

        jest.spyOn(document, 'querySelector').mockImplementation(selector => className === selector);

        wrapper.setState({ focusedIndex: undefined });
        const instance = wrapper.instance();
        const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
        shortcut.handler({ preventDefault: sandbox.stub() });
        expect(wrapper.state('focusedIndex')).toEqual(undefined);
    };

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        sandbox.verifyAndRestore();
    });

    describe('componentDidMount()', () => {
        test('should add keypress listener', () => {
            document.addEventListener = jest.fn();

            const instance = getWrapper().instance();

            expect(document.addEventListener).toBeCalledWith('keypress', instance.handleKeyboardSearch);
        });
    });

    describe('componentDidUpdate()', () => {
        test('should call onFocus handler when focused index changes', () => {
            const onFocus = jest.fn();
            const wrapper = getWrapper({
                onFocus,
            });

            wrapper.setState({ focusedIndex: 3 });

            expect(onFocus).toBeCalledWith(3);
        });
    });

    describe('componentWillUnmount()', () => {
        test('should remove keypress listener', () => {
            document.removeEventListener = jest.fn();

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.unmount();

            expect(document.removeEventListener).toBeCalledWith('keypress', instance.handleKeyboardSearch);
        });
    });

    describe('onSelect()', () => {
        test('should set previousIndex to state.focusedIndex, set state.focusedIndex, and call onSelect', () => {
            const wrapper = getWrapper({
                onSelect: sandbox.mock().withArgs(['c']),
            });
            wrapper.setState({ focusedIndex: 1 });
            const instance = wrapper.instance();

            instance.onSelect(new Set(['c']), 2);

            expect(instance.previousIndex).toEqual(1);
            expect(wrapper.state('focusedIndex')).toEqual(2);
        });

        test('should call onSelect with Immutable Set when selectedItems is given as a set', () => {
            const wrapper = getWrapper({
                selectedItems: new Set(['a']),
                onSelect: items => {
                    expect(items.equals(new Set(['c']))).toBe(true);
                },
            });
            wrapper.setState({ focusedIndex: 1 });
            const instance = wrapper.instance();

            instance.onSelect(new Set(['c']), 2);
        });
    });

    describe('getProcessedProps()', () => {
        test('should return selectedItems as Immutable object when given as plain JS', () => {
            const wrapper = getWrapper({
                selectedItems: ['a'],
            });
            const instance = wrapper.instance();

            const processedProps = instance.getProcessedProps();
            expect(processedProps.selectedItems.equals(new Set(['a']))).toBe(true);
        });
    });

    describe('selectToggle()', () => {
        test('should remove item from selection when it is selected', () => {
            const wrapper = getWrapper({
                selectedItems: ['a', 'b'],
            });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['a']))).toBe(true);
                expect(focusedIndex).toEqual(1);
            };

            instance.selectToggle(1);
        });

        test('should add item to selection when it is not selected', () => {
            const wrapper = getWrapper({
                selectedItems: [],
            });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['b']))).toBe(true);
                expect(focusedIndex).toEqual(1);
            };

            instance.selectToggle(1);
        });
    });

    describe('selectRange()', () => {
        afterEach(() => {
            shiftSelect.mockReset();
        });

        test('should call shiftSelect with correct args', () => {
            const selectedItems = ['a', 'b', 'c'];
            const focusedIndex = 1;
            const rowIndex = 2;
            const anchorIndex = 3;

            // expected computed value
            const selectedRows = new Set([0, 1, 2]);

            shiftSelect.mockImplementation(() => new Set([1, 2, 3]));

            const wrapper = getWrapper({
                selectedItems,
            });
            const instance = wrapper.instance();
            instance.previousIndex = focusedIndex;
            instance.anchorIndex = anchorIndex;

            instance.onSelect = newSelectedItems => {
                // newSelectedItems should be the item-mapped equivalent of
                // [1, 2, 3] returned from the call to shiftSelect
                expect(newSelectedItems.equals(new Set(['b', 'c', 'd']))).toBe(true);
            };

            instance.selectRange(rowIndex);
            expect(shiftSelect).toHaveBeenCalledWith(selectedRows, focusedIndex, rowIndex, anchorIndex);
        });

        test('should not change selection if clicking on same row', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.previousIndex = 1;

            instance.selectRange(1);
            expect(shiftSelect).not.toHaveBeenCalled();
        });
    });

    describe('selectOne()', () => {
        test('should not change selection when clicking on the only already-selected row', () => {
            const wrapper = getWrapper({
                selectedItems: ['a'],
            });
            const instance = wrapper.instance();
            instance.onSelect = sandbox.mock().never();

            instance.selectOne(0);
        });

        test('should set selection to contain only the target item', () => {
            const wrapper = getWrapper({
                selectedItems: ['a', 'b'],
            });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['c']))).toBe(true);
                expect(focusedIndex).toEqual(2);
            };

            instance.selectOne(2);
        });
    });

    describe('handleRowClick()', () => {
        test('should call selectToggle() when meta key pressed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const index = 1;

            instance.selectToggle = sandbox.mock().withArgs(index);

            instance.handleRowClick({ metaKey: true }, index);
        });

        test('should call selectToggle() when ctrl key pressed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const index = 1;

            instance.selectToggle = sandbox.mock().withArgs(index);

            instance.handleRowClick({ ctrlKey: true }, index);
        });

        test('should call selectRange() when shift key pressed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const index = 1;

            instance.selectRange = sandbox.mock().withArgs(index);

            instance.handleRowClick({ shiftKey: true }, index);
        });

        test('should call selectOne() when no modifier key pressed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const index = 1;

            instance.selectOne = sandbox.mock().withArgs(index);

            instance.handleRowClick({}, index);
        });
    });

    describe('handleCheckboxClick()', () => {
        test('should call selectRange() when shift key pressed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const index = 1;

            instance.selectRange = sandbox.mock().withArgs(index);

            instance.handleCheckboxClick({ nativeEvent: { shiftKey: true } }, index);
        });

        test('should call selectToggle() when no modifier key pressed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const index = 1;

            instance.selectToggle = sandbox.mock().withArgs(index);

            instance.handleCheckboxClick({ nativeEvent: {} }, index);
        });
    });

    describe('handleRowFocus()', () => {
        test('should call onSelect() with correct args', () => {
            const wrapper = getWrapper({
                selectedItems: ['a'],
            });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['a']))).toBe(true);
                expect(focusedIndex).toEqual(2);
            };

            instance.handleRowFocus({}, 2);
        });
    });

    describe('handleShiftKeyDown()', () => {
        test('should be no-op when target is the boundary and already selected', () => {
            const wrapper = getWrapper({
                selectedItems: ['a'],
                onSelect: sandbox.mock().never(),
            });
            wrapper.setState({ focusedIndex: 0 });

            wrapper.instance().handleShiftKeyDown(0, 0);
        });

        test('should select target when it is not already selected and source is selected', () => {
            const wrapper = getWrapper({
                selectedItems: ['b'],
            });
            wrapper.setState({ focusedIndex: 1 });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['a', 'b']))).toBe(true);
                expect(focusedIndex).toEqual(0);
            };

            instance.handleShiftKeyDown(0, 0);
        });

        test('should deselect source when both source and target are selected', () => {
            const wrapper = getWrapper({
                selectedItems: ['a', 'b'],
            });
            wrapper.setState({ focusedIndex: 0 });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['b']))).toBe(true);
                expect(focusedIndex).toEqual(1);
            };

            instance.handleShiftKeyDown(1, 4);
        });

        test('should select source when target is selected but not source', () => {
            const wrapper = getWrapper({
                selectedItems: ['b'],
            });
            wrapper.setState({ focusedIndex: 0 });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['a', 'b']))).toBe(true);
                expect(focusedIndex).toEqual(1);
            };

            instance.handleShiftKeyDown(1, 0);
        });

        test('should select both source and target when neither are selected', () => {
            const wrapper = getWrapper({
                selectedItems: [],
            });
            wrapper.setState({ focusedIndex: 0 });
            const instance = wrapper.instance();
            instance.onSelect = (selectedItems, focusedIndex) => {
                expect(selectedItems.equals(new Set(['a', 'b']))).toBe(true);
                expect(focusedIndex).toEqual(1);
            };

            instance.handleShiftKeyDown(1, 4);
        });
    });

    describe('isContiguousSelection()', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        const { isContiguousSelection } = instance;
        test('returns true if source is less than target and source - 1 is selected', () => {
            expect(isContiguousSelection(Set([0]), 1, 2)).toEqual(true);
        });

        test('returns false if source is less than target and source - 1 is not selected', () => {
            expect(isContiguousSelection(Set(), 1, 2)).toEqual(false);
        });

        test('returns true if source is greater than target and source + 1 is selected', () => {
            expect(isContiguousSelection(Set([2]), 1, 0)).toEqual(true);
        });

        test('returns false if source is greater than target and source + 1 is not selected', () => {
            expect(isContiguousSelection(Set(), 1, 2)).toEqual(false);
        });

        test('returns false if source and target are equal', () => {
            expect(isContiguousSelection(Set([0, 2]), 1, 1)).toEqual(false);
        });
    });

    describe('handleShiftKeyDownForGrid()', () => {
        afterEach(() => {
            shiftSelect.mockReset();
        });

        test('should select target when it is not already selected', () => {
            const selectedItems = [];
            const focusedIndex = 1;
            const targetIndex = 0;
            const anchorIndex = 1;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([0]));
            instance.onSelect = (funcSelectedItems, funcFocusedIndex) => {
                expect(funcSelectedItems.equals(new Set(['a']))).toBe(true);
                expect(funcFocusedIndex).toEqual(0);
            };

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set(selectedItems), focusedIndex, targetIndex, anchorIndex);
        });

        test('should deselect source when both source and target are selected', () => {
            const selectedItems = ['a', 'b'];
            const focusedIndex = 0;
            const targetIndex = 1;
            const anchorIndex = 0;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([1]));
            instance.onSelect = (funcSelectedItems, funcFocusedIndex) => {
                expect(funcSelectedItems.equals(new Set(['b']))).toBe(true);
                expect(funcFocusedIndex).toEqual(1);
            };

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set([0, 1]), focusedIndex, targetIndex, anchorIndex);
        });

        test('should select source when target is selected but not source', () => {
            const selectedItems = ['b'];
            const focusedIndex = 0;
            const targetIndex = 1;
            const anchorIndex = 0;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([0, 1]));
            instance.onSelect = (funcSelectedItems, funcFocusedIndex) => {
                expect(funcSelectedItems.equals(new Set(['a', 'b']))).toBe(true);
                expect(funcFocusedIndex).toEqual(1);
            };

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set([1]), focusedIndex, targetIndex, anchorIndex);
        });

        test('should select source and target and set anchor when both are unselected', () => {
            const selectedItems = [];
            const focusedIndex = 2;
            const targetIndex = 3;
            const anchorIndex = 2;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([2, 3]));
            instance.onSelect = (funcSelectedItems, funcFocusedIndex) => {
                expect(funcSelectedItems.equals(new Set(['c', 'd']))).toBe(true);
                expect(funcFocusedIndex).toEqual(targetIndex);
            };

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set([]), focusedIndex, targetIndex, anchorIndex);
        });

        test('should select source and target and not set anchor when both are unselected and it is a continuation', () => {
            const selectedItems = ['a', 'b'];
            const focusedIndex = 2;
            const targetIndex = 3;
            const anchorIndex = 0;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([0, 1, 2, 3]));
            instance.onSelect = (funcSelectedItems, funcFocusedIndex) => {
                expect(funcSelectedItems.equals(new Set(['a', 'b', 'c', 'd']))).toBe(true);
                expect(funcFocusedIndex).toEqual(targetIndex);
            };

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set([0, 1]), focusedIndex, targetIndex, anchorIndex);
        });

        test('should set targetIndex to 0 when it is below 0', () => {
            const selectedItems = ['b'];
            const focusedIndex = 1;
            const targetIndex = -1;
            const anchorIndex = 0;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([0, 1]));

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set([1]), focusedIndex, 0, anchorIndex);
        });

        test('should set targetIndex to max index when it is greater than the max index', () => {
            const selectedItems = ['b'];
            const focusedIndex = 1;
            const targetIndex = data.length;
            const anchorIndex = 0;

            const wrapper = getWrapper({
                selectedItems,
            });
            wrapper.setState({ focusedIndex });
            const instance = wrapper.instance();
            shiftSelect.mockImplementation(() => new Set([0, 1]));

            instance.handleShiftKeyDownForGrid(targetIndex);
            expect(shiftSelect).toHaveBeenCalledWith(Set([1]), focusedIndex, data.length - 1, anchorIndex);
        });
    });

    describe('clearFocus()', () => {
        test('should clear focus', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            wrapper.setState({ focusedIndex: 1 });

            instance.clearFocus();

            expect(wrapper.state('focusedIndex')).toBeUndefined();
        });
    });

    describe('blur detection', () => {
        test('should not set timer when table does not have focus', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.clearFocus = jest.fn();
            wrapper.setState({ focusedIndex: undefined });

            instance.handleTableBlur();
            jest.runAllTimers();

            expect(instance.blurTimerID).toBeNull();
            expect(instance.clearFocus).toBeCalledTimes(0);
        });

        test('should clear focus after timeout expires', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.clearFocus = jest.fn();
            wrapper.setState({ focusedIndex: 1 });

            instance.handleTableBlur();
            jest.runAllTimers();

            expect(instance.clearFocus).toBeCalledTimes(1);
        });

        test('should not clear focus if focus is regained before timeout expires', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.clearFocus = jest.fn();
            wrapper.setState({ focusedIndex: 1 });

            instance.handleTableBlur();
            instance.handleTableFocus(); // regain focus
            jest.runAllTimers();

            expect(instance.clearFocus).toBeCalledTimes(0);
        });
    });

    describe('keyboard shortcuts', () => {
        test('should set and return this.hotkeys when this.hotkeys is null', () => {
            const instance = getWrapper({}).instance();

            // should be initially null
            instance.hotkeys = null;

            const shortcuts = instance.getHotkeyConfigs();

            // should not be null anymore
            expect(instance.hotkeys).not.toBeNull();
            expect(shortcuts).toEqual(instance.hotkeys);
        });

        test('should use correct description and hotkey type for all shortcuts', () => {
            const hotkeyType = 'item selection';

            const instance = getWrapper({
                hotkeyType,
            }).instance();

            const shortcuts = instance.getHotkeyConfigs();

            shortcuts.forEach(shortcut => {
                expect(shortcut.description).toBeTruthy();
                expect(shortcut.type).toEqual(hotkeyType);
            });
        });

        describe('meta+a / ctrl+a', () => {
            const hotKey = ['meta+a', 'ctrl+a'];

            test('should call event.preventDefault() and select all items', () => {
                const wrapper = getWrapper({
                    selectedItems: [],
                });
                wrapper.setState({ focusedIndex: 1 });

                const instance = wrapper.instance();
                instance.onSelect = (selectedItems, focusedIndex) => {
                    expect(selectedItems.equals(new Set(data))).toBe(true);
                    expect(focusedIndex).toEqual(1);
                };

                const shortcut = instance.getHotkeyConfigs().find(h => isEqual(h.get('key'), hotKey));
                shortcut.handler({ preventDefault: sandbox.mock() });
            });
        });

        describe('esc', () => {
            const hotKey = 'esc';

            test('should set selection to empty', () => {
                const wrapper = getWrapper({
                    selectedItems: ['a', 'b', 'c'],
                });
                wrapper.setState({ focusedIndex: 1 });

                const instance = wrapper.instance();
                instance.onSelect = (selectedItems, focusedIndex) => {
                    expect(selectedItems.equals(new Set([]))).toBe(true);
                    expect(focusedIndex).toEqual(1);
                };

                const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                shortcut.handler();
            });
        });

        describe('shift+x', () => {
            const hotKey = 'shift+x';

            test('should be no-op when focusedIndex is undefined', () => {
                const wrapper = getWrapper({
                    onSelect: sandbox.mock().never(),
                });
                wrapper.setState({ focusedIndex: undefined });

                const instance = wrapper.instance();

                const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                shortcut.handler();
            });

            test('should call selectToggle on focused item', () => {
                const wrapper = getWrapper({
                    focusedItem: 'b',
                    selectedItems: ['a'],
                });
                wrapper.setState({ focusedIndex: 1 });

                const instance = wrapper.instance();
                instance.selectToggle = sandbox.mock().withArgs(1);

                const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                shortcut.handler();
            });
        });

        describe('ListView specific', () => {
            describe('down', () => {
                const hotKey = 'down';

                test('should set focus to first row when no currently focused item', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should call event.preventDefault() and set focus to next item', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(1);
                });

                test('should not focus on an index higher than the highest index in the table', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 4 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(4);
                });

                test.each([['flyout-overlay'], ['dropdown-menu-element']])(
                    'should not set focus if element with class %s is rendered',
                    className => {
                        testClassNamePreventsArrowNavigation(className, hotKey);
                    },
                );

                test('should not set focus if element with role="menu" is rendered', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });

                    jest.spyOn(document, 'querySelector').mockImplementation(selector => {
                        if (selector === '[role="menu"]') {
                            return document.createElement('div'); // mock element found
                        }
                        return null;
                    });

                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(undefined);
                });
            });

            describe('up', () => {
                const hotKey = 'up';

                test('should call event.preventDefault() and call onSelect with new focused item', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should not focus on an index lower than 0', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test.each([['flyout-overlay'], ['dropdown-menu-element']])(
                    'should not set focus if element with class %s is rendered',
                    className => {
                        testClassNamePreventsArrowNavigation(className, hotKey);
                    },
                );

                test('should not set focus if element with role="menu" is rendered', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });

                    jest.spyOn(document, 'querySelector').mockImplementation(selector => {
                        if (selector === '[role="menu"]') {
                            return document.createElement('div');
                        }
                        return null;
                    });

                    wrapper.setState({ focusedIndex: 1 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(1);
                });
            });

            describe('shift+down', () => {
                const hotKey = 'shift+down';

                test('should be no-op when focusedIndex is undefined', () => {
                    const wrapper = getWrapper({
                        onSelect: sandbox.mock().never(),
                    });
                    wrapper.setState({ focusedIndex: undefined });

                    const instance = wrapper.instance();

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should call handleShiftKeyDown() with the index of the next item in the table', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDown = sandbox.mock().withArgs(1, data.length - 1);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should not call handleShiftKeyDown() with an index greater than the highest index', () => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 4 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDown = sandbox.mock().withArgs(data.length - 1, data.length - 1);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });
            });

            describe('shift+up', () => {
                const hotKey = 'shift+up';

                test('should be no-op when focusedIndex is undefined', () => {
                    const wrapper = getWrapper({
                        onSelect: sandbox.mock().never(),
                    });
                    wrapper.setState({ focusedIndex: undefined });

                    const instance = wrapper.instance();

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should call handleShiftKeyDown() with index of the next item in the table', () => {
                    const wrapper = getWrapper({
                        focusedItem: 'b',
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDown = sandbox.mock().withArgs(0, 0);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should not call handleShiftKeyDown() with an index lower than 0', () => {
                    const wrapper = getWrapper({
                        focusedItem: 'a',
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDown = sandbox.mock().withArgs(0, 0);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });
            });

            describe('QuickSearch specific', () => {
                const hotKey = 'down';
                test.each([
                    ['quickSearchResultItemFooBar'],
                    ['quickSearchRecentItemFooBar'],
                    ['quickSearchQueryFooter'],
                    ['bp_text_button_module'],
                ])('should not set focus if target is %s', targetClass => {
                    const wrapper = getWrapper({
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ target: { className: targetClass } });
                    expect(wrapper.state('focusedIndex')).toEqual(undefined);
                });

                test.each([['bpSmallListItem'], ['radixCollectionItem']])(
                    'should not set focus if dataset contains %s',
                    datasetKey => {
                        const wrapper = getWrapper({
                            selectedItems: ['a'],
                        });
                        wrapper.setState({ focusedIndex: undefined });
                        const instance = wrapper.instance();
                        const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                        const event = { target: { dataset: { [datasetKey]: true } } };
                        shortcut.handler(event);
                        expect(wrapper.state('focusedIndex')).toEqual(undefined);
                    },
                );
            });
        });

        describe('GridView specific', () => {
            const gridColumnCount = 3;

            describe('right', () => {
                const hotKey = 'right';

                test('should set focus to first row when no currently focused item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should not set focus to first row if target has role of slider', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ target: { role: 'slider' } });
                    expect(wrapper.state('focusedIndex')).toEqual(undefined);
                });

                test('should call event.preventDefault() and set focus to next item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(1);
                });

                test('should not focus on an index higher than the highest index in the table', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 4 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(4);
                });

                test.each([['flyout-overlay'], ['dropdown-menu-element']])(
                    'should not set focus if element with class %s is rendered',
                    className => {
                        testClassNamePreventsArrowNavigation(className, hotKey, true);
                    },
                );
            });

            describe('left', () => {
                const hotKey = 'left';

                test('should not set focus to first row if target has role of slider', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ target: { role: 'slider' } });
                    expect(wrapper.state('focusedIndex')).toEqual(undefined);
                });

                test('should call event.preventDefault() and call onSelect with new focused item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should call event.preventDefault() and set focus to previous item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should not focus on an index lower than 0', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test.each([['flyout-overlay'], ['dropdown-menu-element']])(
                    'should not set focus if element with class %s is rendered',
                    className => {
                        testClassNamePreventsArrowNavigation(className, hotKey, true);
                    },
                );
            });
            describe('down', () => {
                const hotKey = 'down';

                test('should set focus to first row when no currently focused item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should not set focus to first row if target has role of slider', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ target: { role: 'slider' } });
                    expect(wrapper.state('focusedIndex')).toEqual(undefined);
                });

                test('should call event.preventDefault() and set focus to next row item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(gridColumnCount);
                });

                test('should not focus on an index higher than the highest index in the table', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 4 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(4);
                });

                test.each([['flyout-overlay'], ['dropdown-menu-element']])(
                    'should not set focus if element with class %s is rendered',
                    className => {
                        testClassNamePreventsArrowNavigation(className, hotKey, true);
                    },
                );
            });

            describe('up', () => {
                const hotKey = 'up';

                test('should not set focus to first row if target has role of slider', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: undefined });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ target: { role: 'slider' } });
                    expect(wrapper.state('focusedIndex')).toEqual(undefined);
                });

                test('should call event.preventDefault() and call onSelect with new focused item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should call event.preventDefault() and set focus to previous row item', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: gridColumnCount });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.mock() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test('should not focus on an index lower than 0', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });
                    const instance = wrapper.instance();
                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler({ preventDefault: sandbox.stub() });
                    expect(wrapper.state('focusedIndex')).toEqual(0);
                });

                test.each([['flyout-overlay'], ['dropdown-menu-element']])(
                    'should not set focus if element with class %s is rendered',
                    className => {
                        testClassNamePreventsArrowNavigation(className, hotKey, true);
                    },
                );
            });

            describe('shift+right', () => {
                const hotKey = 'shift+right';

                test('should be no-op when focusedIndex is undefined', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        onSelect: sandbox.mock().never(),
                    });
                    wrapper.setState({ focusedIndex: undefined });

                    const instance = wrapper.instance();

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should call handleShiftKeyDownForGrid() with the index of the next item in the table', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(1);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should not call handleShiftKeyDownForGrid() with an index greater than the highest index', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 4 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(data.length - 1);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });
            });

            describe('shift+left', () => {
                const hotKey = 'shift+left';

                test('should be no-op when focusedIndex is undefined', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        onSelect: sandbox.mock().never(),
                    });
                    wrapper.setState({ focusedIndex: undefined });

                    const instance = wrapper.instance();

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should call handleShiftKeyDownForGrid() with index of the next item in the table', () => {
                    const wrapper = getWrapper({
                        focusedItem: 'b',
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(0);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should not call handleShiftKeyDownForGrid() with an index lower than 0', () => {
                    const wrapper = getWrapper({
                        focusedItem: 'a',
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(0);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });
            });

            describe('shift+down', () => {
                const hotKey = 'shift+down';

                test('should be no-op when focusedIndex is undefined', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        onSelect: sandbox.mock().never(),
                    });
                    wrapper.setState({ focusedIndex: undefined });

                    const instance = wrapper.instance();

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should call handleShiftKeyDownForGrid() with the index of the next row item in the table', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(gridColumnCount);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should not call handleShiftKeyDownForGrid() with an index greater than the highest index', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 4 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(data.length - 1);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });
            });

            describe('shift+up', () => {
                const hotKey = 'shift+up';

                test('should be no-op when focusedIndex is undefined', () => {
                    const wrapper = getWrapper({
                        gridColumnCount,
                        isGridView: true,
                        onSelect: sandbox.mock().never(),
                    });
                    wrapper.setState({ focusedIndex: undefined });

                    const instance = wrapper.instance();

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should call handleShiftKeyDownForGrid() with index of the next item in the table', () => {
                    const wrapper = getWrapper({
                        focusedItem: 'b',
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 1 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(0);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });

                test('should not call handleShiftKeyDownForGrid() with an index lower than 0', () => {
                    const wrapper = getWrapper({
                        focusedItem: 'a',
                        gridColumnCount,
                        isGridView: true,
                        selectedItems: ['a'],
                    });
                    wrapper.setState({ focusedIndex: 0 });

                    const instance = wrapper.instance();
                    instance.handleShiftKeyDownForGrid = sandbox.mock().withArgs(0);

                    const shortcut = instance.getHotkeyConfigs().find(h => h.get('key') === hotKey);
                    shortcut.handler();
                });
            });
        });
    });

    describe('handleKeyboardSearch()', () => {
        const searchStrings = ['abc', 'bcd', 'cde', 'def', 'efg'];
        const target = document.createElement('div');

        const getWrapperWithSearchStrings = () => getWrapper({ searchStrings });

        test('should set index correctly to matching string', () => {
            const wrapper = getWrapperWithSearchStrings();
            const instance = wrapper.instance();
            instance.searchString = 'd';

            instance.handleKeyboardSearch({ target, key: 'e' });

            expect(wrapper.state('focusedIndex')).toEqual(3); // should focus on "def"
        });

        test('should reset searchString after 1 second', () => {
            const wrapper = getWrapperWithSearchStrings();
            const instance = wrapper.instance();

            // start typing "c"
            instance.handleKeyboardSearch({ target, key: 'c' });

            jest.advanceTimersByTime(1001);

            // type "d"
            instance.handleKeyboardSearch({ target, key: 'd' });

            // should match "def" rather than "cde" due to timeout
            expect(wrapper.state('focusedIndex')).toEqual(3);
        });

        test('should not change focused index when no string match', () => {
            const wrapper = getWrapperWithSearchStrings();
            wrapper.setState({ focusedIndex: 3 });

            const instance = wrapper.instance();
            instance.handleKeyboardSearch({ target, key: 'z' });

            expect(wrapper.state('focusedIndex')).toEqual(3); // should not change
        });

        test('should be noop when event target is contenteditable', () => {
            const wrapper = getWrapperWithSearchStrings();
            wrapper.setState({ focusedIndex: 3 });

            const instance = wrapper.instance();
            instance.handleKeyboardSearch({
                target: { hasAttribute: () => true },
                key: 'a',
            });

            expect(wrapper.state('focusedIndex')).toEqual(3); // should not change
        });
        [
            {
                nodeName: 'INPUT',
            },
            {
                nodeName: 'TEXTAREA',
            },
        ].forEach(({ nodeName }) => {
            test('should be noop when event target is text field', () => {
                const wrapper = getWrapperWithSearchStrings();
                wrapper.setState({ focusedIndex: 3 });

                const instance = wrapper.instance();
                instance.handleKeyboardSearch({
                    target: { hasAttribute: () => false, nodeName },
                    key: 'a',
                });

                expect(wrapper.state('focusedIndex')).toEqual(3); // should not change
            });
        });
    });

    describe('isDropdownMenuOpen()', () => {
        test('should return true when .dropdown-menu-element exists', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            jest.spyOn(document, 'querySelector').mockImplementation(selector => {
                if (selector === '.dropdown-menu-element') {
                    return document.createElement('div');
                }
                return null;
            });

            expect(instance.isDropdownMenuOpen()).toBe(true);
        });

        test('should return true when element with role="menu" exists', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            jest.spyOn(document, 'querySelector').mockImplementation(selector => {
                if (selector === '[role="menu"]') {
                    return document.createElement('div');
                }
                return null;
            });

            expect(instance.isDropdownMenuOpen()).toBe(true);
        });

        test('should return true when both .dropdown-menu-element and role="menu" exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            jest.spyOn(document, 'querySelector').mockImplementation(() => {
                return document.createElement('div');
            });

            expect(instance.isDropdownMenuOpen()).toBe(true);
        });

        test('should return false when neither .dropdown-menu-element nor role="menu" exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            jest.spyOn(document, 'querySelector').mockImplementation(() => null);

            expect(instance.isDropdownMenuOpen()).toBe(false);
        });
    });

    describe('render()', () => {
        test('should add "is-selectable" class and pass props to table', () => {
            const wrapper = getWrapper({});
            const instance = wrapper.instance();
            wrapper.setState({ focusedIndex: 1 });

            const table = wrapper.find('Table');
            expect(table.hasClass('is-selectable')).toBe(true);
            expect(table.prop('onCheckboxClick')).toEqual(instance.handleCheckboxClick);
            expect(table.prop('onRowClick')).toEqual(wrapper.instance().handleRowClick);
            expect(table.prop('onRowFocus')).toEqual(wrapper.instance().handleRowFocus);
            expect(table.prop('focusedItem')).toEqual('b');
            expect(table.prop('focusedIndex')).toEqual(1);
            expect(table.prop('onTableBlur')).toBe(instance.handleTableBlur);
            expect(table.prop('onTableFocus')).toBe(instance.handleTableFocus);
        });
    });
});
