import getBadItemError from '../error';

describe('getBadItemError()', () => {
    it('should set and get correctly', () => {
        expect(getBadItemError().message).to.equal('Bad box item!');
    });
});
