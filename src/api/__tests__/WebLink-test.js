import WebLink from '../WebLink';

let webLink;
const sandbox = sinon.sandbox.create();

describe('api/WebLink', () => {
    beforeEach(() => {
        webLink = new WebLink();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(webLink.getCacheKey('foo')).to.equal('web_link_foo');
        });
    });

    describe('getUrl()', () => {
        it('should return correct web link api url without id', () => {
            expect(webLink.getUrl()).to.equal('https://api.box.com/2.0/web_links');
        });
        it('should return correct web link api url with id', () => {
            expect(webLink.getUrl('foo')).to.equal('https://api.box.com/2.0/web_links/foo');
        });
    });
});
