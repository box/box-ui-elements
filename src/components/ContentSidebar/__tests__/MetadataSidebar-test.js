import React from 'react';
import { shallow } from 'enzyme';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from 'box-react-ui/lib/components/loading-indicator/LoadingIndicatorWrapper';
import Instances from 'box-react-ui/lib/features/metadata-instance-editor/Instances';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import { MetadataSidebarComponent as MetadataSidebar } from '../MetadataSidebar';

describe('components/ContentSidebar/Metadata/MetadataSidebar', () => {
    const getWrapper = (props) => shallow(<MetadataSidebar {...props} />);

    test('should render Metadata sidebar component when instances and templates are available', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            api
        });
        wrapper.setState({ templates: [], editors: [] });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(1);
        expect(wrapper.find(Instances)).toHaveLength(1);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper.find(InlineError)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render loading indicator component when templates are not available', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            api
        });
        wrapper.setState({ editors: [] });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(0);
        expect(wrapper.find(Instances)).toHaveLength(0);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(InlineError)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render loading indicator component when instances are not available', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            api
        });
        wrapper.setState({ templates: [] });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(0);
        expect(wrapper.find(Instances)).toHaveLength(0);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(InlineError)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render error when there was an error', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            getViewer: jest.fn(),
            api
        });
        wrapper.setState({ hasError: true });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(0);
        expect(wrapper.find(Instances)).toHaveLength(0);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper.find(InlineError)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    describe('getEditor()', () => {
        test('should return the correct editor', () => {
            const getEditors = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                getViewer: jest.fn(),
                api
            });
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            const instance = wrapper.instance();
            expect(instance.getEditor(2)).toBe(editors[1]);
        });
    });

    describe('onRemoveSuccessHandler()', () => {
        test('should remove the correct editor', () => {
            const getEditors = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                getViewer: jest.fn(),
                api
            });
            const instance = wrapper.instance();
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            instance.setState = jest.fn();
            instance.onRemoveSuccessHandler(editors[1]);
            expect(instance.setState).toBeCalledWith({ editors: [{ instance: { id: 1 } }, { instance: { id: 3 } }] });
        });
    });

    describe('onRemove()', () => {
        test('should not do anything if editor not found', () => {
            const getEditors = jest.fn();
            const deleteMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    deleteMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            instance.setState = jest.fn();
            instance.onRemove(5);
            expect(deleteMetadata).not.toBeCalled();
        });
        test('should call metadata delete api', () => {
            const getEditors = jest.fn();
            const deleteMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValue({
                    deleteMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            instance.setState = jest.fn();
            instance.onRemove(1);
            expect(deleteMetadata).toBeCalledWith(
                {},
                editors[1].template,
                expect.any(Function),
                instance.errorCallback
            );
        });
    });

    describe('onAddSuccessHandler()', () => {
        test('should add the new editor', () => {
            const getEditors = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            wrapper.setState({ editors: [{ instance: { id: 1 } }, { instance: { id: 2 } }] });
            instance.setState = jest.fn();
            instance.onAddSuccessHandler({ instance: { id: 3 } });
            expect(instance.setState).toBeCalledWith({
                isLoading: false,
                editors: [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }]
            });
        });
    });

    describe('onAdd()', () => {
        test('should call metadata add api', () => {
            const getEditors = jest.fn();
            const createMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValue({
                    createMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.onAdd('template');
            expect(createMetadata).toBeCalledWith({}, 'template', instance.onAddSuccessHandler, instance.errorCallback);
            expect(instance.setState).toBeCalledWith({
                isLoading: true
            });
        });
    });

    describe('onSaveSuccessHandler()', () => {
        test('should update the correct editor', () => {
            const getEditors = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            instance.setState = jest.fn();
            instance.onSaveSuccessHandler(editors[1], { instance: { id: 5 } });
            expect(instance.setState).toBeCalledWith({
                editors: [{ instance: { id: 1 } }, { instance: { id: 5 } }, { instance: { id: 3 } }]
            });
        });
    });

    describe('onSave()', () => {
        test('should not do anything if editor not found', () => {
            const getEditors = jest.fn();
            const updateMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    updateMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            wrapper.setState({ editors: [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }] });
            instance.setState = jest.fn();
            instance.onSave(5, {});
            expect(updateMetadata).not.toBeCalled();
        });
        test('should call metadata save api', () => {
            const getEditors = jest.fn();
            const updateMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValue({
                    updateMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            instance.setState = jest.fn();
            instance.onSave(1, 'ops');
            expect(updateMetadata).toBeCalledWith(
                {},
                editors[1].template,
                'ops',
                expect.any(Function),
                instance.errorCallback
            );
        });
    });

    describe('onModification()', () => {
        test('should not do anything if editor not found', () => {
            const getEditors = jest.fn();
            const updateMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValueOnce({
                    updateMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            wrapper.setState({ editors: [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }] });
            instance.setState = jest.fn();
            instance.onModification(5, {});
            expect(updateMetadata).not.toBeCalled();
        });
        test('should call metadata save api', () => {
            const getEditors = jest.fn();
            const updateMetadata = jest.fn();
            const api = {
                getMetadataAPI: jest.fn().mockReturnValue({
                    updateMetadata,
                    getEditors
                })
            };
            const wrapper = getWrapper({
                file: {},
                api
            });
            const instance = wrapper.instance();
            const editors = [{ instance: { id: 1 } }, { instance: { id: 2 } }, { instance: { id: 3 } }];
            wrapper.setState({ editors });
            instance.setState = jest.fn();
            instance.onModification(1, true);
            expect(instance.setState).toBeCalledWith({
                editors: [{ instance: { id: 1 }, isDirty: true }, { instance: { id: 2 } }, { instance: { id: 3 } }]
            });
        });
    });
});
