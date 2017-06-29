import getDate from '../date';

describe('size', () => {
    it('should return today for today', () => {
        expect(getDate(new Date(), 'foo', 'bar')).to.equal('foo');
    });
    it('should return yesterday for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(getDate(yesterday, 'foo', 'bar')).to.equal('bar');
    });
    it('should return yesterday for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(getDate(new Date('2000-03-31T16:20:30-08:00'))).to.equal('Fri Mar 31 2000');
    });
});
