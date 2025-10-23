import FileCollaborators from '../FileCollaborators';

let fileCollaborators;

describe('api/FileCollaborators', () => {
    beforeEach(() => {
        fileCollaborators = new FileCollaborators({});
    });

    describe('getUrl()', () => {
        test('should throw when collaborators api url without id', () => {
            expect(() => {
                fileCollaborators.getUrl();
            }).toThrow();
        });
        test('should return correct collaborators api url with id', () => {
            expect(fileCollaborators.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/collaborators');
        });
    });

    describe('successHandler()', () => {
        test('should return API response with properly formatted data', () => {
            const collaborator = {
                id: 123,
                name: 'Kanye West',
                login: 'foo@bar.com',
                type: 'user',
            };
            const response = {
                next_marker: null,
                entries: [collaborator],
            };

            fileCollaborators.successCallback = jest.fn();

            const formattedResponse = {
                ...response,
                entries: [
                    {
                        id: 123,
                        name: 'Kanye West',
                        item: {
                            id: 123,
                            name: 'Kanye West',
                            login: 'foo@bar.com',
                            email: 'foo@bar.com',
                            type: 'user',
                        },
                    },
                ],
            };

            fileCollaborators.successHandler(response);

            expect(fileCollaborators.successCallback).toBeCalledWith(formattedResponse);
        });
    });

    describe('getCollaboratorsWithQuery', () => {
        beforeEach(() => {
            fileCollaborators.getFileCollaborators = jest.fn();
        });

        test.each(['', ' ', '   ', null])('should short circuit if there is no search string', string => {
            fileCollaborators.getCollaboratorsWithQuery('file_id', jest.fn(), jest.fn(), string);

            expect(fileCollaborators.getFileCollaborators).not.toBeCalled();
        });

        test('should call the file collaborators api withoutGroups', () => {
            const searchStr = 'foo';
            const successCb = jest.fn();
            const errorCb = jest.fn();

            fileCollaborators.getCollaboratorsWithQuery('file_id', successCb, errorCb, searchStr);

            expect(fileCollaborators.getFileCollaborators).toBeCalledWith('file_id', successCb, errorCb, {
                filter_term: searchStr,
                include_groups: false,
                include_uploader_collabs: false,
                respect_hidden_collabs: false,
            });
        });

        test('should get collaborators with groups', () => {
            const searchStr = 'foo';
            const includeGroups = true;
            const successCb = jest.fn();
            const errorCb = jest.fn();

            fileCollaborators.getCollaboratorsWithQuery('file_id', successCb, errorCb, searchStr, { includeGroups });

            expect(fileCollaborators.getFileCollaborators).toBeCalledWith('file_id', successCb, errorCb, {
                filter_term: searchStr,
                include_groups: true,
                include_uploader_collabs: false,
                respect_hidden_collabs: false,
            });
        });

        test('should get collaborators respecting hidden collaborators', () => {
            const searchStr = 'foo';
            const respectHiddenCollabs = true;
            const successCb = jest.fn();
            const errorCb = jest.fn();

            fileCollaborators.getCollaboratorsWithQuery('file_id', successCb, errorCb, searchStr, {
                respectHiddenCollabs,
            });

            expect(fileCollaborators.getFileCollaborators).toBeCalledWith('file_id', successCb, errorCb, {
                filter_term: searchStr,
                include_groups: false,
                include_uploader_collabs: false,
                respect_hidden_collabs: true,
            });
        });
    });
});
