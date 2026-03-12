import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { createMemoryHistory, History, Location } from 'history';
import { Action, Annotator, AnnotatorContext, withAnnotations, Status } from '../index';
import { WithAnnotationsProps, ComponentWithAnnotations } from '../withAnnotations';
import { FeedEntryType, ViewType } from '../../types/SidebarNavigation';

type ComponentProps = {
    className?: string;
    history?: History;
    location?: Location;
};

type WrappedProps = ComponentProps & Partial<WithAnnotationsProps>;
type WrapperType = ShallowWrapper<WrappedProps, {}, Component & ComponentWithAnnotations>;

describe('elements/common/annotator-context/withAnnotations', () => {
    const defaults = {
        className: 'foo',
        onAnnotator: jest.fn(),
        onError: jest.fn(),
        onPreviewDestroy: jest.fn(),
    };
    const MockComponent = (props: ComponentProps) => <div {...props} />;
    const WrappedComponent = withAnnotations(MockComponent);

    const getWrapper = (props: WrappedProps = {}): WrapperType =>
        shallow(<WrappedComponent {...defaults} {...props} />);
    const getContextProvider = (wrapper: WrapperType) => wrapper.find(AnnotatorContext.Provider);
    let mockAnnotator = {} as Annotator;

    beforeEach(() => {
        mockAnnotator = {
            addListener: jest.fn(),
            emit: jest.fn(),
            removeAllListeners: jest.fn(),
            removeListener: jest.fn(),
        };
    });

    describe('constructor', () => {
        test('should parse the history location pathname to initialize state with activeAnnotationId', () => {
            const history = createMemoryHistory({ initialEntries: ['/activity/annotations/123/456'] }) as History;
            const wrapper = getWrapper({ history, location: history.location });
            expect(wrapper.state('activeAnnotationId')).toBe('456');
        });

        test('should not initialize state with activeAnnotationId if history path does not match deeplink schema', () => {
            const history = createMemoryHistory({ initialEntries: ['/activity/annotations/456'] }) as History;
            const wrapper = getWrapper({ history, location: history.location });
            expect(wrapper.state('activeAnnotationId')).toBe(null);
        });

        test('should use sidebarNavigation prop to initialize state with activeAnnotationId if routerDisabled is true', () => {
            const wrapper = getWrapper({
                routerDisabled: true,
                sidebarNavigation: {
                    activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                    activeFeedEntryId: '456',
                    sidebar: ViewType.ACTIVITY,
                    fileVersionId: '123',
                },
            });
            expect(wrapper.state('activeAnnotationId')).toBe('456');
        });

        test('should use sidebarNavigation prop to initialize state with activeAnnotationId if routerDisabled is true in feature flags', () => {
            const wrapper = getWrapper({
                features: { routerDisabled: { value: true } },
                sidebarNavigation: {
                    activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                    activeFeedEntryId: '456',
                    sidebar: ViewType.ACTIVITY,
                    fileVersionId: '123',
                },
            });
            expect(wrapper.state('activeAnnotationId')).toBe('456');
        });

        test('should not initialize state with activeAnnotationId if routerDisabled is true and sidebarNavigation is not provided', () => {
            const wrapper = getWrapper({ routerDisabled: true });
            expect(wrapper.state('activeAnnotationId')).toBe(null);
        });
    });

    test('should pass onAnnotator and onPreviewDestroy as props on the wrapped component', () => {
        const wrapper = getWrapper();
        const wrappedComponent = wrapper.find<WrappedProps>(MockComponent);

        expect(wrappedComponent.exists()).toBeTruthy();
        expect(wrappedComponent.props().onAnnotator).toBeTruthy();
        expect(wrappedComponent.props().onPreviewDestroy).toBeTruthy();
    });

    test('should pass the context on to the AnnotatorContext.Provider', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        const contextProvider = getContextProvider(wrapper);

        expect(contextProvider.exists()).toBeTruthy();
        expect(contextProvider.prop('value').emitActiveAnnotationChangeEvent).toEqual(
            instance.emitActiveAnnotationChangeEvent,
        );
        expect(contextProvider.prop('value').emitAnnotationRemoveEvent).toEqual(instance.emitAnnotationRemoveEvent);
        expect(contextProvider.prop('value').emitAnnotationReplyCreateEvent).toEqual(
            instance.emitAnnotationReplyCreateEvent,
        );
        expect(contextProvider.prop('value').emitAnnotationReplyDeleteEvent).toEqual(
            instance.emitAnnotationReplyDeleteEvent,
        );
        expect(contextProvider.prop('value').emitAnnotationReplyUpdateEvent).toEqual(
            instance.emitAnnotationReplyUpdateEvent,
        );
        expect(contextProvider.prop('value').emitAnnotationUpdateEvent).toEqual(instance.emitAnnotationUpdateEvent);
        expect(contextProvider.prop('value').getAnnotationsMatchPath).toEqual(instance.getMatchPath);
        expect(contextProvider.prop('value').getAnnotationsPath).toEqual(instance.getAnnotationsPath);
        expect(contextProvider.prop('value').state).toEqual({
            action: null,
            activeAnnotationFileVersionId: null,
            activeAnnotationId: null,
            annotation: null,
            annotationReply: null,
            error: null,
            meta: null,
        });
    });

    test('should not pass annotations router props if routerDisabled is true', () => {
        const wrapper = getWrapper({ routerDisabled: true });
        const contextProvider = getContextProvider(wrapper);
        expect(contextProvider.prop('value').getAnnotationsMatchPath).toBeUndefined();
        expect(contextProvider.prop('value').getAnnotationsPath).toBeUndefined();
    });

    test('should not pass annotations router props if routerDisabled is true in feature flags', () => {
        const wrapper = getWrapper({ features: { routerDisabled: { value: true } } });
        const contextProvider = getContextProvider(wrapper);
        expect(contextProvider.prop('value').getAnnotationsMatchPath).toBeUndefined();
        expect(contextProvider.prop('value').getAnnotationsPath).toBeUndefined();
    });

    describe('emitActiveAnnotationChangeEvent', () => {
        test('should call annotator emit on action', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            // Set the annotator on the withAnnotations instance
            instance.handleAnnotator(mockAnnotator);
            instance.emitActiveAnnotationChangeEvent('123');

            expect(mockAnnotator.emit).toBeCalled();
            expect(mockAnnotator.emit).toBeCalledWith('annotations_active_set', '123');
        });
    });

    describe('emitAnnotationRemoveEvent', () => {
        test.each`
            isStartEvent | expectedEvent
            ${undefined} | ${'annotations_remove'}
            ${false}     | ${'annotations_remove'}
            ${true}      | ${'annotations_remove_start'}
        `(
            'given isStartEvent = $isStartEvent should call annotator emit with event = $expectedEvent',
            ({ isStartEvent, expectedEvent }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();

                instance.handleAnnotator(mockAnnotator);
                instance.emitAnnotationRemoveEvent('123', isStartEvent);

                expect(mockAnnotator.emit).toBeCalledWith(expectedEvent, '123');
            },
        );
    });

    describe('emitAnnotationUpdateEvent', () => {
        test.each`
            isStartEvent | expectedEvent
            ${undefined} | ${'sidebar.annotations_update'}
            ${false}     | ${'sidebar.annotations_update'}
            ${true}      | ${'sidebar.annotations_update_start'}
        `(
            'given isStartEvent = $isStartEvent should call annotator emit with event = $expectedEvent',
            ({ isStartEvent, expectedEvent }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const annotation = { id: '123', status: 'resolved' };

                instance.handleAnnotator(mockAnnotator);
                instance.emitAnnotationUpdateEvent(annotation, isStartEvent);

                expect(mockAnnotator.emit).toBeCalledWith(expectedEvent, annotation);
            },
        );
    });

    describe('emitAnnotationReplyCreateEvent', () => {
        test.each`
            isStartEvent | expectedEvent
            ${undefined} | ${'sidebar.annotations_reply_create'}
            ${false}     | ${'sidebar.annotations_reply_create'}
            ${true}      | ${'sidebar.annotations_reply_create_start'}
        `(
            'given isStartEvent = $isStartEvent should call annotator emit with event = $expectedEvent',
            ({ isStartEvent, expectedEvent }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const annotationId = '123';
                const reply = { tagged_message: 'abc' };
                const requestId = 'comment_123';

                instance.handleAnnotator(mockAnnotator);
                instance.emitAnnotationReplyCreateEvent(reply, requestId, annotationId, isStartEvent);

                expect(mockAnnotator.emit).toBeCalledWith(expectedEvent, { annotationId, reply, requestId });
            },
        );
    });

    describe('emitAnnotationReplyDeleteEvent', () => {
        test.each`
            isStartEvent | expectedEvent
            ${undefined} | ${'sidebar.annotations_reply_delete'}
            ${false}     | ${'sidebar.annotations_reply_delete'}
            ${true}      | ${'sidebar.annotations_reply_delete_start'}
        `(
            'given isStartEvent = $isStartEvent should call annotator emit with event = $expectedEvent',
            ({ isStartEvent, expectedEvent }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const annotationId = '123';
                const replyId = '456';

                instance.handleAnnotator(mockAnnotator);
                instance.emitAnnotationReplyDeleteEvent(replyId, annotationId, isStartEvent);

                expect(mockAnnotator.emit).toBeCalledWith(expectedEvent, { annotationId, id: replyId });
            },
        );
    });

    describe('emitAnnotationReplyUpdateEvent', () => {
        test.each`
            isStartEvent | expectedEvent
            ${undefined} | ${'sidebar.annotations_reply_update'}
            ${false}     | ${'sidebar.annotations_reply_update'}
            ${true}      | ${'sidebar.annotations_reply_update_start'}
        `(
            'given isStartEvent = $isStartEvent should call annotator emit with event = $expectedEvent',
            ({ isStartEvent, expectedEvent }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const annotationId = '123';
                const reply = { id: '456', tagged_message: 'resolved' };

                instance.handleAnnotator(mockAnnotator);
                instance.emitAnnotationReplyUpdateEvent(reply, annotationId, isStartEvent);

                expect(mockAnnotator.emit).toBeCalledWith(expectedEvent, { annotationId, reply });
            },
        );
    });

    describe('handleAnnotationCreate()', () => {
        const mockAnnotation = { foo: 'bar' };
        const mockError = new Error('boo');

        test.each`
            status            | annotation        | error        | expectedAction         | expectedAnnotation | expectedError
            ${Status.PENDING} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_START} | ${mockAnnotation}  | ${null}
            ${Status.SUCCESS} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${null}
            ${Status.ERROR}   | ${mockAnnotation} | ${mockError} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${mockError}
        `(
            'should update the context provider value if $status status received',
            ({ status, annotation, error, expectedAction, expectedAnnotation, expectedError }) => {
                const wrapper = getWrapper();
                const eventData = {
                    annotation,
                    meta: {
                        status,
                        requestId: '123',
                    },
                    error,
                };

                wrapper.instance().handleAnnotationCreate(eventData);
                const contextProvider = getContextProvider(wrapper);

                expect(contextProvider.exists()).toBeTruthy();
                expect(contextProvider.prop('value').state).toEqual({
                    action: expectedAction,
                    activeAnnotationFileVersionId: null,
                    activeAnnotationId: null,
                    annotation: expectedAnnotation,
                    annotationReply: null,
                    error: expectedError,
                    meta: {
                        status,
                        requestId: '123',
                    },
                });
            },
        );

        test('should invoke the onError prop if provided', () => {
            const onError = jest.fn();
            const wrapper = getWrapper({ onError });

            wrapper.instance().handleAnnotationCreate({
                error: mockError,
                meta: {
                    requestId: '123',
                    status: Status.ERROR,
                },
            });

            expect(onError).toHaveBeenCalledWith(mockError, 'create_annotation_error', { showNotification: true });
        });
    });

    describe('handleAnnotationDelete()', () => {
        test.each`
            status            | expectedAction
            ${Status.PENDING} | ${Action.DELETE_START}
            ${Status.SUCCESS} | ${Action.DELETE_END}
        `('should update the context provider value if $status status received', ({ status, expectedAction }) => {
            const wrapper = getWrapper();
            const annotation = { id: '123' };
            const eventData = {
                annotation,
                meta: { status },
            };

            wrapper.instance().handleAnnotationDelete(eventData);
            const contextProvider = getContextProvider(wrapper);

            expect(contextProvider.exists()).toBeTruthy();
            expect(contextProvider.prop('value').state).toEqual({
                action: expectedAction,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation,
                annotationReply: null,
                error: null,
                meta: { status },
            });
        });
    });

    describe('handleAnnotationUpdate()', () => {
        test.each`
            status            | expectedAction
            ${Status.PENDING} | ${Action.UPDATE_START}
            ${Status.SUCCESS} | ${Action.UPDATE_END}
        `('should update the context provider value if $status status received', ({ status, expectedAction }) => {
            const wrapper = getWrapper();
            const annotation = { id: '123', status: 'resolved' };
            const eventData = {
                annotation,
                meta: { status },
            };

            wrapper.instance().handleAnnotationUpdate(eventData);
            const contextProvider = getContextProvider(wrapper);

            expect(contextProvider.exists()).toBeTruthy();
            expect(contextProvider.prop('value').state).toEqual({
                action: expectedAction,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation,
                annotationReply: null,
                error: null,
                meta: { status },
            });
        });
    });

    describe('handleAnnotationReplyCreate()', () => {
        test.each`
            status            | expectedAction
            ${Status.PENDING} | ${Action.REPLY_CREATE_START}
            ${Status.SUCCESS} | ${Action.REPLY_CREATE_END}
        `('should update the context provider value if $status status received', ({ status, expectedAction }) => {
            const wrapper = getWrapper();
            const annotation = { id: '123', status: 'resolved' };
            const annotationReply = { tagged_message: 'abc' };
            const requestId = 'comment_123';
            const eventData = {
                annotation,
                annotationReply,
                meta: { status, requestId },
            };

            wrapper.instance().handleAnnotationReplyCreate(eventData);
            const contextProvider = getContextProvider(wrapper);

            expect(contextProvider.exists()).toBeTruthy();
            expect(contextProvider.prop('value').state).toEqual({
                action: expectedAction,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation,
                annotationReply,
                error: null,
                meta: { status, requestId },
            });
        });
    });

    describe('handleAnnotationReplyUpdate()', () => {
        test.each`
            status            | expectedAction
            ${Status.PENDING} | ${Action.REPLY_UPDATE_START}
            ${Status.SUCCESS} | ${Action.REPLY_UPDATE_END}
        `('should update the context provider value if $status status received', ({ status, expectedAction }) => {
            const wrapper = getWrapper();
            const annotation = { id: '123', status: 'resolved' };
            const annotationReply = { id: '123', tagged_message: 'abc' };
            const eventData = {
                annotation,
                annotationReply,
                meta: { status },
            };

            wrapper.instance().handleAnnotationReplyUpdate(eventData);
            const contextProvider = getContextProvider(wrapper);

            expect(contextProvider.exists()).toBeTruthy();
            expect(contextProvider.prop('value').state).toEqual({
                action: expectedAction,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation,
                annotationReply,
                error: null,
                meta: { status },
            });
        });
    });

    describe('handleAnnotationReplyDelete()', () => {
        test.each`
            status            | expectedAction
            ${Status.PENDING} | ${Action.REPLY_DELETE_START}
            ${Status.SUCCESS} | ${Action.REPLY_DELETE_END}
        `('should update the context provider value if $status status received', ({ status, expectedAction }) => {
            const wrapper = getWrapper();
            const annotation = { id: '123' };
            const annotationReply = { id: '123' };
            const eventData = {
                annotation,
                annotationReply,
                meta: { status },
            };

            wrapper.instance().handleAnnotationReplyDelete(eventData);
            const contextProvider = getContextProvider(wrapper);

            expect(contextProvider.exists()).toBeTruthy();
            expect(contextProvider.prop('value').state).toEqual({
                action: expectedAction,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation,
                annotationReply,
                error: null,
                meta: { status },
            });
        });
    });

    describe('handleActiveChange()', () => {
        test.each`
            annotationId | fileVersionId | expectedAnnotationId | expectedFileVersionId
            ${null}      | ${'456'}      | ${null}              | ${'456'}
            ${'123'}     | ${'456'}      | ${'123'}             | ${'456'}
        `(
            'should update activeAnnotationId state to reflect value $annotationId',
            ({ annotationId, fileVersionId, expectedAnnotationId, expectedFileVersionId }) => {
                const wrapper = getWrapper();

                wrapper.instance().handleActiveChange({ annotationId, fileVersionId });
                const contextProvider = getContextProvider(wrapper);
                const { activeAnnotationFileVersionId, activeAnnotationId } = contextProvider.prop('value').state;
                expect(contextProvider.exists()).toBeTruthy();
                expect(activeAnnotationFileVersionId).toEqual(expectedFileVersionId);
                expect(activeAnnotationId).toEqual(expectedAnnotationId);
            },
        );
    });

    describe('handleAnnotationFetchError()', () => {
        test('should call onError', () => {
            const instance = getWrapper().instance();

            const mockError = new Error();
            instance.handleAnnotationFetchError({ error: mockError });

            expect(defaults.onError).toHaveBeenCalledWith(mockError, 'fetch_annotations_error', {
                showNotification: true,
            });
        });
    });

    describe('handlePreviewDestroy()', () => {
        test('should reset state and annotator', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleAnnotator(mockAnnotator);
            wrapper.setState({ activeAnnotationId: '123', activeAnnotationFileVersionId: '456' });
            wrapper.instance().handlePreviewDestroy();

            expect(wrapper.state()).toEqual({
                action: null,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation: null,
                annotationReply: null,
                error: null,
                meta: null,
            });
        });

        test('should not reset state if called with false', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleAnnotator(mockAnnotator);
            wrapper.setState({ activeAnnotationId: '123', activeAnnotationFileVersionId: '456' });
            wrapper.instance().handlePreviewDestroy(false);

            expect(wrapper.state('activeAnnotationId')).toBe('123');
            expect(wrapper.state('activeAnnotationFileVersionId')).toBe('456');
        });

        test.each([true, false])('should remove all annotator event listeners', shouldReset => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.handleAnnotator(mockAnnotator);
            instance.handlePreviewDestroy(shouldReset);

            expect(mockAnnotator.removeListener).toBeCalledWith(
                'annotations_active_change',
                instance.handleActiveChange,
            );
            expect(mockAnnotator.removeListener).toBeCalledWith('annotations_create', instance.handleAnnotationCreate);
            expect(mockAnnotator.removeListener).toBeCalledWith(
                'annotations_fetch_error',
                instance.handleAnnotationFetchError,
            );
        });
    });

    describe('getAnnotationsPath()', () => {
        test.each`
            fileVersionId | annotationId | expectedPath
            ${undefined}  | ${undefined} | ${'/activity'}
            ${undefined}  | ${null}      | ${'/activity'}
            ${'123'}      | ${undefined} | ${'/activity/annotations/123'}
            ${'123'}      | ${null}      | ${'/activity/annotations/123'}
            ${'123'}      | ${'456'}     | ${'/activity/annotations/123/456'}
        `('should return $expectedPath', ({ fileVersionId, annotationId, expectedPath }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getAnnotationsPath(fileVersionId, annotationId)).toBe(expectedPath);
        });
    });
});
