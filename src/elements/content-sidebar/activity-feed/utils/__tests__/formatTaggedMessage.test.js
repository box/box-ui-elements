import formatTaggedMessage from '../formatTaggedMessage';
import UserLink from '../../common/user-link';

describe('elements/content-sidebar/ActivityFeed/utils/formatTaggedMessage', () => {
    const mockIntl = {
        formatMessage: () => 'Seek to video timestamp',
    };
    test('should return correct result when shouldReturnString is true', () => {
        const actualResult = formatTaggedMessage('test @[3203255873:test user]', 123, true, undefined, mockIntl);
        const expectedResult = 'test @test user';
        expect(actualResult).toEqual(expectedResult);
    });

    test('should return correct timestamp for first item when shouldReturnString is false', () => {
        const taggedMessage = formatTaggedMessage(
            '#[timestamp:123000,versionId:123] with some text @[3203255873:test user]',
            123,
            false,
            undefined,
            mockIntl,
        );
        const timestamp = taggedMessage[0];
        const [button, text] = timestamp.props.children;
        expect(button.props.children.props.children).toBe('0:02:03');
        expect(text).toBe(' with some text ');
        const mention = taggedMessage[1];
        expect(mention.type).toBe(UserLink);
        expect(mention.props.id).toBe('3203255873');
        expect(mention.props.name).toBe('@test user');
    });

    test('should return correct value when shouldReturnString is false', () => {
        const taggedMessage = formatTaggedMessage(
            'with some text @[3203255873:test user]',
            123,
            false,
            undefined,
            mockIntl,
        );
        const text = taggedMessage[0];
        expect(text).toBe('with some text ');
        const mention = taggedMessage[1];
        expect(mention.type).toBe(UserLink);
        expect(mention.props.id).toBe('3203255873');
        expect(mention.props.name).toBe('@test user');
    });
});
