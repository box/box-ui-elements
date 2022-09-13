import * as React from 'react';
import { shallow } from 'enzyme';
import withCollaborators from '../withCollaborators';

jest.mock('lodash/debounce', () => jest.fn(i => i));

describe('elements/common/withCollaborators', () => {
    const TestComponent = props => <div {...props} />;
    const WrappedComponent = withCollaborators(TestComponent);
    const fileCollaboratorsAPI = {
        getFileCollaborators: jest.fn(),
    };
    const api = {
        getFileCollaboratorsAPI: () => fileCollaboratorsAPI,
    };
    const defaultProps = { api };
    const getWrapper = props => shallow(<WrappedComponent {...defaultProps} {...props} />);
    let fileId;
    let wrapper;
    let instance;
    let successCb;
    let errorCb;
    beforeEach(() => {
        fileId = '1';
        successCb = jest.fn();
        errorCb = jest.fn();
        wrapper = getWrapper({
            api,
        });
        instance = wrapper.instance();
    });
    describe('getCollaborators', () => {
        test('should short circuit if there is no search string', () => {
            instance.getCollaborators(fileId, successCb, errorCb);
            instance.getCollaborators(fileId, successCb, errorCb, '');
            instance.getCollaborators(fileId, successCb, errorCb, '  ');
            expect(fileCollaboratorsAPI.getFileCollaborators).not.toHaveBeenCalled();
        });
        test('should call the file collaborators api', () => {
            const searchStr = 'foo';
            instance.getCollaborators(fileId, successCb, errorCb, searchStr);
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(fileId, successCb, errorCb, {
                filter_term: searchStr,
                include_groups: false,
                include_uploader_collabs: false,
            });
        });
    });
    describe('getCollaboratorsWithQuery', () => {
        let getCollaboratorsSpy;
        beforeEach(() => {
            getCollaboratorsSpy = jest.spyOn(instance, 'getCollaborators');
        });
        test('should get collaborators without groups', () => {
            const search = 'Santa Claus';
            instance.getCollaboratorsWithQuery(fileId, successCb, errorCb, search);
            expect(getCollaboratorsSpy).toHaveBeenCalledWith(fileId, successCb, errorCb, search, {
                includeGroups: false,
            });
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(fileId, successCb, errorCb, {
                filter_term: search,
                include_groups: false,
                include_uploader_collabs: false,
            });
        });
        test('should get collaborators with groups', () => {
            getCollaboratorsSpy = jest.spyOn(instance, 'getCollaborators');
            const search = 'Santa Claus';
            instance.getCollaboratorsWithQuery(fileId, successCb, errorCb, search, { includeGroups: true });
            expect(getCollaboratorsSpy).toHaveBeenCalledWith(fileId, successCb, errorCb, search, {
                includeGroups: true,
            });
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(fileId, successCb, errorCb, {
                filter_term: search,
                include_groups: true,
                include_uploader_collabs: false,
            });
        });
    });
});
