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

    describe('formatTimestamp', () => {
        let mockVideo;
        let mockPause;
        let mockIntlForTimestamp;

        beforeEach(() => {
            mockPause = jest.fn();
            mockVideo = { currentTime: 0, pause: mockPause };

            const mockMediaDashContainer = { querySelector: () => mockVideo };

            jest.spyOn(document, 'querySelector').mockImplementation(query => {
                if (query === '.bp-media-dash') {
                    return mockMediaDashContainer;
                }

                return null;
            });

            mockIntlForTimestamp = {
                formatMessage: () => 'Seek to video timestamp',
            };
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should format timestamp correctly', () => {
            const commentText = '#[timestamp:123000,versionId:123] with some text';
            const result = formatTaggedMessage(commentText, '123', false, undefined, mockIntlForTimestamp);
            expect(result).toBeDefined();
            const [container, text] = result[0].props.children;
            expect(container.type).toBe('div');
            const child = container.props.children;
            expect(child.props.onClick).toBeDefined();
            expect(child.type).toBe('button');
            expect(child.props.children).toBe('0:02:03');
            expect(text).toBe(' with some text');
        });

        test('should handle click event to set the video current time and pause the video', () => {
            const commentText = ' #[timestamp:123000,versionId:123] with some text';
            const result = formatTaggedMessage(commentText, '123', false, undefined, mockIntlForTimestamp);
            const [div] = result[0].props.children;
            const button = div.props.children;
            const { onClick } = button.props;
            onClick({ preventDefault: jest.fn() });
            expect(mockVideo.currentTime).toBe(123);
            expect(mockPause).toHaveBeenCalled();
        });

        test('should handle empty text', () => {
            const result = formatTaggedMessage('', '123', false, undefined, mockIntlForTimestamp);
            expect(result).toBeDefined();
            expect(result[0]).toBe('');
        });

        test('should handle empty timestamp match', () => {
            const text = 'Check this out';
            const result = formatTaggedMessage(text, '123', false, undefined, mockIntlForTimestamp);
            expect(result[0]).toBe('Check this out');
        });
    });
});
