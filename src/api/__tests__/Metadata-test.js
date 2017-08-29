import Metadata from '../Metadata';

let metadata;
const sandbox = sinon.sandbox.create();

describe('api/Metadata', () => {
    beforeEach(() => {
        metadata = new Metadata();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(metadata.getCacheKey('foo')).to.equal('metadata_foo');
        });
    });
});
