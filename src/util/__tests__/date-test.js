import date, { getDate, getDateTime } from '../date';

const sandbox = sinon.sandbox.create();

describe('util/date', () => {
    describe('getDate()', () => {
        it('should return today for today', () => {
            expect(getDate(new Date(), 'foo', 'bar')).to.equal('foo');
        });
        it('should return yesterday for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(getDate(yesterday, 'foo', 'bar')).to.equal('bar');
        });
        it('should return proper date', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(getDate(new Date('2000-03-31T16:20:30-08:00'))).to.equal('Fri Mar 31 2000');
        });
    });
    describe('getDateTime()', () => {
        /* eslint-disable no-underscore-dangle */
        it('should return today with time for today', () => {
            const d = new Date('2000-03-31T16:20:30-08:00');
            date.__Rewire__('getDate', sandbox.mock().returns('foo'));
            expect(getDateTime(d, 'foo', 'bar')).to.equal('foo, 4:20:30 PM PST');
            date.__ResetDependency__('getDate');
        });
        it('should return yesterday with time for yesterday', () => {
            const d = new Date('2000-03-31T16:20:30-08:00');
            date.__Rewire__('getDate', sandbox.mock().returns('bar'));
            expect(getDateTime(d, 'foo', 'bar')).to.equal('bar, 4:20:30 PM PST');
            date.__ResetDependency__('getDate');
        });
        /* eslint-enable no-underscore-dangle */
        it('should return proper date time', () => {
            const d = new Date('2000-03-31T16:20:30-08:00');
            expect(getDateTime(d)).to.equal('Fri Mar 31 2000, 4:20:30 PM PST');
        });
    });
});
