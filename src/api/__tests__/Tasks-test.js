import Tasks from '../Tasks';
import { getTasksFields } from '../../util/fields';

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
            expect(tasks.getUrl('foo')).toBe(`https://api.box.com/2.0/files/foo/tasks?fields=${getTasksFields()}`);
        });
    });
});
