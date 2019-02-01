/* eslint-disable no-underscore-dangle */
import React from 'react';
import sinon from 'sinon';

import FileVersionList from '../FileVersionList';

const sandbox = sinon.sandbox.create();

describe('features/version-history-modal/FileVersionList', () => {
    const getTestVersion = (values = {}) => ({
        created: 5000,
        extension: 'jpg',
        fileVersionID: '123_456',
        id: '1',
        isCurrent: false,
        itemName: 'test',
        itemTypedID: 'file_123_456',
        updated: 10000,
        uploaderUserName: 'uploader',
        versionNumber: 10,
        ...values,
    });

    const getWrapper = (props = {}) =>
        shallow(
            <FileVersionList
                canDelete
                canUpload
                isProcessing={false}
                onDelete={() => {}}
                onDownload={() => {}}
                onMakeCurrent={() => {}}
                onRestore={() => {}}
                style={{}}
                versionLimit={100}
                versions={[
                    getTestVersion({ id: '1', versionNumber: 1 }),
                    getTestVersion({ id: '2', versionNumber: 2 }),
                    getTestVersion({ id: '3', versionNumber: 3 }),
                ]}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('componentDidMount()', () => {
        test('should call recalculateRowHeights and jumptoVersionNumber when called', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const componentMock = sandbox.mock(instance);
            componentMock.expects('recalculateRowHeights');
            componentMock.expects('jumpToVersionNumber');

            instance.componentDidMount();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should call recalculateRowHeights but not jumpToVersionNumber when scrollToVersionNumber is the same', () => {
            const wrapper = getWrapper({
                scrollToVersionNumber: 10,
            });
            const instance = wrapper.instance();

            const componentMock = sandbox.mock(instance);
            componentMock.expects('recalculateRowHeights');
            componentMock.expects('jumpToVersionNumber').never();

            instance.componentDidUpdate({ scrollToVersionNumber: 10 });
        });

        test('should call jumpToVersionNumber when scrollToVersionNumber is different', () => {
            const wrapper = getWrapper({
                scrollToVersionNumber: 5, // Pretend this is the newly set prop
            });
            const instance = wrapper.instance();

            const componentMock = sandbox.mock(instance);
            componentMock.expects('jumpToVersionNumber');

            instance.componentDidUpdate({ scrollToVersionNumber: 10 }); // prevProps
        });
    });

    describe('recalculateRowHeights()', () => {
        test('should not call anything if list ref has not been set', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance._list = null;

            sandbox
                .mock(instance._cache)
                .expects('clearAll')
                .never();

            instance.recalculateRowHeights();
        });

        test('should call clearAll on cache and recomputeRowHeights on virtualized list ref', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance._list = {
                recomputeRowHeights: sandbox.mock(),
            };
            sandbox.mock(instance._cache).expects('clearAll');

            instance.recalculateRowHeights();
        });
    });

    describe('jumpToVersionNumber()', () => {
        test('should not do anything when scrollToVersionNumber is not set', () => {
            const wrapper = getWrapper({
                scrollToVersionNumber: null,
            });
            const instance = wrapper.instance();

            instance._list = {
                scrollToRow: sandbox.mock().never(),
            };

            instance.jumpToVersionNumber();
        });

        test('should not do anything when scrollToVersionNumber is not contained in the versions list', () => {
            const wrapper = getWrapper({
                scrollToVersionNumber: 5,
            });
            const instance = wrapper.instance();

            instance._list = {
                scrollToRow: sandbox.mock().never(),
            };

            instance.jumpToVersionNumber();
        });

        test('should call scrollToRow with index when scrollToVersionNumber is contained in the versions list', () => {
            const wrapper = getWrapper({
                scrollToVersionNumber: 2,
            });
            const instance = wrapper.instance();

            instance._list = {
                scrollToRow: sandbox.mock().withArgs(1),
            };

            instance.jumpToVersionNumber();
        });
    });

    describe('rowRenderer()', () => {
        test('should pass params down correctly to the nested components', () => {
            const wrapper = getWrapper({
                isProcessing: true,
            });
            const instance = wrapper.instance();

            const rowWrapper = shallow(
                <div>
                    {instance.rowRenderer({
                        index: 0,
                        style: { some: 'style' },
                        parent: { some: 'parent' },
                    })}
                </div>,
            );

            const cellMeasurerWrapper = rowWrapper.find('CellMeasurer');
            expect(cellMeasurerWrapper.prop('cache')).toEqual(instance._cache);
            expect(cellMeasurerWrapper.key()).toEqual('1'); // fileVersionID
            expect(cellMeasurerWrapper.prop('rowIndex')).toEqual(0);

            const listItemWrapper = cellMeasurerWrapper.find({
                isProcessing: true,
            });
            expect(listItemWrapper.length).toBe(1);
            expect(listItemWrapper.prop('isOverVersionLimit')).toEqual(false);
        });

        test('should pass isOverVersionLimit when versionLimit is greater than the index', () => {
            const wrapper = getWrapper({
                isProcessing: true,
                versionLimit: 1,
            });
            const instance = wrapper.instance();

            const rowWrapper = shallow(
                <div>
                    {instance.rowRenderer({
                        index: 2,
                        style: { some: 'style' },
                        parent: { some: 'parent' },
                    })}
                </div>,
            );

            const listItemWrapper = rowWrapper.find({
                isOverVersionLimit: true,
            });
            expect(listItemWrapper.length).toBe(1);
        });
    });

    describe('render()', () => {
        test('should apply classNames to the rendered div', () => {
            const wrapper = getWrapper({
                className: 'foo',
            });

            const divWrapper = wrapper.find('.foo');
            expect(divWrapper.length).toBe(1);
            expect(divWrapper.prop('className')).toEqual('file-version-list foo');
        });

        test('should render a List with the right props', () => {
            const wrapper = getWrapper({
                className: 'foo',
            });
            const instance = wrapper.instance();

            const listWrapper = wrapper.find('List');
            expect(listWrapper.length).toBe(1);
            expect(listWrapper.prop('rowRenderer')).toEqual(instance.rowRenderer);
            expect(listWrapper.prop('rowCount')).toEqual(3);
            expect(listWrapper.prop('height')).toEqual(300);
            expect(listWrapper.prop('width')).toEqual(400);
            expect(listWrapper.prop('deferredMeasurementCache')).toEqual(instance._cache);
            expect(listWrapper.prop('rowHeight')).toEqual(instance._cache.rowHeight);
            expect(listWrapper.prop('scrollToAlignment')).toEqual('start');
        });

        test('should render row with the right props', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const el = instance.rowRenderer({ index: 0, style: 0, parent: 0 });
            expect(el).toMatchSnapshot();
        });
    });
});
