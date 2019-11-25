import BoxEdit from '../BoxEdit';
import Browser from '../BrowserUtils';

describe('api/box-edit/BoxEdit', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    test('should create a singleton', () => {
        const boxEdit1 = new BoxEdit();
        const boxEdit2 = new BoxEdit();

        expect(boxEdit1).toEqual(boxEdit2);
    });

    // TODO: constructor and getBoxEditAvailability tests

    describe('processExtensionRequestQueue()', () => {
        const unoDosResolution = {
            default_application_name: [
                {
                    uno: 'One',
                },
                {
                    dos: 'Two',
                },
            ],
        };

        test('should flush the extension request queue when called', () => {
            const boxEdit = new BoxEdit();
            boxEdit.client = {
                sendRequest: jest.fn().mockResolvedValue(unoDosResolution),
            };
            boxEdit.queueGetNativeAppNameFromLocal('uno');
            boxEdit.queueGetNativeAppNameFromLocal('dos');

            boxEdit.processExtensionRequestQueue();

            expect(boxEdit.extensionRequestQueue.has('uno')).toBe(false);
            expect(boxEdit.extensionRequestQueue.has('dos')).toBe(false);
        });

        test('should send a bulk request corresponding to the items in the extension request queue when called', () => {
            const boxEdit = new BoxEdit();
            boxEdit.client = {
                sendRequest: jest.fn().mockResolvedValue(unoDosResolution),
            };
            boxEdit.queueGetNativeAppNameFromLocal('uno');
            boxEdit.queueGetNativeAppNameFromLocal('dos');

            boxEdit.processExtensionRequestQueue();

            const parsedRequestData = JSON.parse(boxEdit.client.sendRequest.mock.calls[0]);

            expect(parsedRequestData).toEqual({
                request_type: 'get_default_application',
                extension: ['uno', 'dos'],
            });
        });

        test('should resolve enqueued requests when the app for one filetype is requested', done => {
            const resolution = {
                default_application_name: [
                    {
                        pdf: 'Acrobat',
                    },
                ],
            };
            const boxEdit = new BoxEdit();
            boxEdit.client = {
                sendRequest: jest.fn().mockResolvedValue(resolution),
            };

            boxEdit.queueGetNativeAppNameFromLocal('pdf').then(result => {
                expect(result).toEqual('Acrobat');
                done();
            });

            boxEdit.processExtensionRequestQueue();
        });

        test('should resolve enqueued request when the apps for multiple filetypes are requested', done => {
            const resolution = {
                default_application_name: [
                    {
                        pdf: 'Acrobat',
                    },
                    {
                        docx: 'Word',
                    },
                ],
            };
            const boxEdit = new BoxEdit();
            boxEdit.client = {
                sendRequest: jest.fn().mockResolvedValue(resolution),
            };

            Promise.all([
                boxEdit.queueGetNativeAppNameFromLocal('pdf'),
                boxEdit.queueGetNativeAppNameFromLocal('docx'),
            ]).then(result => {
                expect(result).toEqual(['Acrobat', 'Word']);
                done();
            });

            boxEdit.processExtensionRequestQueue();
        });
    });

    describe('queueGetNativeAppNameFromLocal()', () => {
        test('should return the app name when called for an extension whose app is known', async () => {
            const boxEdit = new BoxEdit();
            boxEdit.extensionRequestQueue.set('docx', {
                promise: Promise.resolve('Word'),
                resolve: () => {},
                reject: () => {},
            });

            const result = await boxEdit.queueGetNativeAppNameFromLocal('docx');

            expect(result).toEqual('Word');
        });

        test('should create a new item in the extensionRequestQueue when called for an extension whose app is not yet known', () => {
            const boxEdit = new BoxEdit();

            expect(boxEdit.extensionRequestQueue.has('abc')).toBe(false);

            boxEdit.queueGetNativeAppNameFromLocal('abc');

            const queueItem = boxEdit.extensionRequestQueue.get('abc');

            expect(queueItem.promise).toBeInstanceOf(Promise);
            expect(queueItem.resolve).toBeInstanceOf(Function);
            expect(queueItem.reject).toBeInstanceOf(Function);
        });
    });

    describe('getAppForExtension()', () => {
        test('should set a timeout to process the queue and return the app extension when called', done => {
            const boxEdit = new BoxEdit();
            boxEdit.processExtensionRequestQueue = jest.fn();
            boxEdit.queueGetNativeAppNameFromLocal = jest.fn().mockResolvedValue('Word');

            boxEdit.getAppForExtension('docx').then(result => {
                expect(result).toEqual('Word');
                expect(boxEdit.processExtensionRequestQueue).toBeCalled();
                done();
            });

            jest.advanceTimersByTime(101);
        });
    });

    describe('canOpenWithBoxEdit()', () => {
        describe.each([
            [
                {
                    pdf: 'Acrobat',
                },
            ],
            [
                {
                    pdf: 'Acrobat',
                    docx: 'Word',
                },
            ],
        ])('%o', extToAppArray => {
            test('should aggregate the results of calls to getAppForExtension', async () => {
                // const extensions = extToAppArray.map(pair => pair[0]);
                const boxEdit = new BoxEdit();
                boxEdit.getAppForExtension = jest.fn(extension => Promise.resolve(extToAppArray[extension]));

                const result = await boxEdit.canOpenWithBoxEdit(Object.keys(extToAppArray));

                Object.keys(extToAppArray).forEach(extension => {
                    expect(result.get(extension)).toEqual(extToAppArray[extension]);
                });
            });
        });

        test('should gracefully handle when no app is available to open a file', async () => {
            const boxEdit = new BoxEdit();
            const resultMap = {
                pdf: 'Acrobat',
                xlsx: '',
            };

            boxEdit.getAppForExtension = jest.fn(extension => resultMap[extension]);

            const result = await boxEdit.canOpenWithBoxEdit(['pdf', 'xlsx']);

            [
                ['pdf', 'Acrobat'],
                ['xlsx', ''],
            ].forEach(pair => {
                const [extension, appName] = pair;
                expect(result.get(extension)).toEqual(appName);
            });
        });
    });

    describe('openFile()', () => {
        test('should call #sendCommand on the appropriate channel with the correct data when called', async () => {
            const expectedBrowser = 'Opera';

            Browser.getName = jest.fn().mockReturnValue(expectedBrowser);

            const itemID = '1234';
            const expected = 'success';

            const token = {
                data: {
                    auth_code: 'foo',
                },
            };

            const boxEdit = new BoxEdit();
            boxEdit.client = {
                sendCommand: jest.fn().mockResolvedValue(expected),
            };

            const result = await boxEdit.openFile(itemID, token);

            // TODO. more assertions as appropriate.
            const commandData = JSON.parse(boxEdit.client.sendCommand.mock.calls[0][0]);
            expect(result).toEqual(expected);

            expect(commandData.command_type).toEqual('launch_application');
            expect(commandData.file_id).toEqual(itemID);
            expect(commandData.auth_code).toEqual(token.data.auth_code);
            expect(commandData.browser_type).toEqual(expectedBrowser);
        });
    });
});
