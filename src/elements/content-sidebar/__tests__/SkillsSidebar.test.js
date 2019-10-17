import React from 'react';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';
import { SkillsSidebarComponent as SkillsSidebar } from '../SkillsSidebar';
import SidebarSkills from '../skills/SidebarSkills';

describe('elements/content-sidebar/Skills/SkillsSidebar', () => {
    const getWrapper = (props, options) =>
        shallow(<SkillsSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, options);

    test('should render skills sidebar component when cards are available', () => {
        const getSkills = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getSkills,
            }),
        };
        const wrapper = getWrapper({
            file: {},
            getPreviewer: jest.fn(),
            api,
        });
        wrapper.setState({ cards: [] });
        expect(wrapper.find(SidebarSkills)).toHaveLength(1);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getSkills).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render loading indicator component when cards are not available', () => {
        const getSkills = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getSkills,
            }),
        };
        const wrapper = getWrapper({
            file: {},
            getPreviewer: jest.fn(),
            api,
        });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(SidebarSkills)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getSkills).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    describe('constructor()', () => {
        let onReadyMetric;
        beforeEach(() => {
            const wrapper = getWrapper(
                {},
                {
                    disableLifecycleMethods: true,
                },
            );
            ({ onReadyMetric } = wrapper.instance().props.logger);
        });

        test('should emit when js loaded', () => {
            expect(onReadyMetric).toHaveBeenCalledWith({
                endMarkName: expect.any(String),
            });
        });
    });

    describe('onSave()', () => {
        test('should not do anything when no card exists', () => {
            const updateSkills = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                updateSkills,
            });
            const api = { getMetadataAPI };
            const wrapper = getWrapper(
                {
                    file: { permissions: { can_upload: true } },
                    api,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            const cards = [];
            wrapper.setState({ cards });
            instance.onSave(0);
            expect(updateSkills).not.toBeCalled();
            expect(getMetadataAPI).not.toBeCalled();
        });

        test('should not do anything when upload permission isnt true', () => {
            const updateSkills = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                updateSkills,
            });
            const api = { getMetadataAPI };
            const wrapper = getWrapper(
                {
                    file: {},
                    api,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            const cards = [{}];
            wrapper.setState({ cards });
            instance.onSave(0);
            expect(updateSkills).not.toBeCalled();
            expect(getMetadataAPI).not.toBeCalled();
        });

        test('should not do anything when no ops', () => {
            const updateSkills = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                updateSkills,
            });
            const api = { getMetadataAPI };
            const wrapper = getWrapper(
                {
                    file: { permissions: { can_upload: true } },
                    api,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            const cards = [{}];
            wrapper.setState({ cards });
            instance.onSave(0);
            expect(updateSkills).not.toBeCalled();
            expect(getMetadataAPI).not.toBeCalled();
        });

        test('should call the skills api with coreect ops', () => {
            const file = { permissions: { can_upload: true } };
            const card = {
                entries: [
                    'entry0',
                    'entry1',
                    'entry2',
                    'entry3',
                    'entry4',
                    'entry5',
                    'entry6',
                    'entry7',
                    'entry8',
                    'entry9',
                    'entry10',
                    'entry11',
                    'entry12',
                ],
            };
            const adds = ['entry13', 'entry14'];
            const removes = ['entry4', 'entry9', 'entry2', 'entry11', 'entry6', 'entry10', 'entry12'];
            const replaces = [
                { replaced: 'entry8', replacement: 'entry8-new' },
                { replaced: 'entry1', replacement: 'entry1-new' },
                { replaced: 'entry7', replacement: 'entry7-new' },
            ];

            const updateSkills = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                updateSkills,
            });
            const api = { getMetadataAPI };
            const wrapper = getWrapper(
                {
                    file,
                    api,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            const cards = [card];
            wrapper.setState({ cards });
            instance.onSave(0, removes, adds, replaces);
            expect(getMetadataAPI).toBeCalledWith(false);
            expect(updateSkills).toBeCalledWith(
                file,
                [
                    { op: 'test', path: '/cards/0', value: card },
                    { op: 'replace', path: '/cards/0/entries/8', value: 'entry8-new' },
                    { op: 'replace', path: '/cards/0/entries/1', value: 'entry1-new' },
                    { op: 'replace', path: '/cards/0/entries/7', value: 'entry7-new' },
                    { op: 'remove', path: '/cards/0/entries/12' },
                    { op: 'remove', path: '/cards/0/entries/11' },
                    { op: 'remove', path: '/cards/0/entries/10' },
                    { op: 'remove', path: '/cards/0/entries/9' },
                    { op: 'remove', path: '/cards/0/entries/6' },
                    { op: 'remove', path: '/cards/0/entries/4' },
                    { op: 'remove', path: '/cards/0/entries/2' },
                    { op: 'add', path: '/cards/0/entries/-', value: 'entry13' },
                    { op: 'add', path: '/cards/0/entries/-', value: 'entry14' },
                ],
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('onSaveSuccessHandler()', () => {
        test('should save the updated cards and remove errored card', () => {
            const errors = {
                0: true,
                1: true,
            };
            const wrapper = getWrapper(
                {},
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            wrapper.setState({ errors });
            instance.setState = jest.fn();
            instance.updatePreviewTranscript = jest.fn();
            instance.onSaveSuccessHandler(1, 'updated');
            expect(instance.updatePreviewTranscript).toBeCalledWith('updated');
            expect(instance.setState).toBeCalledWith({
                cards: 'updated',
                errors: { 0: true },
            });
        });
    });

    describe('onSaveErrorHandler()', () => {
        test('should set flag for errored card', () => {
            const errors = {
                0: true,
            };
            const wrapper = getWrapper(
                {},
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            wrapper.setState({ errors });
            instance.setState = jest.fn();
            instance.onSaveErrorHandler(1);
            expect(instance.setState).toBeCalledWith({
                errors: { 0: true, 1: true },
            });
        });
    });

    describe('fetchSkillsSuccessCallback()', () => {
        test('update state with fetched skills', () => {
            const wrapper = getWrapper(
                {},
                {
                    disableLifecycleMethods: true,
                },
            );
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.updatePreviewTranscript = jest.fn();
            instance.fetchSkillsSuccessCallback('cards');
            expect(instance.updatePreviewTranscript).toBeCalledWith('cards');
            expect(instance.setState).toBeCalledWith({
                cards: 'cards',
            });
        });
    });

    describe('componentDidMount()', () => {
        test('should fetch skills', () => {
            const getSkills = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                getSkills,
            });
            const api = { getMetadataAPI };
            const file = { permissions: { can_upload: true } };
            const wrapper = getWrapper({
                file,
                api,
            });
            const instance = wrapper.instance();
            expect(getMetadataAPI).toBeCalledWith(false);
            expect(getSkills).toBeCalledWith(file, instance.fetchSkillsSuccessCallback, noop);
        });
    });

    describe('componentDidUpdate()', () => {
        let getSkills;
        let getMetadataAPI;
        let wrapper;

        beforeEach(() => {
            getSkills = jest.fn();
            getMetadataAPI = jest.fn().mockReturnValue({
                getSkills,
            });
            const api = { getMetadataAPI };
            const file = { permissions: { can_upload: true } };
            wrapper = getWrapper({
                file,
                api,
                refreshIdentity: false,
            });
            wrapper.instance();
        });

        test('should fetch skills if refreshIdentity changed', () => {
            wrapper.setProps({ refreshIdentity: true });
            expect(getMetadataAPI).toBeCalledWith(false);
            expect(getSkills.mock.calls.length).toEqual(2);
        });

        test('should not fetch skills if refreshIdentity did not change', () => {
            wrapper.setProps({ refreshIdentity: false });
            expect(getMetadataAPI).toBeCalledWith(false);
            expect(getSkills.mock.calls.length).toEqual(1);
        });
    });
});
