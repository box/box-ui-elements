export const createSuccessMock = responseFromAPI => (itemID, successFn) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(responseFromAPI);
        }, 500);
    }).then(response => {
        successFn(response);
    });
};

export const createItemAPIMock = (fileAPI, folderAPI) => ({
    getFileAPI: jest.fn().mockReturnValue(fileAPI),
    getFolderAPI: jest.fn().mockReturnValue(folderAPI),
});

export const createCollabAPIMock = (fileCollabAPI, folderCollabAPI) => ({
    getFileCollaborationsAPI: jest.fn().mockReturnValue(fileCollabAPI),
    getFolderCollaborationsAPI: jest.fn().mockReturnValue(folderCollabAPI),
});

export const createUsersAPIMock = usersAPI => ({
    getUsersAPI: jest.fn().mockReturnValue(usersAPI),
});
