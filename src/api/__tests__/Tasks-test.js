import Tasks from '../Tasks';

let tasks;

describe('api/Tasks', () => {
    beforeEach(() => {
        tasks = new Tasks({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                tasks.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(tasks.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/tasks');
        });
    });

    describe('successHandler()', () => {
        test('should return API response with properly formatted data', () => {
            const task = {
                type: 'task',
                id: '1234',
                created_at: { name: 'Jay-Z', id: 10 },
                due_at: 1234567891,
                message: 'test',
                task_assignment_collection: {
                    entries: []
                }
            };
            const response = {
                total_count: 1,
                entries: [task]
            };

            tasks.successCallback = jest.fn();

            const formattedResponse = {
                ...response,
                entries: [
                    {
                        type: 'task',
                        id: '1234',
                        createdAt: { name: 'Jay-Z', id: 10 },
                        dueAt: 1234567891,
                        message: 'test',
                        assignees: []
                    }
                ]
            };

            tasks.successHandler(response);
            expect(tasks.successCallback).toBeCalledWith(formattedResponse);
        });
    });
});
