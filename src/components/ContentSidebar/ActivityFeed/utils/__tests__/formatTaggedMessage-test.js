import formatTaggedMessage from '../formatTaggedMessage';

describe('components/ContentSidebar/ActivityFeed/utils/formatTaggedMessage', () => {
    test('should return correct result when shouldReturnString is true', () => {
        const actualResult = formatTaggedMessage('test @[3203255873:test user]', 123, true);
        const expectedResult = 'test @test user';
        expect(actualResult).toEqual(expectedResult);
    });
});
