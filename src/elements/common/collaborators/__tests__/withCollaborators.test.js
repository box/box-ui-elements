// @flow
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import type { WithCollaboratorsProps } from '../withCollaborators';

import withCollaborators from '../withCollaborators';

jest.mock('lodash/debounce', () => jest.fn(i => i));

describe('elements/common/collaborators/withCollaborators', () => {
    const fileId = '1';
    let wrapper;
    let successCb;
    let errorCb;
    let searchStr;
    let includeGroups;

    const TestComponent = (props: WithCollaboratorsProps) => (
        <div>
            <button
                type="button"
                data-testid="mocked-button"
                onClick={() =>
                    props.getCollaboratorsWithQuery(fileId, successCb, errorCb, searchStr, { includeGroups })
                }
            />
        </div>
    );
    const WrappedComponent = withCollaborators(TestComponent);

    const fileCollaboratorsAPI = {
        getFileCollaborators: jest.fn(),
    };
    const api = {
        getFileCollaboratorsAPI: () => fileCollaboratorsAPI,
    };

    const getWrapper = () => render(<WrappedComponent api={api} />);

    beforeEach(() => {
        successCb = jest.fn();
        errorCb = jest.fn();
        wrapper = getWrapper();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getCollaborators', () => {
        test.each(['', ' ', '   ', null])('should short circuit if there is no search string', string => {
            searchStr = string;
            const button = wrapper.getByTestId('mocked-button');

            act(() => {
                fireEvent.click(button);
            });

            expect(fileCollaboratorsAPI.getFileCollaborators).not.toBeCalled();
        });

        test('should call the file collaborators api', () => {
            searchStr = 'foo';
            includeGroups = false;
            const button = wrapper.getByTestId('mocked-button');

            act(() => {
                fireEvent.click(button);
            });

            expect(fileCollaboratorsAPI.getFileCollaborators).toBeCalledWith(fileId, successCb, errorCb, {
                filter_term: searchStr,
                include_groups: false,
                include_uploader_collabs: false,
            });
        });

        test('should get collaborators with groups', () => {
            searchStr = 'foo';
            includeGroups = true;
            const button = wrapper.getByTestId('mocked-button');

            act(() => {
                fireEvent.click(button);
            });

            expect(fileCollaboratorsAPI.getFileCollaborators).toBeCalledWith(fileId, successCb, errorCb, {
                filter_term: searchStr,
                include_groups: true,
                include_uploader_collabs: false,
            });
        });
    });
});
