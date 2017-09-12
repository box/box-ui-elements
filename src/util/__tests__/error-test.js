import getBadItemError from '../error';

describe('util/error/getBadItemError()', () => {
    it('should set and get correctly', () => {
        expect(getBadItemError().message).to.equal('Bad box item!');
    });
});
