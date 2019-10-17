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
                            email: 'foo@bar.com',
                        },
                    },
                ],
            };

            fileCollaborators.successHandler(response);

            expect(fileCollaborators.successCallback).toBeCalledWith(formattedResponse);
        });
    });
});
