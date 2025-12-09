export const createSuccessMock = responseFromApi => (itemId, successFn) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(responseFromApi);
        }, 500);
    }).then(response => {
        successFn(response);
    });
};

export const createItemApiMock = (fileApi, folderApi) => ({
    getFileAPI: jest.fn().mockReturnValue(fileApi),
    getFolderAPI: jest.fn().mockReturnValue(folderApi),
});

export const createCollabApiMock = (fileCollabApi, folderCollabApi) => ({
    getFileCollaborationsAPI: jest.fn().mockReturnValue(fileCollabApi),
    getFolderCollaborationsAPI: jest.fn().mockReturnValue(folderCollabApi),
});

export const createUsersApiMock = usersApi => ({
    getUsersAPI: jest.fn().mockReturnValue(usersApi),
});
