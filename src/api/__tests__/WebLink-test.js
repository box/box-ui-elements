import WebLink from '../WebLink';

let webLink;

describe('api/WebLink', () => {
    beforeEach(() => {
        webLink = new WebLink({});
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(webLink.getCacheKey('foo')).toBe('web_link_foo');
        });
    });

    describe('getUrl()', () => {
        test('should return correct web link api url without id', () => {
            expect(webLink.getUrl()).toBe('https://api.box.com/2.0/web_links');
        });
        test('should return correct web link api url with id', () => {
            expect(webLink.getUrl('foo')).toBe('https://api.box.com/2.0/web_links/foo');
        });
    });
});
